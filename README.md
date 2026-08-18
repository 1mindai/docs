# 1mind Customer Documentation

Source of truth for 1mind customer-facing technical documentation. Authored in
Markdown/MDX, rendered by [Mintlify](https://mintlify.com). Docs-as-code: every
page is a file in this repo, and the diff is the review.

> Separate from the product monorepo so docs PRs don't gate on code review.

## How docs get written

This site is the publishing layer of the AI-driven release workflow: a Feature
phase change in Jira triggers an orchestration layer (n8n + Claude agents), a
docs-drafting agent generates base documentation, humans review and approve in
Mintlify, and it publishes on merge. Draft and publish are always separate steps —
nothing publishes externally without the named approver.

## Information architecture

The nav mirrors the **1mind product stack** (the same model customers buy against),
so the docs double as the map of what a customer owns and can add.

```
Get Started        What 1mind is, how Superhumans work, first build, glossary
Using 1mind        What you buy and operate:
                     Superhumans · Deployments · Sub-Agents · Skills ·
                     Analytics & Attribution · Best Practices
Configuring 1mind  What you set up once:
                     Platform · Knowledge · Integrations · Administration · Troubleshooting
Guides             Step-by-step paths across features (by goal)
Changelog          Release notes, tied to Release Operations
```

Design principles are documented on the Notion workspace page (Mintlify: Best
Practice Guide & Project Plan). Highlights: write for the customer's task not our
architecture; disclosure discipline (document what a capability does, not how it's
engineered); one canonical home per topic; Diátaxis page types; one naming system
aligned to the product + glossary; build when ready.

## Repo layout

```
docs.json                       nav + config
index.mdx                       home
get-started/                    concepts, quickstart, glossary
using/
  superhumans/                  the roles you buy
  deployments/                  the surfaces
  sub-agents/                   tier-gated capabilities (e.g., calendar-routing)
  skills/                       modular add-ons
  analytics-attribution.mdx
  best-practices/
configuring/
  platform/ · knowledge/ · integrations/ · administration/ · troubleshooting.mdx
guides/                         by-goal, step-by-step paths
changelog/
templates/                      Diátaxis page templates (not published)
```

## Conventions

- **Content types (Diátaxis):** every page declares `contentType` in front-matter —
  `tutorial`, `how-to`, `reference`, or `explanation`.
- **Tier / entitlement (Sub-Agents & Skills):** these are paid, tier-gated items,
  so each such page declares `tier` and `availability` in front-matter and shows a
  short entitlement callout at the top (Included in [tier] / Add-on; Live / Coming
  soon). Use Mintlify's `tag:` front-matter to show a nav badge once confirmed.
- **No invented content.** Bracketed `[...]` prompts and `<Info>` callouts mark
  what needs product validation. Nothing ships with a placeholder.
- **One canonical home per topic.** Overviews and guides link to it; they don't
  re-document it.
- **Navigation is defined in `docs.json`,** not derived from folders.

## v1 build set vs. target map

v1 (in the repo now): Get Started (real drafts), section overviews for every group,
and the first real reference doc — **Calendar & Routing** under Sub-Agents
(pending PM validation). Each section overview lists the pages planned for that
area — the **target map**. Feature/Skill/Integration pages are added as content is
written and validated (use the product deck's LIVE TODAY vs. COMING SOON to
prioritize). We deliberately don't stub every page empty.

## Local preview

```bash
npm i -g mint
mint dev            # http://localhost:3000
```

## Branding

- Brand color: `#9A7AEB` (1mind lavender), set as `colors.primary` in `docs.json`.
- Logo: `logo/1mind-light.svg` (light mode) and `logo/1mind-dark.svg` (dark mode).
- Favicon: `favicon-1mind.svg` (lavender isologo mark).
- Assets sourced from the 1mind brand kit. The unused Mintlify starter files
  (`logo/light.svg`, `logo/dark.svg`, `favicon.svg`) can be removed.

## Remaining before launch

- Custom domain (e.g., `docs.1mind.com`) — point at the site at go-live.
