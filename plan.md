# AI Resume Builder — Product and Implementation Plan

## 1. Product goal

Build a responsive web application that helps general job seekers create, improve, tailor, and download a clean ATS-friendly resume. Users can save work and return later. The v1 includes one resume template, AI writing assistance, optional job-description matching, PDF export, and a free/paid subscription model.

### v1 success criteria

- A visitor can understand the product and plans, create an account, verify their email, and start a resume.
- A signed-in user can create/edit a resume, see an accurate live preview, and return to saved progress later.
- AI suggestions for a summary or experience bullets are relevant, reviewable, and only alter the resume when the user applies them.
- A user can optionally paste a job ad and get a short list of relevant keywords, with clear guidance to use only accurate skills/experience.
- A user can download a legible, ATS-friendly PDF whose layout is consistent with the preview.
- Free and paid entitlements are enforced on the server, including when requests are duplicated or sent directly to endpoints.
- Account deletion removes personal resume/account data promptly, with only legally required billing records retained.

## 2. Agreed product decisions and defaults

- Audience: general job seekers.
- Initial resume language and sections: English; contact details, summary, work experience, education, skills.
- Landing page is public; account creation is needed to save and continue work. Matching is optional per resume.
- One clean, professional, ATS-friendly template for v1.
- Autosave with visible saving/saved/error state. AI output is shown as a suggestion for user review and application.
- Desktop and mobile are both supported; use a wide form/preview layout on desktop and a stacked or tabbed editing/preview experience on smaller screens.
- Free tier: one resume and 10 AI requests per month shared by writing and matching.
- Paid tier: monthly and annual Stripe subscriptions; no trial. Many resumes and generous AI use under a documented fair-use cap. Exact price and paid quotas must be decided before paid checkout is enabled.
- On cancellation, paid access remains until the end of the paid billing period. Failed-payment grace/retry policy must be configured in Stripe and represented in entitlements before launch.
- AI provider: OpenAI API. Send only the content required for a user-requested operation; disclose this in the UI/privacy policy.
- Database: Neon Postgres. Authentication: Better Auth with email/password and Google sign-in. Email verification and password reset are required.
- Email vendor is undecided; select a transactional provider before enabling verification and password reset.
- PDF: generate on the server. Validate renderer compatibility with Cloudways before implementation is considered complete.
- Deployment target: existing Cloudways Node.js app/runtime, with local and production environments. Confirm the actual runtime, process management, HTTPS/proxy behavior, and persistent process support before deployment changes.
- Public SEO: landing and pricing pages only. Authenticated app routes are private and should not be indexed.
- Visual direction: clean professional SaaS, restrained color, readable forms and preview, clear status/error feedback.
- Monitoring: error tracking plus a small set of product funnel events; vendors undecided.
- Quality bar: automate core-flow and security checks for auth, ownership, plan limits, saving/export, and billing webhooks.

## 3. Scope boundaries

### Included in v1

- Landing page, pricing page, sign-up, sign-in, verification, password reset, sign-out, and account deletion.
- Resume dashboard/list, create/edit resume, save progress, one template, live preview, and PDF download.
- AI summary and work-experience bullet generation/improvement, plus optional job-description keyword suggestions.
- Subscription checkout and customer portal/cancellation for one paid plan with monthly and annual billing.
- Server-side plan enforcement, webhook-driven subscription state, basic observability, accessibility and responsive behavior.

### Excluded unless separately approved

- Multiple templates, resume import/parsing, cover letters, job application tracking, collaboration/sharing, admin console, custom sections, non-English output, mobile native app, and multi-provider AI routing.
- Uploads and user-managed file storage. No profile photo or attachments are required for the agreed resume sections; Neon object/file storage is therefore not part of the v1 architecture.

## 4. User journeys

### Visitor and account creation

1. Visitor lands on the public marketing page and can review product benefits and plans.
2. Visitor chooses sign-up with email/password or Google.
3. Email sign-up requires verification. Verification/reset messages are sent through the selected transactional email vendor.
4. After authentication, user enters the resume dashboard. An unverified email account cannot access protected features that require verified ownership.

### Resume creation and return

1. Dashboard presents an empty state and a primary “Create resume” action. Free users see their one-resume allowance; paid users see their current resume count.
2. Resume editor collects the standard sections. The first version may create an empty draft and guide the user section-by-section.
3. Input changes are saved through server-authorized mutations with debouncing/batching; the UI shows pending, saved, and failed states. A failed save remains recoverable in the current page and provides a retry action.
4. A live preview uses the same canonical resume data and visual rules as PDF rendering.
5. Returning users see existing resumes and last-updated status, then reopen an editor.
6. If a user loses a session, protect data with normal auth renewal; if authentication is no longer valid, retain unsaved client edits where practical and prompt reauthentication before retrying.

### AI writing assistance

1. User invokes assistance on the summary or a specific experience bullet/context.
2. Server checks session, resume ownership, verified account, entitlement, quota, input length, and request rate before calling OpenAI.
3. The server sends only the fields/context needed for that request and asks for constrained output suitable for review (no invented facts; preserve factual claims and ask for missing information rather than fabricate).
4. The UI displays one or more suggestions. The user can apply, edit, or discard each suggestion. Applying a suggestion is an ordinary resume update and autosaves.
5. Usage is charged once for a successfully accepted AI generation request according to the chosen quota policy; define whether failed provider calls consume quota as no charge. Use idempotency/request identifiers to avoid duplicate charging on retries.
6. Provider timeout/rate-limit errors produce a recoverable message and do not overwrite resume content.

### Job-description matching

1. User opens an optional matching panel on a resume and pastes job-ad text.
2. Server validates size and entitlement, sends the job ad and only necessary resume content to OpenAI, then returns a small list of matching or missing keywords and supporting evidence from the resume.
3. Results are suggestions only. The app must not imply that users possess a skill not represented in their experience; users choose what is accurate and add it manually.
4. Treat pasted job descriptions as sensitive user content. Do not expose them in logs or analytics. Define whether the text is transient or saved with the resume; default is transient and not persisted.

### PDF export

1. User requests export for a resume they own.
2. Server loads the canonical resume data, checks access and entitlement, renders the single template to a PDF, and streams it as an attachment.
3. Include only resume content, not editor controls or account metadata. Escape/sanitize user text and links; use safe clickable URLs.
4. Validate page breaks, long names, long URLs, empty optional fields, special characters, and multi-page experience. The exported PDF must remain text-selectable and machine-readable where supported by the chosen renderer.

### Billing and account lifecycle

1. Pricing page presents the free plan and one paid plan with monthly and annual options. Exact prices/quotas are launch blockers.
2. Checkout is created server-side only for the authenticated user. Stripe Customer/Subscription identifiers are stored against that user.
3. A signed Stripe webhook is the source of truth for subscription state and period dates. Process events idempotently and tolerate out-of-order delivery by reconciling the latest Stripe state as needed.
4. Subscription entitlement is granted after confirmed checkout/subscription state, not based on a client redirect.
5. Cancellation keeps the paid entitlement through the paid-through date; after that date use free entitlements. Failed payment states follow a configured grace/retry policy and must not silently grant indefinite paid usage.
6. Account deletion requires a clear confirmation. Delete Better Auth identity/session data, user-owned resumes, job-match data (if any), and associated application data. Retain only billing records required by law/accounting; detach/delete customer data in Stripe where legally and operationally appropriate.

## 5. Pages and routing

Suggested App Router organization (exact paths may be adjusted during implementation without changing the behavior):

- `/` — public landing page with clear value proposition and sign-up CTA.
- `/pricing` — public plans and monthly/annual paid option.
- `/sign-up`, `/sign-in`, `/verify-email`, `/forgot-password`, `/reset-password` — authentication flows.
- `/app` — authenticated dashboard and resume list.
- `/app/resumes/new` — create draft, subject to plan limit.
- `/app/resumes/[resumeId]` — editor and preview, protected by server-side ownership checks.
- `/app/account` — profile/security, subscription link/status, account deletion.
- `/api/auth/*` — Better Auth handler at its required endpoint.
- `/api/ai/*` — server-only AI endpoints/actions for writing and matching, with shared authorization/quota validation.
- `/api/resumes/*` — resume mutation/export endpoints only where Route Handlers are a better fit than Server Actions.
- `/api/stripe/webhook` — verified Stripe webhook receiver.
- `/robots.txt`, `/sitemap.xml`, metadata/OG — public marketing routes only.

Do not rely on middleware/proxy redirects as the sole authorization mechanism. Every protected data read and mutation must check authenticated user and resource ownership in the server-side data/service layer.

## 6. Data model and ownership

Use a relational schema in Neon with migrations committed to the repo. Apply foreign keys, unique constraints, check constraints where practical, and indexes for lookup/ownership. All user content is scoped to the authenticated owner.

### Auth tables

Use Better Auth’s supported schema for users, accounts/providers, sessions, and verification tokens. Preserve provider-required columns and indexes through the selected Better Auth version’s schema tooling; do not hand-edit generated auth schema without a documented reason.

### Application tables (proposed logical model)

- `resumes`: `id`, `user_id`, `title`, `template_key` (single supported value initially), `content` (typed JSONB or normalized sections, decide before migration), `created_at`, `updated_at`. Ownership FK cascades on user deletion. Enforce the free resume limit transactionally in the service layer; do not rely on UI-only checks.
- `subscriptions`: `id`, `user_id`, Stripe customer/subscription IDs, plan key, status, current period start/end, cancel-at-period-end, timestamps. Unique Stripe identifiers and one effective paid subscription per user. Webhooks update this record idempotently.
- `ai_usage`: `id`, `user_id`, operation (`writing`/`matching`), period key, request/idempotency key, status, timestamp, and minimal token/cost metadata if useful. Do not store raw prompts or job ads here. Atomic quota reservation/commit prevents concurrent requests bypassing monthly limits.
- Optional `job_match_results`: omit by default because matching is transient. If a future product decision requires history, store only the minimum data, add a deletion path, and update the privacy disclosure.

### Resume content shape

Use a versioned application-level schema for structured JSON if storing sections in JSONB. The content must represent contact details, summary, an ordered list of experience entries (employer, role, location optional, start/end dates, present flag, ordered bullets), ordered education entries, and skills. Add schema versioning and validation at the server boundary so later fields can be added safely. Decide normalized tables vs versioned JSONB after choosing the editor form and query needs; v1 does not need analytics by individual resume field.

### Validation and mutation rules

- Validate all inputs on the server with a shared schema library; client validation improves usability but is not authorization.
- Bound text lengths and list sizes to protect provider costs, DB payloads, and PDF layout.
- Escape/sanitize rendered text; do not accept executable HTML. Validate external links.
- Use transactions for resume creation against plan limits and AI quota reservation.
- Add `updated_at` consistently and avoid silently losing simultaneous edits; include an update timestamp/version in save mutations and return conflict/reload guidance on stale updates.

## 7. Architecture and integrations

### Next.js application

- Keep the App Router and installed Next.js `16.4.3`, React `19.3.0`, and TypeScript stack. Do not change framework versions as part of feature work without a separate compatibility review.
- Use Server Components for public/server-rendered pages and protected data reads. Use Client Components only for interactive editor controls, autosave status, live preview state, dialogs, and client-side form behavior.
- Keep DB access, Better Auth secrets, Stripe secret/webhook keys, and OpenAI credentials server-only. Never pass secrets or provider clients to Client Components.
- Use Server Actions for straightforward authenticated form mutations where appropriate; use Route Handlers for Better Auth, Stripe webhooks, PDF response streaming, or APIs requiring explicit HTTP contracts. Validate input and authorization in either case.
- Use dynamic/request-time rendering for account-specific pages and data. Do not cache private resume, account, subscription, or AI responses across users. Public static marketing content can be statically rendered. Revalidate only intentionally public or user-specific data after mutations.
- Keep data access in server-only service/repository modules so business rules are shared by actions and handlers.

### Services

- Neon Postgres: canonical storage for auth/application data. Use pooled/serverless-appropriate connections compatible with Cloudways concurrency; use a migration workflow and separate local/production credentials.
- Better Auth: email/password, Google OAuth, sessions, verification, reset, and account lifecycle. Confirm adapter/schema and session cookie/proxy configuration for the installed Next.js version and Cloudways domain before rollout.
- Transactional email: select provider before build integration; owns verification and password reset delivery. Configure verified sender/domain and production delivery settings.
- OpenAI: server-side generation for summary/bullets and job-ad matching. Select current model, structured response strategy, token caps, timeouts, and moderation/abuse policy during implementation based on quality/cost tests; keep provider/model configuration centralized.
- Stripe: subscription checkout, billing portal, monthly/annual prices, subscription status, and signed webhooks. Stripe is the source of payment state; local DB is the app’s entitlement read model.
- PDF renderer: choose a Node-compatible server renderer only after a Cloudways proof of compatibility. Keep template styles reusable between preview and PDF where the renderer supports it; pin/version fonts and styles for predictable output.
- Monitoring: select error tracking and product event provider. Exclude resume text, job ads, prompts, auth tokens, payment secrets, and other sensitive data from logs/events.

### Cloudways feasibility gate

Before feature implementation reaches deployment, verify the actual Cloudways application is configured to run a persistent Node.js process and supports the deployed Next.js build/start scripts, required Node version, HTTPS, environment variables, reverse-proxy headers, request body sizes, long-running server PDF work, and Stripe webhook URLs. Run production-like build/start and a PDF smoke export on the target environment. Next.js 16.4.3’s local deployment guidance says a Node.js server supports all Next.js features; Cloudways-specific runtime details still require confirmation.

## 8. State, reliability, and failure behavior

- Database is the source of truth for resumes, plan entitlements, and AI quota state. URL state is limited to navigable UI state such as selected resume/tab where useful. No real-time collaboration is required.
- Autosave should debounce frequent keystrokes, serialize or sequence writes per resume, show save state, and recover from transient network errors. Avoid optimistic success indicators until server acknowledgement; preserve editor state when retrying.
- Duplicate save requests are safe. AI actions use an idempotency key to avoid duplicate charges/generations when retries occur.
- AI timeout/provider failure returns a clear retryable error; never overwrite resume content with partial/invalid output. Validate structured results before returning them to the client.
- Stripe webhook processing is idempotent, signature-checked, observable, and safe to retry. Client redirects do not grant entitlements.
- Neon outage: show recoverable load/save errors; do not claim changes are saved. Avoid silent local-only divergence.
- Expired session: redirect to sign-in or show reauthentication, then resume only after verifying ownership again.
- Empty dashboard/editor: provide an actionable create-resume path and section guidance. Empty optional fields are omitted from preview/PDF.
- Slow network: loading skeleton/status for page transitions; save status remains visible; disable duplicate high-cost AI requests while one is pending.
- Rate-limit AI, auth, reset, and checkout initiation endpoints. Use sensible per-user and per-IP throttles and server-side payload limits.

## 9. Security, privacy, and abuse controls

- Enforce server-side authentication, email verification where required, resume ownership, subscription entitlements, and usage quota on every protected operation.
- Use secure, HTTP-only, same-site session cookies; HTTPS only in production; configure trusted origins and Google OAuth redirect URIs exactly.
- Keep secrets in local environment files excluded from git and in Cloudways environment configuration. Maintain separate local and production credentials. Rotate exposed secrets promptly.
- Verify Stripe webhook signatures and enforce idempotency on event handling.
- Validate/sanitize all text and links. Apply request size limits and safe PDF rendering; prevent HTML/script injection and SSRF via user-provided URLs (render as text/links only; do not fetch them).
- Do not log personal resume content, pasted job descriptions, AI prompts/responses, session tokens, OAuth tokens, or card/payment details. Keep observability events to metadata such as operation, status, duration, plan, and request correlation ID.
- Add privacy-policy disclosure for AI processing, providers, retention, and account deletion. Clarify provider retention controls and legal terms before launch.
- Account deletion cascade removes auth and resume data; document what minimal Stripe/accounting records must remain and for how long.
- Add abuse protection for account creation, password reset, AI endpoints, and subscription/checkout flows. A CAPTCHA is not assumed; add only if observed abuse requires it.

## 10. SEO, accessibility, and product analytics

- Add unique title/description metadata and Open Graph for public landing/pricing pages; include sitemap and robots rules that exclude account/editor routes.
- Use semantic headings/labels, keyboard-operable forms/dialogs, visible focus, accessible status announcements for autosave and errors, and sufficient contrast.
- Treat resume preview as document-like content with sensible reading order. Ensure PDF has selectable text, clear hierarchy, and readable page margins.
- Track only key funnel events: landing CTA, sign-up started/completed, resume created, AI action requested/completed/failed, PDF exported, checkout started/completed, subscription canceled. Do not include resume/job-ad content or direct identifiers in event payloads.

## 11. Environments, deployment, and operations

- Local: `.env.local` with test credentials, local development commands, database branch or isolated Neon development database, Stripe test mode, and a test OAuth application.
- Production: Cloudways Node app with production secrets, Neon production database, production OAuth redirect URIs, verified email sender, Stripe live mode/webhook, and configured monitoring.
- No separate staging environment is included in the initial assumption. Before payment launch, strongly prefer adding a staging deployment/database and Stripe test-mode webhook path; if budget/process prevents it, require a production-like local acceptance run.
- Add CI checks for typecheck/lint/build and automated tests. Apply database migrations as a controlled deployment step with backup/rollback guidance; avoid destructive migrations without a tested recovery plan.
- Configure Neon backups/restore procedures and periodically verify a restore path before launch. Retention/point-in-time recovery features depend on the chosen Neon plan and must be confirmed.
- Monitor application errors, failed saves, AI provider latency/failure rate, webhook failures, quota denials, PDF failures, auth email delivery, and subscription state drift. Alert on sustained failures that break core workflows.

## 12. Implementation sequence and gates

### Phase 0 — Resolve launch blockers and verify feasibility

- Confirm Cloudways runtime details and Node version; demonstrate Next build/start and server-generated PDF on the target.
- Choose Better Auth version/configuration, Google OAuth app, and transactional email vendor.
- Select Neon local/production setup, migration tooling, and connection strategy.
- Decide resume content representation/versioning, paid price, paid limits/fair-use wording, and failed-payment grace policy.
- Select OpenAI model/output constraints, Stripe product/prices, monitoring vendors, and PDF renderer.
- Review privacy/terms language for sending requested resume/job-ad content to OpenAI and deletion/retention behavior.

### Phase 1 — App foundation and public experience

- Replace starter page/styles/metadata with brand direction, landing and pricing shell, shared layout, and responsive foundations.
- Add server-only configuration validation for required environment variables and typed integration clients.
- Add database migrations/schema and baseline service/repository modules.
- Acceptance: public pages render and build on the pinned stack; secrets cannot be imported into client bundles; account routes are excluded from indexing.

### Phase 2 — Authentication and account lifecycle

- Integrate Better Auth with Neon, email/password, Google, verification, password reset, sessions, and protected account pages.
- Add transactional email templates and provider configuration.
- Add account deletion flow and database cascades/cleanup behavior.
- Acceptance: sign up/sign in/out, verification, Google callback, reset, expired session, cross-user resource access denial, and deletion all behave correctly.

### Phase 3 — Resume data and editor

- Implement migration-backed resume schema, validation, dashboard, create flow, editor sections, single template preview, and responsive layout.
- Add autosave with sequence/version conflict handling, visible state, retry, and ownership enforcement.
- Enforce one-resume free cap transactionally and show upgrade path when reached.
- Acceptance: every supported field saves/reloads; multiple concurrent/duplicate saves do not silently corrupt content; other users cannot read or modify a resume; empty and long-content states remain usable.

### Phase 4 — AI writing and matching

- Add shared server-side AI service with validation, entitlement/quota checks, rate limits, input minimization, structured output validation, timeout handling, and idempotency.
- Add summary/bullet suggestion UI and optional job description panel.
- Add monthly quota accounting and an admin-operable configuration for plan caps without trusting client values.
- Acceptance: suggestions never apply without user action; fabricated content is discouraged by prompt and output rules; invalid provider output is rejected; failed calls do not corrupt data; concurrent requests cannot exceed quota.

### Phase 5 — PDF export

- Implement PDF renderer using the canonical template/content representation and an authorized server endpoint.
- Test typography, page breaks, multi-page output, links, and special characters on Cloudways.
- Acceptance: only the resume owner can export; PDF is downloadable, readable, and text-selectable; renderer failure returns a recoverable error without exposing internals.

### Phase 6 — Billing and entitlements

- Create Stripe product and monthly/annual prices after pricing decision; implement server-created checkout and customer portal.
- Implement signed idempotent webhook handling, subscription reconciliation, paid entitlement, end-of-period cancellation, and configured failed-payment/grace behavior.
- Add paid resume/AI limits and clear account/pricing status.
- Acceptance: entitlement is granted only from verified billing state; duplicated/out-of-order webhook delivery does not corrupt state; cancellations remain paid through period end; failure/recovery states map to the documented policy.

### Phase 7 — Hardening and release

- Add monitoring and privacy-safe event instrumentation, security headers/configuration as appropriate, rate limits, backup/restore validation, and production environment setup.
- Run automated and manual acceptance flows, accessibility checks on core forms, responsive checks, and Cloudways production-like smoke checks.
- Launch only after pricing, quotas, billing/webhook behavior, privacy disclosures, email deliverability, and PDF compatibility are confirmed.

## 13. Testing and acceptance matrix

### Automated unit/integration coverage

- Resume schemas: valid input, missing/optional sections, maximum sizes, invalid dates/URLs, and invalid HTML-like payloads.
- Entitlements: free one-resume cap, 10 AI requests/month, paid allowances, month boundary/reset, canceled period-end access, and failed-payment policy.
- Ownership/security: unauthenticated access, unverified account behavior, cross-user resume read/update/export/delete, direct endpoint invocation, and tampered IDs.
- Autosave/service: duplicate saves, stale version conflict, transaction rollback, transient DB error, and retry behavior.
- AI: quota reservation, idempotency, rate limiting, timeout, provider 429/5xx, malformed output, and safe error responses.
- Stripe: invalid signature, duplicate event, out-of-order update, checkout completion, cancellation, renewal, payment failure/recovery, and reconciliation.
- Account deletion: all personal records removed, deletion idempotent, allowed retained billing record behavior.

### End-to-end/manual acceptance

- New user email and Google signup; verification; password reset; sign out/in.
- Create one free resume, edit each section, refresh, reopen, and verify persistence/save state.
- Attempt a second free resume and verify clear limit/upgrade message.
- Request and discard/apply AI summary and bullets; verify count usage and no automatic overwrite.
- Match a job description, inspect suggestions, and verify job text is not exposed through analytics/log output.
- Export one-page and multi-page PDFs at desktop/mobile viewports; inspect page breaks and text selection.
- Complete Stripe test checkout for monthly and annual prices; verify entitlement, cancellation at period end, and payment failure behavior with test webhooks.
- Delete account and verify login/data access no longer works and retained billing records are minimal.
- Simulate slow network, lost connection during save, expired session, Neon outage, OpenAI outage, and webhook retry.

### Release gate

- `npm run lint`, TypeScript type checking, `npm run build`, automated test suite, and Cloudways production-like startup/PDF smoke test pass.
- No known high-severity authorization, data-leak, webhook, or secret-exposure issues remain.
- Email delivery, privacy policy/terms, subscription pricing/limits, backup/restore, and monitoring alert paths are verified.

## 14. Open decisions and risks

1. **Cloudways capability:** verify Node process/runtime, deployment method, server resource limits, background/process behavior, and PDF compatibility before committing to server rendering details.
2. **Paid plan specifics:** exact monthly/annual price, paid resume limit (or fair-use rule), paid AI quota, and failed-payment grace period are required before production checkout.
3. **Auth/email setup:** validate Better Auth’s current Neon adapter/schema and required Google/email flows; choose transactional email vendor and verify deliverability.
4. **Resume persistence shape:** decide versioned JSONB versus normalized section tables after form and PDF design are prototyped; preserve schema validation and migration path either way.
5. **AI privacy/cost:** select model, token limits, per-operation quotas, output validation, and current provider retention settings. Keep raw prompts/job ads out of application logs.
6. **PDF renderer:** choose based on Cloudways support and fidelity between preview and exported output; long/multi-page resumes are the main layout risk.
7. **Neon plan/operations:** confirm connection pooling, backups, restore capability, regional placement, and expected cost for production.
8. **Staging:** the assumed local+production setup increases the risk of testing real billing/auth changes in production; add staging before public paid launch if feasible.
9. **Legal/privacy:** confirm jurisdiction-specific privacy, AI disclosure, data deletion, tax, and billing record retention obligations before public launch.

## 15. Repository and framework notes

- The repository is currently a minimal Next.js starter (`app/page.tsx`, `app/layout.tsx`, `app/globals.css`) with no product integrations or app data model yet.
- Installed versions observed: Next.js and `eslint-config-next` `16.4.3`, React/React DOM `19.3.0`, TypeScript `^5`, Tailwind CSS `^4`; only the starter dependencies are present.
- The repo’s `AGENTS.md` explicitly requires reading the local Next.js documentation before writing code because this version has breaking changes. For this plan, the installed 16.4.3 docs were reviewed for deployment, Server/Client Components, Route Handlers, and caching. Follow those local docs during implementation; do not assume familiar Next.js conventions from memory.
- The installed deployment guide states a Node.js server supports all Next.js features when build/start scripts are available. That establishes framework feasibility, not Cloudways-specific compatibility.

## 16. Definition of done

V1 is ready when a new user can securely sign up, complete and revisit a resume, use limited AI assistance and optional job matching, export a consistent ATS-friendly PDF, and manage a paid subscription; all ownership, quota, billing, deletion, and privacy rules are enforced server-side; production operations on Cloudways/Neon are verified; and the release gates above pass.
