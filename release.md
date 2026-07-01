# Release Notes


---

## ✨ Features

- **Template management** (`8d91c13`) — Create reusable templates from existing pages and content, then seed new pages/content from them.
  - New REST endpoints to create, list (by `kind`), and delete templates (`puck-template` custom-object container).
  - `usePuckTemplates` hook + template API client in the frontend.
  - "Create a template from this page/content" dialog in the editor, with a **Create template without data** option (strips leaf component data to defaults while preserving container structure).
  - Template dropdown in the New Page / New Content forms (defaults to _Empty_).
  - New template types and a data-stripping utility.
- **Free-text product search endpoint** (`91ef1a0`) — `/products/search` returns a slim product shape for the editor's product-selection picker, wired through a new controller and route.
- **Puck Renderer integration + unsaved-changes dialog** (`08c81c6`) — Added `@commercetools-demo/puck-renderer`; editors track dirty state via `useDirtyState` and confirm navigation with `UnsavedChangesDialog`; toolbar gains a Preview button; component-search clear moved to an `IconButton`.
- **Deprecation middleware for legacy APIs** (`14c63f6`) — `deprecationMiddleware` flags the legacy content-items and grid-based pages endpoints (deprecation headers + logs), steering callers to the Puck APIs; legacy routes marked `@deprecated`.
- **Nimbus field types + rich-text fields** (`130d14f`) — Replaced textarea fields with rich text fields across components and adopted Nimbus field types.
- **Search + delete confirmation — Content** (`fba7063`) — Search and a delete-confirmation dialog in `ContentList` and `ContentListRoute`.
- **Search + delete confirmation — Pages** (`14c1e17`) — Search and a delete-confirmation dialog in `PageList`.
- **PropertiesResizer** (`6d5d609`) — Draggable resizing of the properties panel.

## 🛠 Improvements & Fixes

- **Stop leaking Nimbus styles into the host app** (`47b9a73`) — Replaced the plain `NimbusProvider` with a memoized, globally-scoped `ChakraProvider` built from Nimbus's fully-merged config but with `preflight: false` and an empty `globalCss`. This keeps all Nimbus theming intact while preventing Nimbus/Chakra's global CSS reset from clobbering the host application's Tailwind styles. Applied across every mountable package (editor, content-manager, page-manager, image-picker, theme-manager); packages bumped to 0.6.1.
- **Nimbus UI migration** (`0caba0e`) — Large UI pass adopting Nimbus (44 files).
- **PuckEditor publish handling** (`9197771`) — Improved publish handling (with a 0.5.1 version bump).
- **`EnsureIntlProvider`** (`ee14cf0`) — Added for context management (with a 0.5.2 version bump).
- **CORS / allowed origins** (`c9c9459`, `c9e6f3f`, `ffc8876`) — Added `CORS_ALLOWED_ORIGINS` to the deployment workflow and adjusted allowed origins.
- **Theme** (`382afb4`) — Theme tweak.
- **README** (`19869c7`) — Updated to reflect CMS branding and features.
- **Node version** (`bfc59c2`) — Bumped Node.

## 📦 Dependencies

- **dependabot: npm_and_yarn group, 5 directories, 18 updates** (`6654a7d`, merged in `01f1739` / PR #60) — incl. `uuid` 11→14, `vite`, `postcss`, `hono`, `protobufjs`, and transitive security bumps.
- **dependabot: npm_and_yarn group, 5 directories, 12 updates** (`7ae9137`, merged in `cc7a9a2` / PR #61) — incl. `@babel/core`, `vite` 6.4.2→6.4.3, `multer`, `tar`, `shell-quote`, `hono`, `protobufjs`.
- **contentools dependency update** (`fbaa501`) — Bumped `@commercetools-demo/puck-*` to `^0.6.0`; added `@chakra-ui/react` (`^3.36.0`), `@commercetools/nimbus` / `nimbus-icons` / `nimbus-tokens` (`^3.2.0`), and the Slate rich-text editor stack (`slate`, `slate-dom`, `slate-history`, `slate-hyperscript`, `slate-react`); large `yarn.lock` refresh.
- **Update dependencies** (`091c467`).

## 🔖 Versioning & Chores

- **Package versions → 0.6.0** (`37db108`) — Aligned all puck packages on 0.6.0 (image-picker `0.4.1`, theme-manager `0.2.1`, types `0.5.1`, version-history `0.5.0` → `0.6.0`) and improved the `bump-versions.sh` helper.
- **Package versions → 0.6.1** (`47b9a73`) — Bumped all puck packages `0.6.0 → 0.6.1` alongside the Nimbus style-scoping fix.
- **Release notes** (`7cd11e8`) — Added this `release.md`.
- **Package versions → 0.5.0 / 0.4.0** (`2b27e1f`).
- **`@commercetools-demo/puck` components → 0.5.0** (`3536a37`).
- **Package versions → latest releases** (`dee75ba`).
- **`@commercetools-demo/puck` components → latest** (`d28f7e6`).
- **Postman collection** (`95063f7`) — Updated collection.

---

## All commits (chronological)

| Date | Commit | Author | Summary | Changes |
| --- | --- | --- | --- | --- |
| 2026-04-30 | `2b27e1f` | Behnam Tehrani | fix: update package versions to 0.5.0 for multiple components and 0.4.0 for others | 8 files, +8/−8 |
| 2026-04-30 | `3536a37` | Behnam Tehrani | fix: update @commercetools-demo/puck components to version 0.5.0 | 2 files, +58/−52 |
| 2026-05-27 | `95063f7` | Behnam Tehrani | update postman collection | 1 file, +513 |
| 2026-05-28 | `6654a7d` | dependabot[bot] | chore(deps): bump the npm_and_yarn group across 5 directories with 18 updates | 8 files, +368/−162 |
| 2026-06-25 | `9197771` | Behnam Tehrani | fix: update package versions to 0.5.1 and improve publish handling in PuckEditor | 4 files, +20/−17 |
| 2026-06-25 | `091c467` | Behnam Tehrani | update dependencies | 2 files, +33/−2 |
| 2026-06-25 | `dee75ba` | Behnam Tehrani | fix: update package versions for multiple components to latest releases | 10 files, +9/−18 |
| 2026-06-25 | `d28f7e6` | Behnam Tehrani | fix: update @commercetools-demo/puck components to latest versions | 2 files, +55/−93 |
| 2026-06-25 | `c9c9459` | Behnam Tehrani | fix: add CORS_ALLOWED_ORIGINS environment variable to deployment workflow | 3 files, +30/−14 |
| 2026-06-25 | `ffc8876` | Behnam Tehrani | remove origin | 1 file, −1 |
| 2026-06-25 | `ee14cf0` | Behnam Tehrani | fix: update version to 0.5.2 and add EnsureIntlProvider for context management | 8 files, +140/−48 |
| 2026-06-26 | `c9e6f3f` | Behnam Tehrani | allowed origins | 1 file, +1 |
| 2026-06-26 | `01f1739` | Behnam Tehrani | Merge pull request #60 (dependabot: npm_and_yarn, 18 updates) | merge |
| 2026-06-26 | `382afb4` | Behnam Tehrani | theme | 1 file, +5/−2 |
| 2026-06-26 | `19869c7` | Behnam Tehrani | fix: update README to reflect CMS branding and features | 1 file, +448/−452 |
| 2026-06-26 | `bfc59c2` | Behnam Tehrani | update node | 2 files, +3/−3 |
| 2026-06-26 | `7ae9137` | dependabot[bot] | chore(deps): bump the npm_and_yarn group across 5 directories with 12 updates | 11 files, +467/−500 |
| 2026-06-26 | `cc7a9a2` | Behnam Tehrani | Merge pull request #61 (dependabot: npm_and_yarn, 12 updates) | merge |
| 2026-06-26 | `14c63f6` | Behnam Tehrani | feat: add deprecation middleware for legacy APIs | 14 files, +137/−966 |
| 2026-06-30 | `91ef1a0` | Behnam Tehrani | feat: implement free-text product search endpoint for editor's product-selection picker | 35 files, +1677/−77 |
| 2026-06-30 | `0caba0e` | Behnam Tehrani | nimbus | 44 files, +4852/−3541 |
| 2026-06-30 | `08c81c6` | Behnam Tehrani | feat: integrate Puck Renderer and implement unsaved changes dialog | 13 files, +593/−127 |
| 2026-06-30 | `14c1e17` | Behnam Tehrani | feat: add search functionality and delete confirmation dialog to PageList | 1 file, +115/−17 |
| 2026-06-30 | `fba7063` | Behnam Tehrani | feat: implement search functionality and delete confirmation dialog in ContentList and ContentListRoute | 11 files, +432/−123 |
| 2026-06-30 | `130d14f` | Behnam Tehrani | feat: integrate Nimbus field types and replace textarea fields with rich text fields in various components | 15 files, +230/−18 |
| 2026-06-30 | `6d5d609` | Behnam Tehrani | feat: add PropertiesResizer component for draggable resizing of properties panel | 5 files, +207 |
| 2026-07-01 | `8d91c13` | Behnam Tehrani | feat: add template management functionality | 18 files, +815/−5 |
| 2026-07-01 | `37db108` | Behnam Tehrani | bump versions | 5 files, +29/−11 |
| 2026-07-01 | `fbaa501` | Behnam Tehrani | update dependencies | 2 files, +2427/−170 |
| 2026-07-01 | `7cd11e8` | Behnam Tehrani | feat: add release notes for template management and various improvements | 1 file, +78 |
| 2026-07-01 | `47b9a73` | Behnam Tehrani | Stop leaking nimus styles to reset tailwind | 14 files, +181/−61 |
