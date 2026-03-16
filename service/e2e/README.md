# E2E Tests for CMS Service

End-to-end tests run against the CMS service HTTP API. They are specified from **route names/descriptions** (not implementation) and include happy and unhappy paths. Each test cleans up created data via DELETE endpoints.

## Running locally

1. **Start the service** (one of):
   - From repo root: `cd service && yarn build && yarn start`
   - Or with Docker: `docker-compose -f service/docker-compose.e2e.yml --env-file service/.env up -d` (then wait for the service to be ready)

2. **Set env** (e.g. in `service/.env` or export):
   - `BASE_URL` – default `http://localhost:8080`
   - `BUSINESS_UNIT_KEY` – tenant for path params (often same as `CTP_PROJECT_KEY`)
   - `CTP_PROJECT_KEY`, `CTP_CLIENT_ID`, `CTP_CLIENT_SECRET` – used to get a JWT via `POST /service/authenticate-project`

3. **Run tests**:
   ```bash
   cd service && yarn test:e2e
   ```

## CI (GitHub Actions)

The workflow in `.github/workflows/e2e.yml` builds the service Docker image, starts the container with env from secrets/vars, waits for the service to respond, then runs `yarn test:e2e`. Required repository vars/secrets align with the deploy workflow (Firestore, JWT, CTP_*, STORAGE_*, etc.).

## Env reference

All env variable names, defaults, and resolved values are defined in **`e2e/constants.ts`** (`ENV_KEYS`, `E2E_ENV`, `ensureE2EEnv`).

| Variable            | Required | Description                                      |
|---------------------|----------|--------------------------------------------------|
| BASE_URL            | Yes      | Service base URL (e.g. `http://localhost:8080`)  |
| BUSINESS_UNIT_KEY   | No       | Defaults to CTP_PROJECT_KEY                     |
| CTP_PROJECT_KEY     | Yes      | CommerceTools project key (and x-project-key)   |
| CTP_CLIENT_ID       | Yes      | For authenticate-project                        |
| CTP_CLIENT_SECRET   | Yes      | For authenticate-project                        |
| CTP_AUTH_URL        | No       | Optional override                                |
| CTP_API_URL         | No       | Optional override                                |
| CTP_SCOPE           | No       | Optional override                                |
