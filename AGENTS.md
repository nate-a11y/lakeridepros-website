# Lake Ride Pros Website - Agent Guidelines

## Project Overview

Lake Ride Pros is a premium luxury transportation service website built with:

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Sanity CMS** (headless CMS)
- **Tailwind CSS 4** + SCSS
- **Zustand** (state management)

## Architecture

```
app/                    # Next.js App Router pages
├── (site)/             # Public website routes
├── (sanity)/           # Sanity Studio admin
└── api/                # API routes

sanity/                 # Sanity CMS schemas and config
components/             # React components
contexts/               # React contexts
hooks/                  # Custom React hooks
lib/                    # Utilities and services
├── api/                # API clients (sanity.ts)
├── store/              # Zustand stores
├── supabase/           # Database queries
├── inngest/            # Background jobs
└── validation/         # Zod schemas

e2e/                    # Playwright E2E tests
scripts/                # Build and utility scripts
```

## Key Integrations

- **Stripe** - Payment processing
- **Resend** - Email service
- **Inngest** - Background job queue
- **Printify** - Print-on-demand products
- **Google Reviews** - Review sync
- **Moovs** - Booking system
- **Sanity CMS** - Content management

## Development Commands

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run test             # Run unit tests (Vitest)
npm run test:e2e         # Run E2E tests (Playwright)
npm run lint             # ESLint
npm run lint:a11y        # Accessibility linting
npm run lint:colors      # Color consistency audit
npm run lint:all         # All linters
```

## Testing Requirements

- Unit test coverage threshold: **80%** (lines, functions, branches, statements)
- E2E tests cover: homepage, gift cards, cart functionality
- All accessibility rules enforced as errors

## Code Standards

### Accessibility (CRITICAL)

This project enforces WCAG 2.1 AA compliance:

- All interactive elements must have visible focus states
- Form controls require labels or aria-labels
- Images require alt text
- Use semantic HTML before ARIA
- Icon-only buttons need `aria-label`

### Performance

- Prefer Server Components where possible
- Use dynamic imports for heavy components
- Avoid barrel file imports (use direct imports)
- Implement virtualization for lists >50 items

### Styling

- Use Tailwind CSS utilities first
- SCSS for complex custom styling
- Follow existing color system (see `scripts/audit-colors.js`)

## Important Files

- `next.config.mjs` - Next.js configuration
- `sanity/sanity.config.ts` - Sanity CMS configuration
- `eslint.config.mjs` - ESLint with a11y rules
- `vitest.config.ts` - Test configuration
- `vercel.json` - Deployment configuration

<!-- crystl-cli:begin v2.202.0 -->
## Crystl CLI (agent-callable)

This section is auto-maintained by Crystl — edits between the `crystl-cli` markers are overwritten when it refreshes; the rest of this file belongs to the project. You're running inside Crystl. You can inspect and control sibling gems and shards via the `crystl` CLI. Full command reference (every flag): `crystl docs cli`.
Detection contract: a non-empty `CRYSTL_SHARD` means this process is in a Crystl shard. `CRYSTL_VERSION` is the running Crystl version. `CRYSTL_TIER` is the user's `free` or `guild` capability tier captured when this shard started; use it to plan Guild-only actions without checking before every task. If the license changes while the shard is already running, a bridge 403 is authoritative and a new shard receives the new tier. `CRYSTL_NOW` is the shard's current time (ISO-8601 with timezone). Every shell in the shard recomputes it, so reading it from a shell command (`echo $CRYSTL_NOW`) is authoritative; the copy inside your own long-running agent process is frozen at the moment that process started, because a running process's environment can't be updated from outside.

Everyday commands:
- `crystl status` — overview; bare `crystl` runs it. Includes memory telemetry (`memory: app … · pressure …` plus per-shard resident memory)
- `crystl gems` / `crystl shards --gem <name>` — discover what's open; `crystl gem select <name>` / `crystl shard select <name> [--gem <g>]` brings one forward in the desktop UI
- `crystl screen --gem <g> --shard <s>` / `crystl send --gem <g> --shard <s> "<text>"` — read another shard's exact current terminal viewport / type into it. In fullscreen, `screen --scrollback <N>` returns separate transcript-derived conversation history without treating it as terminal rows. `crystl watch` matches new viewport or transcript output, reports which source matched, and considers only rows observed after registration (full flags: `crystl docs cli`). Add `send --wait` to confirm a dispatch landed — exit 3 means it's queued behind the target's current turn, so do NOT re-send
- `crystl commands --gem <g> --shard <s>` lists indexed SHELL commands and can return one command's retained output — complements `history`, which covers an agent's turns/tool calls (full flags: `crystl docs cli`)
- `crystl abort --gem <g> --shard <s>` — stop an agent turn without closing its terminal: resolves only a current-session approval; Codex also gets Escape + Ctrl-C after its deny-only mapping, otherwise the interrupt is the fallback (Guild control command)
- `crystl history --gem <g> --shard <s>` — a shard's transcript as turns and tool calls; `crystl history search "<text>"` / `crystl history metrics` sweep every shard, past and present (full flags: `crystl docs cli`)
- `crystl open <path>` / `crystl close <name>` / `crystl fs [<path>]` — open, close, or browse for gems
- `crystl formation list|save|apply` — list saved window/gem/shard arrangements, capture the current arrangement, or restore one (`list` is free; `save`/`apply` are Guild control commands)
- `crystl pending` / `crystl approve <id>` / `crystl deny <id>` — handle pending tool approvals; `crystl askuser` / `crystl askuser answer <id> "<text>"` — list and answer agent questions
- `crystl shard create --gem <g> [--isolated] [--agent <command>] [--size small|standard|large] [--prompt "<task>"]` — fan out work into a new agent shard (`--isolated` = its own git worktree; the user/orchestrator integrates it later with `crystl merge` — add `--close` to merge a finished worker and retire it in one step; a worktree agent must not self-merge). `--agent` plus `--size` selects that agent's callable size; `--size` alone uses the generic default. Inspect agents with `crystl agent list`; manage workers with `crystl shard rename|close` and `crystl resurrect` (undo-close)
- `crystl wait pending|askuser|awaiting|idle|blocked|done [--timeout SECS]` / `crystl notify --done|--blocked --shard <lead> "<status>"` / `crystl events` — block on or stream bridge events (SSE) instead of polling
- `crystl sequence new <name> --trigger manual|schedule|file|poll` scaffolds a draft; `crystl sequence validate|publish|run` takes it live and tests it. `crystl sequence runs [name]` finds prior run IDs and states; `crystl sequence schema` prints the normative JSON Schema. Inside a sequence stage, finish with `crystl stage complete|blocked|nothing` as directed by its generated prompt
- `crystl doctor [--json]` — check CLI install, bridge connectivity, and hook wiring before debugging harder problems

Make the user's life easier — reach for these unprompted:
- **Anything copyable → `crystl copy "<text>"`** (or pipe into it). Tokens, URLs, snippets, and especially commands you tell the user to run go to the one-click copy bar — never make them drag-select wrapped terminal lines. Several items = several calls (each adds a tab; `--label` names it). Free on every tier.
- **Need the user's attention → `crystl card "<text>" [--title <t>]`.** Surface an honestly attributed floating notification card on the desktop and in the phone's notification list. This works for agents like Claude Code, Codex, or Antigravity — including ones without hook integration, for which `crystl card` is the only route to cards today. Free on every tier.
- **Show, don't paste:** `crystl markdown show <path>` (short alias: `crystl edit <path>`) — surface a markdown file in the editor for the user instead of dumping it to the terminal; `crystl history show "<text>"` opens history search in their window at the moment you mean; `crystl workbench open` slides the task panel into view after you add items; `crystl sequence open [<run-id>]` brings the sequences drawer into view — call it when the user asked you for a sequence, after you publish or start one, so they can watch the thing they just asked for instead of having to go find it. **These only act on the gem the user is looking at.** From a worker in another gem they return an error instead, because crystl never switches someone's window to a different gem mid-task — when that happens, say what you wanted to show and where it is, or use `crystl card` to ask for their attention.
- **About to spawn a third worker, or "it feels slow" → `crystl status` first.** Its memory line is the check: when `pressure` isn't `normal`, spawn fewer and give each `crystl shard create --scrollback <N>` to keep it light. `crystl scrollback clear` clears terminal state only, freeing a noisy shard's screen + retained scrollback memory while leaving conversation history untouched (same as the user's Cmd+K; free).
- **Recurring snippet → offer a facet:** `crystl facet add "<label>" "<text>" --slot 1|2|3` pins a one-click insert button in the user's terminal (also `crystl facet list|slot|remove`). Guild-gated — on a 403, `crystl copy` it instead.
- **User stuck, curious, or new → `crystl docs`.** Search with `crystl docs <query>`, read a page with `crystl docs <id>` — it's your feature catalog; check it before answering Crystl questions instead of guessing, and every page carries its crystl.dev URL (`crystl copy` it to them). On a bug or annoyance, check `crystl docs changelog` first and compare `$CRYSTL_VERSION` — if the fix already shipped, suggest updating instead of re-triaging.
- **Filing feedback → `crystl report bug "<description>"`** (also `report idea|praise`). Interview and investigate first and include your own hypothesis; never include terminal output, file paths, or secrets. The report opens as an editable draft panel on the desktop and the user clicks send themselves, so you don't need a separate draft-approval step.
- **"Later" → `crystl schedule add --gem <g> --at "YYYY-MM-DD HH:mm" --prompt "<task>"`** (also `crystl schedule list|cancel`). Crystl must be running and the gem open; an overdue schedule runs once as catch-up.
- **Heroes, Quests, and repeatable fan-out → teach Crystl your agents once.** Settings → agents → defaults has exactly three raw fallback commands. Settings → agents → agents has one record per callable agent, and SMALL, STANDARD, and LARGE are properties of that agent. Inspect them with `crystl agent list`; teach one with `crystl agent profile set`; launch one with `crystl shard create --agent <command> --size standard --prompt "…"`. Each size accepts a model id for a recognized agent or a complete raw start command; paths, leading environment assignments, and every argument are preserved. Free on every tier.
- **Waiting on a shard to say something → `crystl watch`, never a `screen` loop.** Re-reading `crystl screen` until the text changes spends a whole turn per look and usually reads the same screen back. `crystl watch` blocks until output matches and returns the moment it does — one turn instead of ten. Same for a worker you dispatched: `crystl wait done|blocked|idle` rather than polling `crystl shards`. Free on every tier.
- **"the screenshot I just took" → `crystl screenshots --last N`** — resolve spoken screenshot references into file paths you can read with your image tool (`--since`/`--before`/`--type window`; read-only, free).
- **Before you commit config → `crystl keys scan`** — checks the files git WOULD commit for API keys, reporting a path and a line number and never a value. Read-only and free, and it exits 0 even with findings so it can't break a script (`--fail-on-findings` opts into a gate). No gem open, or crystl not running? `--dir <path>` names the tree — that form checks the patterns only, because the keys saved in crystl are not readable outside the app, and it says so in its own output. Met a key format no public list carries? `crystl keys patterns add "ACME_TOKEN_"` teaches it — a literal prefix, recorded against your shard. You can only ADD: switching a built-in off, or removing a pattern, is done by the user in Settings → key scan. Say so rather than looking for a flag.

Fan-out norm: workers pause silently on in-terminal dialogs — quiet is NOT done. `crystl shards` / `crystl status` flag classified prompts as `⏸ awaiting input` and a worker that cannot run at all — out of quota, credentials expired, agent gone — with what is in the way and when it comes back (also pushed via `crystl events`). Read the class before you act: a keypress unblocks `awaiting input`, but a rate-limited worker needs the clock, not a nudge. `crystl wait blocked` after a fan-out catches every worker at once. For dialogs outside the classifier (model-switch menus), arm `crystl watch` for the exact screen wording instead of polling `screen`. Unblock with `crystl send` (on 403, ask the user to click Allow instead).

Vigil watches every fan-out for a whole roster gone quiet and nudges the lead, then cards the user if nudging doesn't work — on by default, nothing to opt into. Run `crystl vigil done ["<summary>"]` from the LEAD shard once its fan-out has actually finished: it retires that fan-out's watch (spawning another worker re-arms it) and, with a summary, tells the user what happened as a card. A worker cannot call off its lead's watch. Deliberately quiet work can opt a shard out with `crystl shard create --no-vigil`.

Model endpoints: `crystl endpoint list|set|remove` is the whole providers & keys form from the terminal — help the user fill it in, since knowing which of three API formats (ollama|openai|anthropic) a provider speaks and what its models are called is research they shouldn't have to do. `crystl endpoint set --label glm --kind anthropic --url <url> --agent claude --standard <model>` also makes the endpoint a command they can TYPE in any shard (`claude@glm`), running alongside hosted claude rather than replacing it; its sizes are the same record `crystl agent list` shows. Keys arrive on stdin (`--key-stdin`), never as a flag — argv lands in shell history. Free on every tier. A session on an Anthropic-compatible endpoint warns that claude.ai connectors are disabled because an auth source is set — that IS the endpoint's credential working; never unset it to clear the warning, and don't report it as a bug.

Model-endpoint fan-out: `crystl shard create --local <label> --agent claude|codex --prompt "…"` aims a worker at a user-configured model endpoint. An endpoint's bound agent and its small/standard/large values appear in `crystl agent list`. Check reachability BEFORE fanning out — one endpoint is one machine, so keep its worker count low (1-2). Hookless workers (aider/opencode/goose) notify your `wait done` on process exit, but mid-run their `idle` status is a CPU guess — don't read idle as finished. Full flag reference, hardware caveats, and agent interop: `crystl docs cli`.

Multi-agent orchestration — parties of agents with personas, shared chat channels, and standing roles. The user asks for these by name; they are almost never what an ordinary task needs, so read `crystl docs <topic>` before reaching for one rather than working from these names alone: `crystl hero` (solo specialist personas), `crystl party` (named rosters), `crystl quest` (a party in a shared chat), `crystl sidequest` (1:1 channel between two shards), `crystl court` (a standing crown and hand), `crystl anoint` (make a shard the orchestrator), `crystl gauntlet` (release-readiness crew). Also `crystl render` — offline headless terminal-grid render; `crystl ssh bridge-address <host:port>` — direct bridge address for SSH sessions (ssh settings).

### Workbench (WORKBENCH.md)

`WORKBENCH.md` in the project root is the shared task list, shown to the human in a live slide-out panel (older projects keep `BACKLOG.md`; users may say "backlog"). Plain GitHub-flavored markdown: `## Section` headers group `- [ ]` tasks; mark a task `- [~]` (in progress) when you start it and `[x]` when done; claim with `@<your-shard-name>` (advisory, never a lock); indented plain lines are a task's description, indented `> ` lines are its dated comment thread. Preserve lines you don't recognise. Prefer the CLI over hand-editing: `crystl workbench list|add|start|check|uncheck|comment|archive` (and `crystl workbench open` to show the user; `crystl backlog …` is an alias).

Tiers: read-only commands and a few others (copy, scrollback clear, screenshots, markdown show, report) are free; most other control commands need a Guild membership and return 403 on the free tier — full tier breakdown at `crystl docs cli`. Gems, shards, and facet inserts are unlimited on every tier.

Full reference: `crystl docs cli` · https://crystl.dev/docs/cli
<!-- crystl-cli:end -->
