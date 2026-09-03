# Facebook to Google Business Profile automation

Lake Ride Pros uses a macOS LaunchAgent to review recent Facebook Page posts daily and republish a safe, evergreen candidate to Google Business Profile no more than once every two days.

## Schedule

- LaunchAgent label: `com.lakeridepros.facebook-to-gbp`
- Check time: 9:15 AM local time every day
- Publishing cooldown: 2 days
- Facebook freshness window: 14 days
- Maximum per run: 1 Google post

The daily check makes the schedule resilient when the Mac is asleep. The cooldown—not the launchd calendar—controls publishing frequency.

## Safety behavior

The automation:

- Requires a fresh Facebook post with a public image and meaningful Lake Ride Pros or transportation context.
- Rejects giveaways, contests, discounts, hiring posts, relative or explicit dates, events, ticket promotions, limited-availability claims, competitor comparisons, engagement bait, and sensitive personal stories.
- Removes URLs, email addresses, phone numbers, hashtags, emoji-heavy all-caps hook lines, and excess whitespace from the Google copy.
- Rotates content pillars so it does not repeatedly publish similar community, fleet, airport, wedding, partner, or customer-story posts within 14 days.
- Checks existing Google posts and local state for duplicates.
- Adds a topic-appropriate Lake Ride Pros landing page with Google Post UTM parameters.
- Writes credentials nowhere outside `.env.local` and never logs access tokens.
- Exits without publishing when no safe candidate exists.

Time-sensitive event posts and offers remain manual because their dates, availability, terms, and media need human verification.

## Commands

```bash
npm run gbp:sync:dry-run   # Show the next eligible candidate without posting
npm run gbp:sync:publish   # Run the guarded publisher immediately
npm run gbp:sync:install   # Install or refresh the user LaunchAgent
```

## Local files

- Agent: `~/Library/LaunchAgents/com.lakeridepros.facebook-to-gbp.plist`
- State: `~/Library/Application Support/LakeRidePros/facebook-to-gbp/state.json`
- Standard log: `~/Library/Application Support/LakeRidePros/facebook-to-gbp/launchd.log`
- Error log: `~/Library/Application Support/LakeRidePros/facebook-to-gbp/launchd-error.log`

The plist contains paths and scheduling configuration only. Secrets stay in the repository's ignored `.env.local` file.

## Configuration

Required `.env.local` variables:

- `FACEBOOK_PAGE_ID`
- `META_PAGE_ACCESS_TOKEN`
- `GOOGLE_BUSINESS_LOCATION_ID`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`

Optional:

- `GBP_SYNC_MIN_DAYS` (default `2`)
- `GBP_SYNC_LOOKBACK_DAYS` (default `14`)

Meta data-access authorization must be renewed before its current authorization expires. Re-run the installer after removing or upgrading the exact Node version embedded in the plist.

## Inspect or stop

```bash
launchctl print gui/$(id -u)/com.lakeridepros.facebook-to-gbp
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.lakeridepros.facebook-to-gbp.plist
```
