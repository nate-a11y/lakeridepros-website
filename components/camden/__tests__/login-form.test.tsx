import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { CamdenLoginForm } from "../login-form"

vi.mock("next/navigation", () => ({ useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }) }))
vi.mock("@/lib/camden/service", () => ({ isCamdenDemoEnabled: () => false }))
vi.mock("../portal-shell", () => ({ PortalShell: ({ children }: { children: ReactNode }) => <main>{children}</main> }))
vi.mock("@/components/Turnstile", () => ({ default: ({ onSuccess }: { onSuccess: (token: string) => void }) => <button type="button" onClick={() => onSuccess("test-captcha")}>Complete security check</button> }))

afterEach(() => vi.unstubAllGlobals())

describe("Camden login SMS consent", () => {
  it("shows code-only consent, rates, opt-out, help and policy links directly below the SMS action", () => {
    render(<CamdenLoginForm />)

    const phone = screen.getByRole("textbox", { name: "Mobile phone number" })
    const disclosure = document.getElementById(phone.getAttribute("aria-describedby")!)!
    expect(disclosure).toBeVisible()
    expect(disclosure).toHaveTextContent('By selecting “Text me a code,” you agree to receive the sign-in code you requested by SMS from Lake Ride Pros.')
    expect(disclosure).toHaveTextContent("Message frequency varies with your requests. Message and data rates may apply.")
    expect(disclosure).toHaveTextContent("Reply STOP to opt out or HELP for help.")
    expect(disclosure).toHaveTextContent("This action does not subscribe you to ride updates or marketing messages.")
    const action = screen.getByRole("button", { name: "Text me a code" })
    expect(action).toHaveAttribute("aria-describedby", disclosure.id)
    expect(action).toHaveAccessibleDescription(/By selecting “Text me a code,” you agree to receive the sign-in code you requested by SMS from Lake Ride Pros/)
    expect(action.nextElementSibling).toBe(disclosure)
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute("href", "/privacy-policy")
    expect(screen.getByRole("link", { name: "Terms of Service" })).toHaveAttribute("href", "/terms-of-service")
    expect(screen.getByRole("link", { name: "(573) 206-9499" })).toHaveAttribute("href", "tel:+15732069499")
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument()
  })

  it("requests a code only on submission without adding ongoing-message consent to the payload", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true, challengeToken: "test-challenge" }) })
    vi.stubGlobal("fetch", fetchMock)
    render(<CamdenLoginForm />)

    fireEvent.change(screen.getByRole("textbox", { name: "Mobile phone number" }), { target: { value: "202-555-0123" } })
    fireEvent.click(screen.getByRole("button", { name: "Complete security check" }))
    expect(fetchMock).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole("button", { name: "Text me a code" }))

    await waitFor(() => expect(screen.getByRole("heading", { name: "Enter your code" })).toBeVisible())
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe("/api/camden/auth/request-code")
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ phone: "+12025550123", captchaToken: "test-captcha" })
  })
})
