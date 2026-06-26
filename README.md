<p align="center">
  <a href="https://commercetools.com/">
    <img alt="commercetools logo" src="https://unpkg.com/@commercetools-frontend/assets/logos/commercetools_primary-logo_horizontal_RGB.png">
  </a>
  <br/>
  <b>A visual, Puck-based CMS for commercetools</b>
</p>

> [!WARNING]
> This is **NOT** official commercetools code and is **NOT** production ready. Use it at your own risk.

# Contentools — Puck CMS for commercetools

A headless Content Management System for commercetools built around the
[Puck](https://puckeditor.com/) visual editor ([`@measured/puck`](https://www.npmjs.com/package/@measured/puck)).
It lets merchants visually compose **pages** and reusable **content blocks**, manage a
**media library**, apply a configurable **theme**, keep **draft/published** states with
**version history**, and render the result in any storefront.

The system is delivered as a set of publishable React packages plus a multi-tenant
backend service, and ships with a ready-to-use Merchant Center custom application.

---

## Table of contents

- [Features](#features)
- [Repository layout](#repository-layout)
- [Architecture](#architecture)
- [The Puck packages](#the-puck-packages)
- [Prerequisites](#prerequisites)
- [Local development](#local-development)
- [Using the packages in your app](#using-the-packages-in-your-app)
- [Authentication & multi-tenancy](#authentication--multi-tenancy)
- [Backend service API](#backend-service-api)
- [Data model & storage](#data-model--storage)
- [Theming](#theming)
- [Building & publishing packages](#building--publishing-packages)
- [Deployment](#deployment)

---

## Features

- **Visual page builder** — drag-and-drop page composition with Puck, a curated set of
  built-in components (Hero, RichText, Columns, Image, Button, Card, Spacer, ProductTeaser)
  and your own custom components.
- **Standalone content items** — reusable content blocks managed independently of pages
  and embedded or rendered anywhere.
- **Draft / published workflow** — every page and content item tracks a draft and a
  published state; publish promotes the draft, and you can revert a draft back to the
  published version.
- **Version history** — automatic version entries with a visual diff panel and one-click
  preview of previous versions.
- **Media library** — upload images/files and pick them from a built-in image picker,
  backed by GCP, AWS S3, or Cloudinary.
- **Theming** — a configurable theme (colors, fonts, spacing, shadows…) with presets,
  surfaced to the renderer as CSS variables.
- **Multi-tenant backend** — a single service instance serves many commercetools
  projects; each tenant authenticates with its own API credentials.
- **Render anywhere** — a lightweight renderer fetches and renders published or preview
  content by key or slug, with an SSR-friendly variant for pre-fetched data.
- **Merchant Center integration** — a custom application that embeds the editors directly
  in the commercetools Merchant Center.

---

## Repository layout

| Path            | What it is                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------- |
| `puck/`         | Yarn workspace with the 9 publishable `@commercetools-demo/puck-*` packages + a Vite test app |
| `service/`      | The multi-tenant backend service (Express + TypeScript), deployed to Cloud Run             |
| `contentools/`  | Merchant Center custom application that hosts the Puck editors                              |
| `connect.yaml`  | commercetools Connect deployment descriptor for the backend service                        |

> The repository also contains a legacy web-component CMS (`cms/`) and an MCP integration
> (`mcp/`). Those are out of scope for this document.

---

## Architecture

```
                 ┌───────────────────────────────────────────────┐
                 │  React host application                        │
                 │  (Merchant Center custom app `contentools/`,   │
                 │   the `puck-react-test` app, or your own app)  │
                 │                                                 │
                 │   PageManager · ContentManager · ThemeManager  │
                 │   PuckEditor · PuckRenderer · ImagePickerField  │
                 └───────────────────────┬───────────────────────┘
                                          │  REST (baseURL + JWT + x-project-key)
                                          ▼
                 ┌───────────────────────────────────────────────┐
                 │  Backend service  (service/, base path /service)│
                 │  Express · multi-tenant · Cloud Run             │
                 └───────┬─────────────────┬───────────────┬──────┘
                         │                 │               │
                         ▼                 ▼               ▼
              commercetools          GCP Firestore     Object storage
              custom objects         (tenant registry  (GCP / AWS S3 /
              (pages, content,        + credentials)    Cloudinary)
               states, versions,                        for media files
               theme)
```

- The **packages** are the UI layer. They never talk to commercetools directly — they
  call the **backend service** over REST.
- The **service** is multi-tenant: tenant credentials live in **Firestore**, while all
  content (pages, content items, draft/published states, version history, theme) is stored
  as **commercetools custom objects** scoped per business unit. Uploaded **media** goes to
  object storage.

---

## The Puck packages

All packages are published under the `@commercetools-demo/` npm scope and live in
`puck/packages/`.

| Package | Purpose |
| ------- | ------- |
| [`puck-types`](puck/packages/puck-types) | Shared TypeScript types and data structures. |
| [`puck-api`](puck/packages/puck-api) | REST client and React hooks for pages, content, media, and configuration. |
| [`puck-editor`](puck/packages/puck-editor) | The Puck editor wrapper, built-in components, custom fields, and `defaultPuckConfig`. |
| [`puck-page-manager`](puck/packages/puck-page-manager) | Router-aware page manager UI (list → edit → preview). |
| [`puck-content-manager`](puck/packages/puck-content-manager) | Router-aware manager UI for standalone content items. |
| [`puck-renderer`](puck/packages/puck-renderer) | Lightweight renderer for published/preview pages and content. |
| [`puck-theme-manager`](puck/packages/puck-theme-manager) | Theme editor, presets, and content-type import. |
| [`puck-version-history`](puck/packages/puck-version-history) | Version history panel, diffing, and preview. |
| [`puck-image-picker`](puck/packages/puck-image-picker) | Standalone media-library image/file picker field. |

### Dependency graph

```
puck-types ──┬─ puck-api ──┬─ puck-editor ──┬─ puck-renderer ── puck-page-manager
             │             │                ├─ puck-content-manager
             │             ├─ puck-theme-manager
             │             └─ (used by all of the above)
             └─ puck-version-history (used by puck-editor / puck-content-manager)

puck-image-picker  (standalone — no puck-* dependencies)
```

Build in topological order with `yarn build` (see [Local development](#local-development)).

### Consumer-facing components

The host application typically mounts a manager and/or a renderer. The four props every
data-bound component needs are: `baseURL`, `projectKey`, `businessUnitKey`, and `jwtToken`.

#### `PageManager` — `@commercetools-demo/puck-page-manager`

Full page-management experience (list, create, delete, edit, preview) with its own internal
router.

| Prop | Type | Notes |
| ---- | ---- | ----- |
| `baseURL` | `string` | Service base URL, e.g. `https://…/service`. **Required.** |
| `projectKey` | `string` | commercetools project key. **Required.** |
| `businessUnitKey` | `string` | Business unit key. **Required.** |
| `jwtToken` | `string` | JWT issued by the service (used for mutations). **Required.** |
| `parentUrl` | `string` | Path where the manager is mounted; used as the router basename. |
| `config` | `Config` | Puck component config (defaults to `defaultPuckConfig`). |
| `backButton` | `ReactNode` | Element rendered in the editor/preview header. |

#### `ContentManager` — `@commercetools-demo/puck-content-manager`

Same shape as `PageManager`, for standalone content items. Also exports `ContentManagerList`
and `ContentEditor` for composing your own layout, plus an optional `defaultContentType`
filter prop.

#### `ThemeManager` — `@commercetools-demo/puck-theme-manager`

Theme editor. Takes `baseURL`, `projectKey`, `businessUnitKey`, `jwtToken`, and an optional
`backButton`. Also exports `ImportContentTypes`, `DEFAULT_THEME`, `themePresets`, and
`buildCssVars()`.

#### `PuckRenderer` — `@commercetools-demo/puck-renderer`

Fetches and renders a page or content item.

| Prop | Type | Notes |
| ---- | ---- | ----- |
| `type` | `'page' \| 'content'` | Defaults to `'page'`. |
| `baseURL` / `projectKey` / `businessUnitKey` | `string` | Connection props (or supply a `PuckApiProvider`). |
| `pageKey` / `slug` | `string` | For `type='page'`: fetch by key **or** by URL slug. |
| `contentKey` / `query` | `string` | For `type='content'`: fetch by key **or** by content-type query. |
| `mode` | `'published' \| 'preview'` | Defaults to `'published'`. |
| `config` | `Config` | Defaults to `defaultPuckConfig`. |
| `loadingComponent` / `errorComponent` / `children` | `ReactNode` | Loading / error / fallback UI. |
| `className` / `style` | — | Wrapper styling. |

`PuckDataRenderer` is the SSR-friendly variant: pass pre-fetched `data` and a `config`.

#### `PuckEditor` — `@commercetools-demo/puck-editor`

The lower-level editor used internally by the managers. Useful if you build your own
list/routing around it. Key props: the four connection props plus `pageKey`, `config`,
`onSave`, `onPublish`, `onError`, `showPublishButton`, and `autoSaveDebounceMs` (default
`1500`).

### Peer dependencies

- **React** — the packages declare React **19** as a peer dependency; the bundled
  `puck-react-test` reference app runs on React **18**, so both work in practice.
- **`@measured/puck`** `^0.18.2`
- **`react-intl`** `>=6` (editor, managers, version history)
- **`react-router-dom`** `5.x` — `PageManager` / `ContentManager` / `ThemeManager` are
  pinned to React Router v5.

---

## Prerequisites

- **Node.js 18+**
- **Yarn 4** (the workspaces use `yarn@4.5.1` via Corepack — run `corepack enable`)
- A **commercetools** project and an API client (client id / secret / scope)
- For the backend: a **GCP project with Firestore** and one media storage backend
  (GCP Cloud Storage, AWS S3, or Cloudinary)

---

## Local development

### 1. Backend service

```bash
cd service
cp .env.example .env      # fill in Firestore + storage + JWT values
yarn install
yarn start:dev            # tsc --watch + nodemon, listens on http://localhost:8080
```

The API is served under `http://localhost:8080/service`.

Minimum `.env` for local dev:

```dotenv
JWT_SECRET=some-long-random-secret
STORAGE_TYPE=gcp
GCP_PROJECT_ID=your-gcp-project
GCP_FIRESTORE_DATABASE_ID=your-firestore-db
GCP_FIRESTORE_SERVICE_ACCOUNT_CLIENT_EMAIL=...
GCP_FIRESTORE_SERVICE_ACCOUNT_PRIVATE_KEY=...
GCP_BUCKET_NAME=...
GCP_STORAGE_SERVICE_ACCOUNT_CLIENT_EMAIL=...
GCP_STORAGE_SERVICE_ACCOUNT_PRIVATE_KEY=...
```

See [Backend service API](#backend-service-api) for the full environment variable reference.

### 2. Puck packages + test app

The `puck/` workspace contains the packages and a Vite playground (`puck-react-test`) that
exercises all of them.

```bash
cd puck
corepack enable
yarn install
yarn build                # builds all packages in topological order

cd puck-react-test
cp .env.example .env       # point VITE_BASE_URL at your running service
# from puck/ you can also run:  yarn start:test
yarn dev                   # http://localhost:5173
```

`puck-react-test/.env`:

```dotenv
VITE_BASE_URL=http://localhost:8080/service
VITE_PROJECT_KEY=my-project-key
VITE_BUSINESS_UNIT_KEY=my-business-unit
VITE_JWT_TOKEN=your-jwt-token-here   # obtain via POST /service/authenticate-project
```

The test app shows the canonical wiring: tabs for **Pages** (`PageManager`),
**Content Items** (`ContentManager`), **Theme** (`ThemeManager`), and a **Renderer** panel
(`PuckRenderer`).

While iterating on a package, run `yarn build:watch` from `puck/` to rebuild on change.

### 3. Merchant Center custom application

```bash
cd contentools
cp .env.example .env       # set CUSTOM_APPLICATION_ID, INITIAL_PROJECT_KEY, CMS_API_URL, …
yarn install
yarn start                 # mc-scripts dev server
```

Relevant variables (`contentools/.env`):

| Variable | Description |
| -------- | ----------- |
| `CUSTOM_APPLICATION_ID` | The Merchant Center custom application id. |
| `APPLICATION_URL` | The deployed URL of the custom application. |
| `INITIAL_PROJECT_KEY` | Project key used during local development. |
| `CMS_API_URL` | Base URL of the backend service (e.g. `http://localhost:8080/service`). |
| `ENTRY_POINT_URI_PATH` | Entry-point path for the custom application. |
| `CLOUD_IDENTIFIER` | commercetools cloud identifier (e.g. `gcp-us`). |

---

## Using the packages in your app

### Install

```bash
yarn add \
  @commercetools-demo/puck-page-manager \
  @commercetools-demo/puck-content-manager \
  @commercetools-demo/puck-theme-manager \
  @commercetools-demo/puck-renderer
# peer deps (if not already present):
yarn add react react-dom react-intl @measured/puck "react-router-dom@5"
```

`puck-api`, `puck-editor`, `puck-types`, and `puck-version-history` come in transitively.

### Mount the editors

```tsx
import { PageManager } from '@commercetools-demo/puck-page-manager';
import { ContentManager } from '@commercetools-demo/puck-content-manager';
import { ThemeManager } from '@commercetools-demo/puck-theme-manager';

const connection = {
  baseURL: 'https://your-service-url/service',
  projectKey: 'my-project',
  businessUnitKey: 'my-bu',
  jwtToken: jwt, // from POST /service/authenticate-project
};

<PageManager {...connection} parentUrl="/" />
<ContentManager {...connection} parentUrl="/" />
<ThemeManager {...connection} />
```

The managers are router-aware and create their own React Router (v5) instance using
`parentUrl` as the basename — you do not need to provide a `<Router>` yourself.

### Render content in a storefront

```tsx
import { PuckRenderer } from '@commercetools-demo/puck-renderer';

// Render a published page by slug
<PuckRenderer
  type="page"
  baseURL="https://your-service-url/service"
  projectKey="my-project"
  businessUnitKey="my-bu"
  slug="/home"
  mode="published"
/>

// Render a standalone content item by key
<PuckRenderer type="content" {...connection} contentKey="hero-banner" />
```

For server-side rendering, fetch the data yourself (via `puck-api`) and pass it to
`PuckDataRenderer`.

### Pass a custom Puck config

Editors and renderers accept a `config` prop. Extend `defaultPuckConfig` to add your own
components:

```tsx
import { defaultPuckConfig } from '@commercetools-demo/puck-editor';

const config = {
  ...defaultPuckConfig,
  components: {
    ...defaultPuckConfig.components,
    MyBlock: {
      fields: { title: { type: 'text' } },
      render: ({ title }) => <h2>{title}</h2>,
    },
  },
};
```

> Use the **same** `config` in the editor/managers and the renderer so that authored
> content renders identically in both places.

---

## Authentication & multi-tenancy

The service is multi-tenant: a single deployment serves many commercetools projects.

1. **Register / authenticate a project** — exchange commercetools API credentials for a JWT:

   ```http
   POST /service/authenticate-project
   Content-Type: application/json

   {
     "ct_client_id": "…",
     "ct_client_secret": "…",
     "ct_project_key": "my-project",
     "ct_region": "gcp-us",
     "ct_scope": "manage_project:my-project"
   }
   ```

   The service validates the credentials against commercetools, stores the project in
   Firestore, and returns `{ token, expiresIn, projectKey }`.

2. **Authenticate requests**:
   - **Reads** require the `x-project-key: <projectKey>` header.
   - **Mutations** require `Authorization: Bearer <jwt>` (the JWT's `sub` is the project key).

3. **Refresh** an expiring token with `POST /service/refresh-jwt` (send the existing,
   possibly-expired token as a Bearer token).

The Merchant Center app mints this JWT for the logged-in user automatically; standalone apps
call `authenticate-project` themselves and pass the result as the `jwtToken` prop.

---

## Backend service API

Base path: **`/service`**. Errors use `{ "statusCode": number, "message": string }`.

A ready-to-use Postman collection and environment live in
[`service/postman/`](service/postman) — import
[`cms-api-postman-collection.json`](service/postman/cms-api-postman-collection.json)
and [`cms-api-postman-environment.json`](service/postman/cms-api-postman-environment.json),
then run **Auth → Authenticate Project** first to populate the bearer token.

### Endpoint groups

| Group | Routes |
| ----- | ------ |
| **Auth** | `POST /authenticate-project` · `POST /refresh-jwt` · `GET /health` |
| **Puck pages** | `GET/POST /:bu/puck-pages` · `GET/PUT/DELETE /:bu/puck-pages/:key` · `GET /:bu/published/puck-pages/:key` · `GET /:bu/preview/puck-pages/:key` · `POST /:bu/published\|preview/puck-pages/query` (by slug) |
| **Page states** | `GET /:bu/puck-pages/:key/states` · `PUT /:bu/puck-pages/:key/states/published?clearDraft=true` · `DELETE /:bu/puck-pages/:key/states/draft` (revert) |
| **Page versions** | `GET /:bu/puck-pages/:key/versions` |
| **Puck content** | the same set of routes as pages, under `/:bu/puck-contents` (list/CRUD, published/preview, query, states, versions) |
| **Media** | `POST /:bu/upload-file` (multipart) · `GET /:bu/media-library?extensions=&page=&limit=` · `POST /compile-upload` |
| **Configuration** | `GET/POST/PUT/DELETE /:bu/configuration/theme` (also `header`, `footer`, `facet`, `site-metadata`, `category-listing`, `translations`, `b2b-account-menu-links`) |
| **Datasources** | `GET /datasource` · `GET/POST/PUT/DELETE /datasource/:key` |

(`:bu` = `:businessUnitKey`.) Publishing promotes the draft to published; passing
`?clearDraft=true` removes the draft afterwards. Deleting the draft state reverts to the
published version.

### Environment variables

| Variable | Required | Description |
| -------- | :------: | ----------- |
| `JWT_SECRET` | ✅ | Secret used to sign/verify JWTs. |
| `JWT_EXPIRATION` | | Token lifetime (e.g. `24h`). |
| `JWT_ISSUER` / `JWT_AUDIENCE` | | Override the default `multitenant-contentools` claims. |
| `GCP_PROJECT_ID` | ✅ | GCP project hosting Firestore. |
| `GCP_FIRESTORE_DATABASE_ID` | ✅ | Firestore database id (tenant registry). |
| `GCP_FIRESTORE_SERVICE_ACCOUNT_CLIENT_EMAIL` | | Firestore service-account email (local/dev). |
| `GCP_FIRESTORE_SERVICE_ACCOUNT_PRIVATE_KEY` | | Firestore service-account key (local/dev). |
| `STORAGE_TYPE` | ✅ | Media backend: `gcp`, `aws`, or `cloudinary`. |
| `GCP_BUCKET_NAME`, `GCP_STORAGE_SERVICE_ACCOUNT_*` | | When `STORAGE_TYPE=gcp`. |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET` | | When `STORAGE_TYPE=aws`. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | | When `STORAGE_TYPE=cloudinary`. |
| `CORS_ALLOWED_ORIGINS` | | Comma-separated list of allowed origin domains. |
| `MAX_VERSIONS` | | Number of versions to retain per page/content item (default `5`). |

---

## Data model & storage

- **Tenant registry** — each authenticated project is stored in the Firestore `projects`
  collection (key, encrypted-at-rest credentials, region, scope, active flag, last accessed).
- **Content** — pages, content items, their draft/published states, version history, and the
  theme are stored as **commercetools custom objects**, scoped per business unit, in
  dedicated containers (`puck-page`, `puck-page-state`, `puck-page-version`, `puck-content`,
  `puck-content-state`, `puck-content-version`, `configuration`, …). Container names are
  overridable via env vars.
- **Media** — uploaded files are stored in the configured object store (GCP/AWS/Cloudinary)
  under a `projectKey/businessUnitKey` path and referenced by URL.

A page value carries `{ key, businessUnitKey, name, slug, puckData, meta, createdAt,
updatedAt }`, where `puckData` is the Puck document (`content`, `root`, optional `zones`).

---

## Theming

`ThemeManager` edits a theme document (colors, typography, spacing, shadows, design
paradigm) and persists it via `…/configuration/theme`. Themes can start from one of the
built-in `themePresets`. At render time, `buildCssVars()` (from `puck-theme-manager`)
converts the theme tokens into CSS custom properties so components can style themselves from
`var(--…)` values. `DEFAULT_THEME` provides sensible defaults when no theme is configured.

---

## Building & publishing packages

From `puck/`:

```bash
yarn build         # build every package (topological order)
yarn typecheck     # type-check all packages
yarn lint          # lint all package sources
```

The workspace ships two helper scripts:

- `./bump-versions.sh [patch|minor|major] [--yes]` — bump every package version together.
- `./publish-puck-packages.sh [--yes]` — publish all packages to npm in dependency order
  (requires `npm login` and a clean git tree).

Packages are versioned in lockstep; the published `@commercetools-demo/puck-*` packages all
share the same release line.

---

## Deployment

### Backend service → Cloud Run

The service deploys to **Google Cloud Run** as `multitenant-contentools` via GitHub Actions
(`.github/workflows/workflow.yml`) on every push to `main`. The workflow authenticates to
GCP, then runs `gcloud run deploy --source service/` and injects the environment variables /
secrets listed above (Firestore, `JWT_SECRET`, `STORAGE_TYPE`, the matching storage
credentials, and `CORS_ALLOWED_ORIGINS`).

To deploy manually:

```bash
gcloud run deploy multitenant-contentools \
  --source service/ \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars JWT_SECRET=…,GCP_PROJECT_ID=…,GCP_FIRESTORE_DATABASE_ID=…,STORAGE_TYPE=gcp,…
```

The service can also be containerized directly (`service/Dockerfile`, exposes port `8080`),
or deployed as a **commercetools Connect** service application using `connect.yaml`.

### Merchant Center custom application

Build the custom app with `mc-scripts` and register it in the Merchant Center:

```bash
cd contentools
yarn build                 # production build
yarn compile-html          # compile the index.html for hosting
```

Configure the application in `contentools/custom-application-config.mjs` (entry point,
permissions, CSP). Point its `CMS_API_URL` at the deployed backend service, host the build,
and register the resulting URL as your custom application in the Merchant Center. It can
likewise be deployed through commercetools Connect as a
`merchant-center-custom-application`.

---

## License

This project is provided as-is for demonstration purposes. See [`service/LICENSE`](service/LICENSE).
