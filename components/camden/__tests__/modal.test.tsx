import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CamdenModal } from "../modal";

describe("CamdenModal", () => {
  it("renders in the dialog layer, locks page scroll, and closes from its controls", async () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <CamdenModal open={false} onClose={onClose} title="Request cancellation">
        Form fields
      </CamdenModal>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    rerender(
      <CamdenModal
        open
        onClose={onClose}
        title="Request cancellation"
        description="Auditable request"
      >
        Form fields
      </CamdenModal>,
    );

    const dialog = await screen.findByRole("dialog", {
      name: "Request cancellation",
    });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveTextContent("Form fields");
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(
      screen.getByRole("button", { name: "Close Request cancellation" }),
    );
    expect(onClose).toHaveBeenCalledOnce();

    rerender(
      <CamdenModal open={false} onClose={onClose} title="Request cancellation">
        Form fields
      </CamdenModal>,
    );
    await waitFor(() => expect(document.body.style.overflow).toBe(""));
  });

  it("handles Escape through the native dialog cancel event", async () => {
    const onClose = vi.fn();
    render(
      <CamdenModal open onClose={onClose} title="Update status">
        Form fields
      </CamdenModal>,
    );

    fireEvent(
      await screen.findByRole("dialog"),
      new Event("cancel", { cancelable: true }),
    );
    expect(onClose).toHaveBeenCalledOnce();
  });
});
