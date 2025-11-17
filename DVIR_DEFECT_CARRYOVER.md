# DVIR Defect Carryover System

## Overview

This system implements automatic defect carryover for Driver Vehicle Inspection Reports (DVIRs). When a vehicle has uncorrected defects, those defects automatically carry over to subsequent DVIRs until they are marked as corrected.

## Key Features

- **Automatic Defect Carryover**: Uncorrected defects are automatically included in new DVIRs for the same vehicle
- **Defect Tracking**: Track defect severity, status, location, and how many times they've been carried over
- **Correction Workflow**: Mark defects as corrected with notes and assignee tracking
- **Status Management**: Defects can be open, in progress, corrected, or deferred

## Database Structure

### Collections

#### 1. Defects Collection (`defects`)

Tracks individual defects identified during vehicle inspections.

**Fields:**
- `vehicle` (relationship): The vehicle this defect is associated with
- `originDvir` (relationship): The DVIR where this defect was first identified
- `description` (textarea): Detailed description of the defect
- `location` (text): Location on vehicle (e.g., "front left tire")
- `severity` (select): Critical, Major, or Minor
- `status` (select): Open, In Progress, Corrected, or Deferred
- `identifiedBy` (relationship): User who identified the defect
- `identifiedDate` (date): When the defect was identified
- `correctedBy` (relationship): User who corrected the defect
- `correctedDate` (date): When the defect was corrected
- `correctionNotes` (textarea): Details about the correction
- `deferralReason` (textarea): Reason for deferring (if applicable)
- `deferralApprovedBy` (relationship): Manager who approved deferral
- `images` (array): Photos documenting the defect
- `carriedOverCount` (number): Number of times carried over to subsequent DVIRs

#### 2. DVIRs Collection (`dvirs`)

Tracks vehicle inspection reports.

**Fields:**
- `vehicle` (relationship): Vehicle being inspected
- `inspector` (relationship): User performing the inspection
- `inspectionDate` (date): Date and time of inspection
- `inspectionType` (select): Pre-Trip, Post-Trip, or Routine
- `status` (select): Draft, Submitted, Reviewed, Approved, or Requires Repair
- `odometerReading` (number): Current odometer reading
- `inspectionItems` (array): Checklist items inspected
- `newDefects` (array): New defects identified during this inspection
- `carriedOverDefects` (array): Defects carried over from previous inspections (auto-populated)
- `hasDefects` (checkbox): Whether this inspection found any defects (auto-calculated)
- `safeToOperate` (checkbox): Is the vehicle safe to operate?
- `inspectorSignature` (textarea): Inspector certification
- `inspectorNotes` (textarea): Additional notes
- `reviewedBy` (relationship): Manager who reviewed the DVIR
- `reviewedDate` (date): When the DVIR was reviewed
- `reviewNotes` (textarea): Reviewer's notes

## How It Works

### Automatic Carryover Logic

When a new DVIR is created, the `beforeChange` hook automatically:

1. Queries all defects for the vehicle where `status !== 'corrected'`
2. Populates the `carriedOverDefects` array with these uncorrected defects
3. Increments the `carriedOverCount` on each defect
4. Sets `hasDefects` to `true` if any defects exist

```typescript
// From collections/Dvirs.ts - beforeChange hook
if (operation === 'create' && data.vehicle) {
  const uncorrectedDefects = await req.payload.find({
    collection: 'defects',
    where: {
      and: [
        { vehicle: { equals: data.vehicle } },
        { status: { not_equals: 'corrected' } },
      ],
    },
  })

  if (uncorrectedDefects.docs.length > 0) {
    data.carriedOverDefects = uncorrectedDefects.docs.map((defect) => ({
      defect: defect.id,
      carriedOverFrom: defect.originDvir,
    }))

    // Increment carried over count
    for (const defect of uncorrectedDefects.docs) {
      await req.payload.update({
        collection: 'defects',
        id: defect.id,
        data: { carriedOverCount: (defect.carriedOverCount || 0) + 1 },
      })
    }
  }
}
```

### Marking Defects as Corrected

When a defect is marked as corrected:

1. The `status` field is set to `'corrected'`
2. `correctedDate` is automatically set to the current date
3. `correctedBy` is set to the user ID
4. `correctionNotes` can be added with details

Once corrected, the defect will no longer appear in subsequent DVIRs for that vehicle.

## API Endpoints

### 1. Create DVIR

**POST** `/api/dvirs/create`

Creates a new DVIR. Automatically populates carried over defects.

```json
{
  "vehicle": "vehicle_id",
  "inspector": "user_id",
  "inspectionDate": "2025-11-17T10:00:00Z",
  "inspectionType": "pre_trip",
  "odometerReading": 125000,
  "inspectionItems": [...],
  "inspectorNotes": "All systems checked"
}
```

### 2. Get Uncorrected Defects

**GET** `/api/dvirs/get-uncorrected-defects?vehicleId=<vehicle_id>`

Returns all uncorrected defects for a vehicle.

### 3. Mark Defect as Corrected

**POST** `/api/defects/mark-corrected`

Marks a defect as corrected.

```json
{
  "defectId": "defect_id",
  "correctedBy": "user_id",
  "correctionNotes": "Replaced front left tire"
}
```

### 4. Create Defect

**POST** `/api/defects/create`

Creates a new defect.

```json
{
  "vehicle": "vehicle_id",
  "originDvir": "dvir_id",
  "description": "Front left tire has low tread",
  "location": "Front left wheel",
  "severity": "major",
  "identifiedBy": "user_id",
  "identifiedDate": "2025-11-17T10:00:00Z"
}
```

## Frontend Components

### DVIR Page (`/dvirs`)

Public-facing page that allows users to:
- Select a vehicle
- View all uncorrected defects for that vehicle
- See how many times each defect has been carried over
- Understand that defects will carry over until corrected

### Defect Correction Form Component

Reusable component for marking defects as corrected:

```tsx
import DefectCorrectionForm from '@/components/DefectCorrectionForm'

<DefectCorrectionForm
  defectId="123"
  defectDescription="Front left tire has low tread"
  onSuccess={() => {
    // Refresh data or navigate
  }}
/>
```

## Admin Dashboard

All DVIR and Defect management can be done through the PayloadCMS admin dashboard at `/admin`.

### Creating a DVIR

1. Go to `/admin/collections/dvirs`
2. Click "Create New"
3. Fill in the required fields (vehicle, inspector, date, type)
4. The system will automatically populate carried over defects
5. Add inspection items and any new defects
6. Submit

### Correcting a Defect

1. Go to `/admin/collections/defects`
2. Find the defect
3. Change status to "Corrected"
4. Fill in "Corrected By" and "Corrected Date"
5. Add correction notes
6. Save

## Database Migration

The database migration is located at:
```
migrations/20251117_add_dvirs_and_defects.ts
```

To run the migration:
```bash
npm run build
```

The migration will automatically run during the build process.

## Security Considerations

- All API endpoints should verify user authentication
- Only authorized users (drivers, mechanics, managers) should be able to create DVIRs
- Only mechanics and managers should be able to mark defects as corrected
- Consider adding role-based access control (RBAC)

## Future Enhancements

Potential improvements to consider:

1. **Notifications**: Alert mechanics when critical defects are identified
2. **Escalation**: Auto-escalate defects that have been carried over multiple times
3. **Analytics**: Dashboard showing defect trends by vehicle or fleet
4. **Mobile App**: Mobile-friendly interface for drivers to submit DVIRs
5. **Photo Upload**: Attach photos directly to defects via the API
6. **Digital Signatures**: Capture actual signatures instead of text
7. **Scheduled Inspections**: Reminder system for routine inspections
8. **Parts Integration**: Link defects to parts inventory for repair tracking

## Support

For questions or issues with the DVIR system, please contact the development team or refer to the main project documentation.
