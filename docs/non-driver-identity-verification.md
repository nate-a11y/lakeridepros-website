# Non-driver application identity review

- The general careers application (website) collects ID number, issuing state,
  expiration date, and front/back JPG or PNG photos (5 MB each). A driver's
  license or state-issued photo ID may be used. Expired dates are recorded, not
  treated as automatic driving-eligibility failures; review the document manually.
- The website verifies Turnstile before storing files. It uses a server-generated
  application UUID and unique paths in the existing private `driver-applications`
  bucket; the application stores paths, not public or long-lived signed URLs.
- ID values/photos are not included in notification emails or attachments.
  Existing applicant/owner email behavior and resume attachments remain unchanged.
- Portal reviewers use **Identity Verification** for non-driver applications.
  Photos obtain authorized 15-minute URLs through existing `admin-storage`;
  load failures show a retry. Stored photos are not a verified-identity flag.
- Staff conversion retains supplied identity fields/photos. No default license
  class, DOT/DQF tracking, drug test, or driving-record authorization is added.
  The existing driver path is unchanged; old staff applications remain reviewable
  even if they have no identity photos. Existing-profile linking does not overwrite
  identity details; the application remains available for review.
- No database migration or Edge Function change is required. Website and portal
  frontend deployments are needed. Capgo OTA is a separate authorized release.
- Verification uses synthetic local fixtures only; do not submit real applications,
  upload identity documents, or send emails as a deployment smoke test.
