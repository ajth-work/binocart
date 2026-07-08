# BinoCart Codex Skill

This document mirrors the local Codex skill installed at:

`C:\Users\Andrew-John\.codex\skills\binocart\SKILL.md`

Use it to recreate or update the local skill when working from a new machine or Codex environment.

## Skill Body

~~~markdown
---
name: binocart
description: Use when working on the BinoCart app, repository, GitHub Pages deployment, mobile/browser QA, receipt parsing API, scanner behavior, Android/Capacitor workflow, project kanban, or documentation. This skill keeps Codex oriented to the standalone BinoCart repo, required checks, push response format, security rules, and product workflow expectations.
---

# BinoCart

## Canonical Surfaces

- Repo path: `C:\Users\Andrew-John\Documents\Codex\2026-07-01\binocart`
- GitHub repo: `https://github.com/ajth-work/binocart`
- GitHub Pages: `https://ajth-work.github.io/binocart/`
- GitHub Actions: `https://github.com/ajth-work/binocart/actions`
- Project board: `https://github.com/users/ajth-work/projects/1`

Use the standalone repo as the primary operating space. Treat the old portfolio repo copy as historical unless the user explicitly asks about it.

## Default Workflow

1. Work from the canonical repo path.
2. Read the relevant app files before editing.
3. Keep changes scoped to the requested BinoCart behavior.
4. Update tests, docs, or kanban when the change affects contracts, workflow, or tracked feature scope.
5. Run `npm test` for app logic/static contract changes.
6. Run `npm run build:web` before push when deployment or Capacitor output matters.
7. Push only after the working tree is clean enough and verification is complete.

Do not run `npm test` and `npm run build:web` at the same time; the build rewrites `www/`.

## Required Push Response

After any push, put this first in the final response:

```text
Test this: <one sentence describing what to verify>

Local link: http://127.0.0.1:<port>/index.html
GitHub Pages: https://ajth-work.github.io/binocart/
GitHub Actions: https://github.com/ajth-work/binocart/actions
```

Then add a brief summary of what changed and what checks passed.

## Local Review

Preferred commands:

```powershell
npm run dev:web
npm run review
npm run api:receipts
npm test
npm run build:web
```

If port `4173` is occupied, use the next free port and state it clearly. For phone/tablet testing on the same network, bind to `0.0.0.0` or use the existing local server helper if available. Use GitHub Pages for camera testing when HTTPS is needed.

## Scanner Regression Rule

For scanner-related work, verify the primary scan path every time:

- top/bottom nav scan routes open `scan.html`
- `scan.html?scan=true` starts camera flow where browser permissions allow
- demo/manual UPC path still works
- tests covering scanner wiring remain green

Do not route scanner startup back to `index.html`.

## Receipt API And Data Rules

Keep OpenAI credentials server-side only. Never place `OPENAI_API_KEY` or equivalent secrets in browser HTML, CSS, JS, committed JSON, or docs examples with real values.

Never commit:

- `.env` or `.env.*` except `.env.example`
- `data/`
- `node_modules/`
- `www/`
- Android build output

Receipt work should preserve the review-first workflow: upload/parse, show editable receipt and item cards, include barcode/UPC aliases when present, save receipt memory, create line-item observations, and keep JSON export/database behavior coherent.

## Product Direction

BinoCart is independent shopping intelligence, not a retailer, delivery company, or marketplace. Recommendations should be transparent, objective, and explainable. Pulse should surface meaningful market movement; Explore should support deliberate research across markets, stores, brands, commodities, SKUs, recipes, alerts, and cart optimization.

## Kanban

Use the BinoCart Feature Board for tracked product work. When a task materially advances a board item, update the issue/status if the GitHub CLI is available. Create new issues in `ajth-work/binocart`, not the old portfolio repo.
~~~
