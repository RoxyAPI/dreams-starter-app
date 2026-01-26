import type { paths, components } from './schema';

// Extract response types from OpenAPI schema
type SymbolsResponse = paths['/symbols']['get']['responses']['200']['content']['application/json'];
type RandomSymbolsResponseRaw = paths['/symbols/random']['get']['responses']['200']['content']['application/json'];
type LetterCountsResponseRaw = paths['/symbols/letters']['get']['responses']['200']['content']['application/json'];
type SymbolResponse = paths['/symbols/{id}']['get']['responses']['200']['content']['application/json'];

// Component types
export type DreamSymbol = components['schemas']['DreamSymbol'];
export type BasicDreamSymbol = components['schemas']['BasicDreamSymbol'];

// Response types
export type SymbolsListResponse = SymbolsResponse;
export type RandomSymbolsResponse = RandomSymbolsResponseRaw;
export type LetterCountsResponse = LetterCountsResponseRaw;
