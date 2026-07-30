import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { syncPrintifyProducts } from "@/lib/inngest/functions/sync-printify";
import { syncPrintifyPublishedProduct } from "@/lib/inngest/functions/sync-published-printify";
import {
  postBlogToSocial,
  sharePostNow,
} from "@/lib/inngest/functions/post-to-social";
import { generateWinnerVideo } from "@/lib/inngest/functions/generate-winner-video";
import { syncInsiderChargebeeSubscription } from "@/lib/inngest/functions/sync-insider-chargebee";
import { reconcileInsiderRewards } from "@/lib/inngest/functions/reconcile-insider-rewards";
import { dispatchInsiderNotifications } from "@/lib/inngest/functions/dispatch-insider-notifications";
import { generateInsiderMonthlyRecaps } from "@/lib/inngest/functions/generate-insider-monthly-recaps";

// Create the Inngest API handler with all functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncPrintifyProducts,
    syncPrintifyPublishedProduct,
    postBlogToSocial,
    sharePostNow,
    generateWinnerVideo,
    syncInsiderChargebeeSubscription,
    reconcileInsiderRewards,
    dispatchInsiderNotifications,
    generateInsiderMonthlyRecaps,
  ],
});
