import { groq } from "next-sanity";
import { inngest } from "../client";
import { revalidatePaths } from "@/lib/revalidation";
import { writeClient } from "@/sanity/lib/client";
import { processProduct, type PrintifyProduct } from "./sync-printify";

const PRINTIFY_API_URL = "https://api.printify.com/v1";

interface PrintifyPublishEventData {
  printifyEventId: string;
  productId: string;
  shopId: string;
  action: "create" | "update" | "delete";
}

async function printifyRequest(path: string, init: RequestInit = {}) {
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) throw new Error("Missing PRINTIFY_API_TOKEN");

  const response = await fetch(`${PRINTIFY_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "LakeRidePros/1.0",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Printify request failed: ${response.status} - ${errorText}`,
    );
  }

  return response;
}

async function fetchPrintifyProduct(shopId: string, productId: string) {
  const response = await printifyRequest(
    `/shops/${shopId}/products/${productId}.json`,
  );
  return response.json() as Promise<PrintifyProduct>;
}

async function acknowledgePublishingSucceeded(
  shopId: string,
  productId: string,
  sanityProductId: string,
  productUrl: string,
) {
  await printifyRequest(
    `/shops/${shopId}/products/${productId}/publishing_succeeded.json`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        external: {
          id: sanityProductId,
          handle: productUrl,
        },
      }),
    },
  );
}

async function acknowledgePublishingFailed(
  shopId: string,
  productId: string,
  reason: string,
) {
  await printifyRequest(
    `/shops/${shopId}/products/${productId}/publishing_failed.json`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: reason.substring(0, 500) }),
    },
  );
}

async function acknowledgeProductUnpublished(shopId: string, productId: string) {
  await printifyRequest(
    `/shops/${shopId}/products/${productId}/unpublish.json`,
    { method: "POST" },
  );
}

async function deactivateSanityProduct(productId: string) {
  const product = await writeClient.fetch(
    groq`*[_type == "product" && printifyProductId == $productId][0]{ _id }`,
    { productId },
  );

  if (!product?._id) return null;

  await writeClient.patch(product._id).set({ status: "draft" }).commit();
  return product;
}

function getPublicStoreUrl() {
  return (
    process.env.NEXT_PUBLIC_SERVER_URL || "https://www.lakeridepros.com"
  ).replace(/\/$/, "");
}

export const syncPrintifyPublishedProduct = inngest.createFunction(
  {
    id: "sync-published-printify-product",
    name: "Sync Published Printify Product",
    retries: 2,
    concurrency: {
      limit: 1,
      key: "event.data.productId",
    },
    triggers: [{ event: "printify/product.publish.requested" }],
    onFailure: async ({ event, step, error }) => {
      const originalEvent = event.data.event;
      const data = originalEvent.data as unknown as PrintifyPublishEventData;

      await step.run("acknowledge-publishing-failed", async () => {
        await acknowledgePublishingFailed(
          data.shopId,
          data.productId,
          error.message,
        );
      });
    },
  },
  async ({ event, step }) => {
    const data = event.data as PrintifyPublishEventData;

    if (data.shopId !== process.env.PRINTIFY_SHOP_ID) {
      throw new Error("Publish event shop does not match PRINTIFY_SHOP_ID");
    }

    const storeUrl = getPublicStoreUrl();

    if (data.action === "delete") {
      const deactivated = await step.run(
        "deactivate-sanity-product",
        async () => {
          return deactivateSanityProduct(data.productId);
        },
      );

      await step.run("revalidate-unpublished-product", async () => {
        await revalidatePaths(["/shop", "/"]);
      });

      await step.run("acknowledge-unpublish", async () => {
        await acknowledgeProductUnpublished(data.shopId, data.productId);
      });

      return {
        success: true,
        action: "delete",
        productId: data.productId,
        sanityProductId: deactivated?._id || null,
      };
    }

    const product = await step.run("fetch-printify-product", async () => {
      return fetchPrintifyProduct(data.shopId, data.productId);
    });

    const result = await step.run("sync-product-to-sanity", async () => {
      return processProduct(product);
    });

    const productPath = `/shop/products/${result.slug}`;
    const productUrl = `${storeUrl}${productPath}`;

    await step.run("revalidate-published-product", async () => {
      await revalidatePaths(["/shop", "/", productPath]);
    });

    await step.run("acknowledge-publishing-succeeded", async () => {
      await acknowledgePublishingSucceeded(
        data.shopId,
        data.productId,
        result.sanityProductId,
        productUrl,
      );
    });

    return {
      success: true,
      action: data.action,
      productId: data.productId,
      sanityProductId: result.sanityProductId,
      productUrl,
    };
  },
);
