/**
 * Dream response types, re-exported from `@roxyapi/sdk` so the screens import stable names without depending on the SDK's path-based type names. The SDK ships these types from the same OpenAPI spec the API serves, so they cannot drift from the live responses.
 */

export type {
  BasicDreamSymbol,
  DreamSymbol,
  GetDreamsSymbolsResponse as SymbolsListResponse,
  GetDreamsSymbolsByIdResponse as SymbolResponse,
  GetDreamsSymbolsLettersResponse as LetterCountsResponse,
  PostDreamsDailyResponse as DailySymbolResponse,
} from '@roxyapi/sdk';
