# Driver Employment Application Form

A comprehensive multi-step driver employment application form that complies with **49 CFR 391.21 federal regulations**.

## Features

✅ **11-Step Application Process**
- Personal Information
- Residence History (Past 3 Years)
- License Verification with E-Signature
- License History
- Driving Experience
- Safety History - Accidents
- Safety History - Traffic Convictions
- Employment History with Gap Detection
- Education & Qualifications
- Document Upload (License Front/Back)
- Review & Final Certification

✅ **Auto-Save Functionality**
- Automatically saves draft every 30 seconds
- Stores application ID in localStorage
- Allows users to resume later

✅ **Regulatory Compliance**
- Complies with 49 CFR 391.21
- Includes required authorizations (49 CFR 391.23)
- Proper data collection and retention
- Audit trail with IP and timestamp

✅ **Security Features**
- SSN encryption using AES-256-GCM
- Secure file uploads to Supabase Storage
- E-signature capture using canvas
- Input validation with Zod schemas

✅ **Email & SMS Notifications**
- Notification to owners@lakeridepros.com
- Confirmation email to applicant
- SMS confirmation via Twilio/Supabase Edge Function
- Resume from draft email reminders with secure links
- Uses existing Resend integration

✅ **Application Status Tracking**
- Dedicated status page at /careers/application-status
- Secure lookup with Application ID + Email
- Visual timeline showing progress
- Real-time status updates (Draft → Submitted → Under Review → Approved/Rejected)

✅ **Visual Employment Timeline**
- Color-coded employment history bars
- Automatic gap detection (>1 month)
- Total coverage calculation (3-10 years)
- CMV driver indicators
- Gap warnings with date ranges

✅ **PDF Preview & Download**
- Generate complete application PDF
- Download before final submission
- Professional formatting with tables
- Multi-page support with auto-pagination
- Includes all application sections

✅ **Resume from Draft**
- Secure email links to resume applications
- 72-hour link expiration
- Auto-load draft from URL parameter
- Email validation for security
- Reminder emails for incomplete applications

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Form Management**: react-hook-form
- **Validation**: Zod
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Signatures**: react-signature-canvas
- **Email**: Resend
- **SMS**: Twilio via Supabase Edge Function
- **PDF Generation**: jsPDF + jspdf-autotable

## Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install react-hook-form zod @hookform/resolvers react-signature-canvas @types/react-signature-canvas jspdf jspdf-autotable
```

## Supabase Setup

### 1. Run the Migration

The database schema has already been created. If you need to run it:

```sql
-- See supabase/migrations/create_driver_applications.sql
```

Note: The database table `driver_applications` already exists in your Supabase instance.

### 2. Storage Bucket

The storage bucket `driver-applications` should already exist. If not, it will be created automatically by the migration.

### 3. Environment Variables

Ensure these environment variables are set:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# SSN Encryption (Change in production!)
NEXT_PUBLIC_SSN_ENCRYPTION_KEY=your-secure-encryption-key-change-in-production

# Resend (Already configured)
RESEND_API_KEY=your_resend_api_key
```

**IMPORTANT**: Change `NEXT_PUBLIC_SSN_ENCRYPTION_KEY` to a strong, unique key in production.

## File Structure

```
app/(site)/careers/driver-application/
├── page.tsx                              # Main application page
├── context/
│   └── ApplicationContext.tsx            # State management & auto-save
├── components/
│   ├── StepIndicator.tsx                 # Progress indicator
│   └── ProgressBar.tsx                   # Progress percentage bar
└── steps/
    ├── Step1Personal.tsx                 # Personal information
    ├── Step2ResidenceHistory.tsx         # Residence history (3 years)
    ├── Step3LicenseVerification.tsx      # License verification + signature
    ├── Step4LicenseHistory.tsx           # All licenses (past 3 years)
    ├── Step5DrivingExperience.tsx        # Driving experience
    ├── Step6Accidents.tsx                # Accident record
    ├── Step7Convictions.tsx              # Traffic convictions
    ├── Step8Employment.tsx               # Employment history with gap detection
    ├── Step9Education.tsx                # Education & qualifications
    ├── Step10Documents.tsx               # Document upload
    └── Step11ReviewSign.tsx              # Review & final signature

app/(site)/careers/application-received/
└── page.tsx                              # Confirmation page

app/api/
├── get-ip/
│   └── route.ts                          # Get client IP for audit
└── driver-application/
    └── notify/
        └── route.ts                      # Email notifications

lib/
├── crypto.ts                             # SSN encryption utilities
├── validation/
│   └── driver-application.ts             # Zod validation schemas
└── supabase/
    └── driver-application.ts             # Supabase CRUD functions

supabase/migrations/
└── create_driver_applications.sql        # Database schema
```

## Usage

### Accessing the Form

Navigate to: `/careers/driver-application`

### Form Flow

1. **Step 1**: User fills in personal information including SSN (encrypted)
2. **Step 2**: User adds residence history for past 3 years
3. **Step 3**: User verifies current license and signs authorization
4. **Step 4**: User lists all licenses held in past 3 years
5. **Step 5**: User describes driving experience with different equipment
6. **Step 6**: User reports any accidents (past 3 years)
7. **Step 7**: User reports traffic convictions (past 3 years)
8. **Step 8**: User provides employment history (3-10 years) with automatic gap detection
9. **Step 9**: User adds education and qualifications
10. **Step 10**: User uploads license images (front and back)
11. **Step 11**: User reviews all data and signs final certification

### Auto-Save

- Draft is saved every 30 seconds
- Application ID stored in localStorage
- User can close browser and resume later
- "Save & Continue Later" button for manual save

### Submission

On final submission:
1. Application status changes to 'submitted'
2. IP address and user agent captured
3. Email sent to owners@lakeridepros.com
4. Confirmation email sent to applicant
5. localStorage cleared
6. User redirected to confirmation page

## Email Notifications

### Owner Notification

Sent to: `owners@lakeridepros.com`

Contains:
- Applicant name and email
- Application ID
- Submission timestamp

### Applicant Confirmation

Sent to: Applicant's email

Contains:
- Application ID
- Next steps information
- Contact information

## Validation Rules

### Personal Information (Step 1)
- Age: Must be 18+ years old
- SSN: Format XXX-XX-XXXX (encrypted before storage)
- Email: Valid email format
- Phone: Minimum 10 digits
- ZIP: Format XXXXX or XXXXX-XXXX
- Legal right to work: Required checkbox

### Residence History (Step 2)
- Must cover at least 3 years
- At least one residence required
- One must be marked as current

### License Verification (Step 3)
- Expiration date must be in the future
- Signature required (canvas cannot be empty)
- Authorization checkbox required

### Employment History (Step 8)
- At least one employment record required
- Must cover 3 years minimum
- Must cover 10 years if applicant was CMV driver
- Automatic gap detection (>1 month)
- Gap explanation required if gaps detected

### Documents (Step 10)
- File types: JPG, PNG, PDF
- Max file size: 10MB per file
- Both front and back required

### Final Certification (Step 11)
- Printed name required
- Signature required (canvas cannot be empty)
- Certification checkbox required

## Security & Privacy

### SSN Encryption
- SSN encrypted client-side using AES-256-GCM
- Encryption key from environment variable
- IV (Initialization Vector) randomized per encryption
- Stored as base64-encoded ciphertext

### Data Storage
- All data stored in Supabase PostgreSQL
- Row-level security (RLS) enabled
- Public can insert/update only drafts
- Authenticated users (admins) have full access

### File Uploads
- Files stored in Supabase Storage
- Private bucket (not publicly accessible)
- Files organized by application ID
- Only authenticated users can view files

### Audit Trail
- IP address captured on submission
- User agent recorded
- Timestamps for all actions
- Signature timestamps

## Compliance Notes

### 49 CFR 391.21 Requirements

This application collects all required information per federal regulations:

✅ (b)(1) - Name, address, date of birth
✅ (b)(2) - Address where applicant has resided (3 years)
✅ (b)(3) - Date application submitted
✅ (b)(4) - Issuing state, license number, expiration date
✅ (b)(5) - Accident record for 3 years
✅ (b)(6) - Traffic convictions (past 3 years)
✅ (b)(7) - Experience and qualifications
✅ (b)(8) - Employment history verification
✅ (b)(9) - Employment record
✅ (b)(10) - Educational institutions
✅ (b)(11) - Previous driving record authorization (49 CFR 391.23)

### Data Retention

Per FMCSA regulations:
- Applications must be retained for 3 years
- Applications of hired drivers: Duration of employment + 3 years
- Stored securely in Supabase with audit trail

## Troubleshooting

### Auto-Save Not Working

1. Check browser console for errors
2. Verify Supabase environment variables
3. Check network tab for failed requests
4. Ensure localStorage is enabled

### File Upload Fails

1. Check file size (<10MB)
2. Verify file type (JPG, PNG, PDF)
3. Ensure Supabase storage bucket exists
4. Check storage policies in Supabase

### Email Not Sending

1. Verify RESEND_API_KEY environment variable
2. Check Resend dashboard for errors
3. Verify sender domain is verified in Resend
4. Check API route logs: `/api/driver-application/notify`

### Signature Not Capturing

1. Ensure JavaScript is enabled
2. Check browser compatibility
3. Try clearing browser cache
4. Disable browser extensions that might interfere

## API Routes

### GET /api/get-ip

Returns client IP address for audit purposes.

**Response:**
```json
{
  "ip": "192.168.1.1",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### POST /api/driver-application/notify

Sends email notifications after application submission.

**Request:**
```json
{
  "applicationId": "uuid",
  "applicantName": "John Doe",
  "applicantEmail": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "ownerEmailId": "resend-email-id",
  "applicantEmailId": "resend-email-id"
}
```

## Database Schema

See `supabase/migrations/create_driver_applications.sql` for complete schema.

Key fields:
- `id`: UUID primary key
- `status`: draft | submitted | under_review | approved | rejected
- `ssn_encrypted`: Encrypted SSN
- `residences`: JSONB array
- `licenses`: JSONB array
- `driving_experience`: JSONB array
- `accidents`: JSONB array
- `traffic_convictions`: JSONB array
- `employment_history`: JSONB array
- `education`: JSONB array
- `license_front_url`: URL to uploaded image
- `license_back_url`: URL to uploaded image
- `license_verification_signature`: Base64 signature
- `certification_signature`: Base64 signature
- `submission_ip`: IP address at submission
- `submission_user_agent`: User agent at submission

## Support

For questions or issues:

- **Email**: owners@lakeridepros.com
- **Phone**: (573) 552-2628

## License

Proprietary - Lake Ride Pros

---

**Last Updated**: 2025-11-18
**Compliance**: 49 CFR 391.21
**Version**: 1.0.0
