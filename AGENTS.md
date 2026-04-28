# Agents Guide

This is a RoxyAPI starter app. A dream symbol journal and dictionary built with React Native, Expo SDK 54, and TypeScript. Search and browse over 2,000 dream symbols with full psychological interpretations, plus a daily symbol surface, all powered by the RoxyAPI Dreams API.

## Setup
- Get an API key at https://roxyapi.com/pricing
- Create `.env` in the project root with:
  - `EXPO_PUBLIC_ROXYAPI_KEY=your_api_key_here`
  - `EXPO_PUBLIC_ROXYAPI_BASE_URL=https://roxyapi.com/api/v2`
- Install with `npm install`
- Run with `npm start`, then `npm run ios`, `npm run android`, or `npm run web`

## How to call RoxyAPI
- Base URL: `https://roxyapi.com/api/v2`
- Auth header: `X-API-Key: <key>`
- Live OpenAPI spec: https://roxyapi.com/api/v2/dreams/openapi.json
- Live playground: https://roxyapi.com/api-reference

## Endpoints used in this app
- `GET /dreams/symbols` for the full A to Z list of dream symbols, with search and pagination
- `GET /dreams/symbols/{id}` for a single symbol with full psychological interpretation
- `GET /dreams/daily` for the daily seeded dream symbol

## Where to extend
- `src/api/client.ts` is the API client setup.
- `src/api/dreams.ts` exports the dream methods used by screens.
- `src/api/schema.ts` holds auto generated types from the OpenAPI spec.
- `app/(tabs)/` holds the tab screens: `index.tsx` (daily), `browse.tsx` (A to Z), `search.tsx`, `random.tsx`.
- `src/components/SymbolDetailModal.tsx` renders the full interpretation modal.

## Conventions
- All RoxyAPI calls go through `src/api/`. Do not call `fetch` directly from screens.
- Symbol interpretations cover subconscious symbolism, emotional significance, and connections to waking life. Render the full content rather than truncating client side.

## Resources
- TypeScript SDK: https://github.com/RoxyAPI/sdk-typescript (npm: `@roxyapi/sdk`)
- Python SDK: https://github.com/RoxyAPI/sdk-python (PyPI: `roxy-sdk`)
- MCP servers: https://roxyapi.com/docs/mcp
- More starters: https://roxyapi.com/starters
- Pricing: https://roxyapi.com/pricing
