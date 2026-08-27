import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { SnapshotFilter } from "../snapshot-filter"

describe("SnapshotFilter", () => {
  it("provides named preset filters and an accessible custom date range", async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(<SnapshotFilter idPrefix="test" value={{ period: "current_month" }} onApply={onApply} />)

    await user.selectOptions(screen.getByRole("combobox", { name: "Reporting period" }), "custom")
    const start = screen.getByLabelText("Start date")
    const end = screen.getByLabelText("End date")
    expect(start).toBeRequired()
    expect(end).toBeRequired()
    expect(screen.getByRole("button", { name: "Apply filter" })).toBeDisabled()

    await user.type(start, "2026-08-01")
    await user.type(end, "2026-08-27")
    await user.click(screen.getByRole("button", { name: "Apply filter" }))

    expect(onApply).toHaveBeenCalledWith({ period: "custom", startDate: "2026-08-01", endDate: "2026-08-27" })
  })

  it("drops stale custom dates when applying a preset", async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(<SnapshotFilter idPrefix="test" value={{ period: "custom", startDate: "2026-08-01", endDate: "2026-08-27" }} onApply={onApply} />)

    await user.selectOptions(screen.getByRole("combobox", { name: "Reporting period" }), "program_to_date")
    await user.click(screen.getByRole("button", { name: "Apply filter" }))

    expect(onApply).toHaveBeenCalledWith({ period: "program_to_date" })
  })
})
