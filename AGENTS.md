# Agents Guide

This is a RoxyAPI starter app. A dream interpretation app built with React Native, Expo SDK 54, and TypeScript. Ships with a daily seeded dream symbol, an A to Z dream dictionary, keyword search across 2,000+ dream symbols, and random symbol discovery, all powered by the RoxyAPI Dreams API through the official `@roxyapi/sdk`.

## Setup
- Get an API key at https://roxyapi.com/pricing
- Create `.env` in the project root with:
  - `EXPO_PUBLIC_ROXYAPI_KEY=your_api_key_here`
- Install with `npm install`
- Run with `npm start`, then `npm run ios`, `npm run android`, or `npm run web`
- Test with `npm test`, typecheck with `npm run typecheck`

## How it calls RoxyAPI
- The only data layer is `@roxyapi/sdk`. `createRoxy(key)` sets the base URL and the auth header, and ships its own types from the OpenAPI spec, so there is no generated schema file to keep in sync.
- The key is bundled into the app (mobile has no server). Treat `EXPO_PUBLIC_ROXYAPI_KEY` as a public, restricted key locked to your bundle id, or proxy calls through a backend you control.
- Dreams is English-only, so there is no `lang` parameter on these calls.
- Live OpenAPI spec: https://roxyapi.com/api/v2/dreams/openapi.json
- Live playground: https://roxyapi.com/api-reference

## Endpoints used in this app
- `roxy.dreams.getDailyDreamSymbol` for a seeded daily symbol with consistent results per device
- `roxy.dreams.searchDreamSymbols` for the A to Z list, keyword search, and pagination
- `roxy.dreams.getDreamSymbol` for a single symbol with the full psychological interpretation
- `roxy.dreams.getRandomSymbols` for random single or multi symbol discovery
- `roxy.dreams.getSymbolLetterCounts` for the A to Z navigation counts

## Where to extend
- `src/api/client.ts` is the single Roxy SDK client and the `hasApiKey` guard.
- `src/api/dreams.ts` wraps the `roxy.dreams.*` methods used by screens and unwraps the SDK `{ data, error }` result.
- `src/api/types.ts` re-exports the SDK response types under app-friendly names.
- `app/(tabs)/` holds the tab screens: `index.tsx` (daily), `browse.tsx` (A to Z), `search.tsx`, `random.tsx`.
- `src/components/SymbolDetailModal.tsx` renders the full interpretation modal.

## Conventions
- All RoxyAPI calls go through `src/api/`. Do not call `fetch` or the SDK directly from screens.
- Method names and query or body fields come from the SDK types, never invented. Verify against the OpenAPI spec.
- The search and list endpoint takes `q` for keyword search, `letter` for A to Z filtering, and `limit` up to 50.
- Daily symbol seeding uses a stable device id from `AsyncStorage` so the daily symbol stays consistent across sessions.
- Render the full interpretation rather than truncating subconscious symbolism, emotional significance, and waking-life connections client side.

## Resources
- TypeScript SDK: https://github.com/RoxyAPI/sdk-typescript (npm: `@roxyapi/sdk`)
- Python SDK: https://github.com/RoxyAPI/sdk-python (PyPI: `roxy-sdk`)
- MCP servers: https://roxyapi.com/docs/mcp
- Methodology and accuracy: https://roxyapi.com/methodology
- More starters: https://roxyapi.com/starters
- Pricing: https://roxyapi.com/pricing
