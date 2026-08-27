import { z } from "zod"

const uuid = z.string().uuid()
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).max(10)
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/).max(8)
const optionalTime = time.optional()

export const CamdenParticipantSnapshotQuerySchema = z.object({
  period: z.enum(["program_to_date", "current_month", "previous_month", "custom"]),
  startDate: date.optional(),
  endDate: date.optional(),
}).strict().superRefine((value, context) => {
  if (value.period === "custom" && (!value.startDate || !value.endDate)) {
    context.addIssue({ code: "custom", message: "Custom dates are required." })
  }
  if (value.startDate && value.endDate && value.startDate > value.endDate) {
    context.addIssue({ code: "custom", message: "The start date must be on or before the end date." })
  }
})

const requestDraft = z.object({
  riderId: uuid.optional(),
  rideTypeId: uuid,
  rideDate: date,
  requestedPickupTime: time,
  appointmentTime: time,
  direction: z.enum(["one_way", "round_trip"]),
  returnKind: z.enum(["scheduled", "will_call"]).optional(),
  returnTime: optionalTime,
  pickupLocationId: uuid,
  destinationLocationId: uuid,
  notes: z.string().trim().max(2_000).optional(),
  companionCount: z.number().int().min(0).max(10).optional(),
  companionDetails: z.string().trim().max(500).optional(),
  duplicateConfirmed: z.boolean().optional(),
}).strict()

export const CamdenDataSchemas = {
  "submit-request": z.object({ input: requestDraft }).strict(),
  "update-pending-request": z.object({ id: uuid, version: z.number().int().positive(), patch: requestDraft.partial() }).strict(),
  "duplicate-request": z.object({ id: uuid, patch: requestDraft.partial() }).strict(),
  "add-message": z.object({ id: uuid, body: z.string().trim().min(1).max(2_000) }).strict(),
  "create-followup": z.object({ id: uuid, version: z.number().int().positive(), kind: z.enum(["change", "cancellation"]), reasonId: uuid, explanation: z.string().trim().max(2_000).optional() }).strict(),
  "transition-followup": z.object({ id: uuid, version: z.number().int().positive(), status: z.enum(["acknowledged", "declined", "completed"]), publicExplanation: z.string().trim().max(2_000).optional() }).strict(),
  "transition-request": z.object({ id: uuid, status: z.enum(["acknowledged", "needs_information", "declined"]), version: z.number().int().positive(), publicExplanation: z.string().trim().max(2_000).optional() }).strict(),
  "request-location": z.object({ name: z.string().trim().min(2).max(150), address: z.object({ address_line1: z.string().trim().min(2).max(200), address_line2: z.string().trim().max(200).optional(), city: z.string().trim().min(2).max(100), state: z.string().trim().length(2), postal_code: z.string().trim().regex(/^\d{5}(?:-\d{4})?$/) }).strict(), notes: z.string().trim().max(1_000).optional() }).strict(),
  "accept-policy": z.object({ policyId: uuid }).strict(),
  "update-profile": z.object({ input: z.object({ email: z.string().email().max(254).optional() }).strict() }).strict(),
} as const

export type CamdenMutationName = keyof typeof CamdenDataSchemas

export const CAMDEN_READ_OPERATIONS = ["context", "dashboard", "coordinator-dashboard", "participant-snapshots", "request"] as const
export const CAMDEN_MUTATION_OPERATIONS = Object.keys(CamdenDataSchemas) as CamdenMutationName[]
