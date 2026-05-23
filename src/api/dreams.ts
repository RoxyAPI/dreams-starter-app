import { roxy } from './client';
import type {
  DreamSymbol,
  GetDreamsSymbolsResponse,
  GetDreamsSymbolsByIdResponse,
  GetDreamsSymbolsLettersResponse,
  GetDreamsSymbolsData,
  PostDreamsDailyData,
  PostDreamsDailyResponse,
} from '@roxyapi/sdk';

type SdkResult<T> = { data?: T; error?: unknown };

/**
 * Unwrap a Roxy SDK result, returning `data` or throwing a screen-friendly message. The SDK never throws on a non-2xx response: it returns `{ data, error }`, so every call site funnels through here to turn an error into one thrown `Error` the screens can catch.
 */
const unwrap = <T>(result: SdkResult<T>, message: string): T => {
  if (result.error || !result.data) throw new Error(message);
  return result.data;
};

/** Query and body shapes pulled from the SDK request types so the screens cannot drift from the spec. Dreams is English-only, so there is no `lang` parameter. */
export type ListSymbolsQuery = NonNullable<GetDreamsSymbolsData['query']>;
export type DailySymbolRequest = NonNullable<PostDreamsDailyData['body']>;

export const dreamsApi = {
  listSymbols: async (query?: ListSymbolsQuery): Promise<GetDreamsSymbolsResponse> =>
    unwrap(await roxy.dreams.searchDreamSymbols({ query }), 'Failed to fetch symbols'),

  getSymbol: async (id: string): Promise<GetDreamsSymbolsByIdResponse> =>
    unwrap(await roxy.dreams.getDreamSymbol({ path: { id } }), 'Symbol not found'),

  getRandomSymbols: async (count = 1): Promise<DreamSymbol[]> =>
    unwrap(await roxy.dreams.getRandomSymbols({ query: { count } }), 'Failed to fetch random symbols').symbols,

  getLetterCounts: async (): Promise<GetDreamsSymbolsLettersResponse> =>
    unwrap(await roxy.dreams.getSymbolLetterCounts(), 'Failed to fetch letter counts'),

  getDailySymbol: async (body?: DailySymbolRequest): Promise<PostDreamsDailyResponse> =>
    unwrap(await roxy.dreams.getDailyDreamSymbol({ body: body ?? {} }), 'Failed to get daily symbol'),
};
