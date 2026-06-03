# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Google Apps Script (GAS) project that scans the authenticated Gmail inbox for unread
messages and forwards matching ones to Slack channels. It runs on a GAS time-driven
trigger; the entry point is `global.main` (see `src/app.ts`). There is no server — the
TypeScript in `src/` is bundled into a single `dist/app.js` and pushed to Apps Script
with `clasp`.

## Commands

- `pnpm build` — bundle `src/app.ts` → `dist/app.js` via esbuild + `esbuild-gas-plugin` (`build.js`)
- `make deploy` — `pnpm install && pnpm build && clasp push` (the normal deploy path)
- `pnpm lint` / `pnpm lint-fix` — Biome check / autofix over `src`
- `clasp push` — upload `dist/` to Apps Script (rootDir is `dist`, set in `.clasp.json`)

Requires `clasp` installed globally and `clasp login` done once. Node is pinned to
23.11.0 (`.node-version`). There is no test suite.

## Architecture

Flow: `main()` (`src/app.ts`) runs `GmailApp.search("in:Inbox is:Unread", 0, 100)`,
then for each unread message calls `getConfig(message)` (`src/GetSlackConfig.ts`). If a
config is returned it posts to Slack via `chat.postMessage` and calls `message.markRead()`;
on Slack API failure it posts an error to `SLACK_ERROR_CHANNEL` and leaves the message
unread.

Routing is rule-based. `getConfig` instantiates every rule in an ordered array and
returns on the **first** rule whose `match()` is true:
- `match()` (default in `src/rules/Rule.ts`) compares the sender's email domain
  against the rule's `domain` field using `splitEmail` (`src/SplitEmail.ts`) +
  `String.includes`.
- If matched but `canSend()` is false, `getConfig` returns `null` immediately (the
  message is **not** evaluated against later rules) — so domain matches are exclusive.
- `canSend()` typically filters on subject keywords (e.g. only "請求金額"-type
  notifications), and `config()` returns the `{ address, channel, icon_emoji }`
  `SlackConfig`.

Because matching is first-domain-wins, rule order in the `rules` array in
`GetSlackConfig.ts` matters when domains could overlap.

## Adding a new notification rule

1. Create `src/rules/<Name>.ts` extending `Rule` (see `src/rules/Paypay.ts` as the
   template): set `this.domain` in the constructor, implement `canSend()` (subject
   keyword filter) and `config()` (channel + icon).
2. Import it and add `new <Name>(gmailMessage)` to the `rules` array in
   `src/GetSlackConfig.ts`.
3. Channel IDs come from GAS Script Properties via `getGasProperty(...)`, never
   hard-coded. Existing rules reuse `SLACK_PAYMENT_CHANNEL`.

## Configuration (GAS Script Properties)

Read at runtime via `getGasProperty` (`src/GetGasProperty.ts`). Key ones:
`OAUTH_TOKEN` (Slack bot token), `SLACK_ERROR_CHANNEL`, `SLACK_PAYMENT_CHANNEL`,
and `DEBUG_MODE` (`"1"` enables verbose `console.log` of configs/payloads/responses).
To notify a new Slack channel: add its channel id to Script Properties **and** invite
the notifier bot to that channel.

## Conventions

- Biome formats with 2-space indent and double quotes; lint is the Biome recommended
  set plus `noUnusedImports: warn`.
- GAS globals (`GmailApp`, `PropertiesService`, `UrlFetchApp`, `Utilities`) are ambient;
  message objects are typed loosely (`any` / the minimal `GmailMessage` interface in
  `Rule.ts`).
- Only `src/` is edited. `dist/app.js` is a generated bundle — don't hand-edit it.
