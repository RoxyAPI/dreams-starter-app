/**
 * Tests for the dreams data layer. `@roxyapi/sdk` is mocked, so these run offline with no real key. They prove every `dreamsApi` method calls the matching SDK method with the spec query / body shape, unwraps `data`, and turns an SDK `{ error }` result into a thrown message the screens can catch.
 *
 * The mock SDK builds its dreams client once and returns the same instance from every `createRoxy` call, so the test can grab the same `jest.fn` handles the data layer holds. The factory is self-contained to satisfy the `jest.mock` hoisting rule.
 */

import { createRoxy } from '@roxyapi/sdk';

jest.mock('@roxyapi/sdk', () => {
  const dreams = {
    searchDreamSymbols: jest.fn(),
    getDreamSymbol: jest.fn(),
    getRandomSymbols: jest.fn(),
    getSymbolLetterCounts: jest.fn(),
    getDailyDreamSymbol: jest.fn(),
  };
  return { createRoxy: () => ({ dreams }) };
});

import { dreamsApi } from './dreams';

const mockDreams = createRoxy('test-key').dreams as unknown as Record<string, jest.Mock>;

const ok = <T>(data: T) => ({ data, error: undefined });

beforeEach(() => {
  for (const fn of Object.values(mockDreams)) fn.mockReset();
});

describe('dreamsApi success paths', () => {
  it('listSymbols forwards the query and returns the page', async () => {
    mockDreams.searchDreamSymbols.mockResolvedValue(ok({ total: 1, limit: 20, offset: 0, symbols: [] }));
    const page = await dreamsApi.listSymbols({ q: 'water', limit: 20 });
    expect(mockDreams.searchDreamSymbols).toHaveBeenCalledWith({ query: { q: 'water', limit: 20 } });
    expect(page.total).toBe(1);
  });

  it('listSymbols sends an undefined query when called with no args', async () => {
    mockDreams.searchDreamSymbols.mockResolvedValue(ok({ total: 0, limit: 20, offset: 0, symbols: [] }));
    await dreamsApi.listSymbols();
    expect(mockDreams.searchDreamSymbols).toHaveBeenCalledWith({ query: undefined });
  });

  it('getSymbol forwards the id as a path param', async () => {
    mockDreams.getDreamSymbol.mockResolvedValue(ok({ id: 'snake', name: 'Snake', letter: 's', meaning: 'transformation' }));
    const symbol = await dreamsApi.getSymbol('snake');
    expect(mockDreams.getDreamSymbol).toHaveBeenCalledWith({ path: { id: 'snake' } });
    expect(symbol.name).toBe('Snake');
  });

  it('getRandomSymbols forwards the count and unwraps the symbols array', async () => {
    mockDreams.getRandomSymbols.mockResolvedValue(ok({ symbols: [{ id: 'flying', name: 'Flying', letter: 'f', meaning: 'freedom' }] }));
    const symbols = await dreamsApi.getRandomSymbols(3);
    expect(mockDreams.getRandomSymbols).toHaveBeenCalledWith({ query: { count: 3 } });
    expect(symbols[0].name).toBe('Flying');
  });

  it('getRandomSymbols defaults to a count of 1', async () => {
    mockDreams.getRandomSymbols.mockResolvedValue(ok({ symbols: [] }));
    await dreamsApi.getRandomSymbols();
    expect(mockDreams.getRandomSymbols).toHaveBeenCalledWith({ query: { count: 1 } });
  });

  it('getLetterCounts returns the A-Z map', async () => {
    mockDreams.getSymbolLetterCounts.mockResolvedValue(ok({ letters: { a: 138, b: 282 }, total: 2526 }));
    const counts = await dreamsApi.getLetterCounts();
    expect(mockDreams.getSymbolLetterCounts).toHaveBeenCalledWith();
    expect(counts.letters.a).toBe(138);
    expect(counts.total).toBe(2526);
  });

  it('getDailySymbol seeds per device and returns the symbol', async () => {
    mockDreams.getDailyDreamSymbol.mockResolvedValue(ok({ date: '2026-05-23', seed: 'user-1', symbol: { id: 'water', name: 'Water' }, dailyMessage: 'flow' }));
    const daily = await dreamsApi.getDailySymbol({ seed: 'user-1', date: '2026-05-23' });
    expect(mockDreams.getDailyDreamSymbol).toHaveBeenCalledWith({ body: { seed: 'user-1', date: '2026-05-23' } });
    expect(daily.symbol.name).toBe('Water');
  });

  it('getDailySymbol sends an empty body when called with no args', async () => {
    mockDreams.getDailyDreamSymbol.mockResolvedValue(ok({ date: '2026-05-23', seed: '', symbol: {}, dailyMessage: '' }));
    await dreamsApi.getDailySymbol();
    expect(mockDreams.getDailyDreamSymbol).toHaveBeenCalledWith({ body: {} });
  });
});

describe('dreamsApi error paths', () => {
  it('throws when the SDK returns an error result', async () => {
    mockDreams.getDreamSymbol.mockResolvedValue({ data: undefined, error: { error: 'boom', code: 'not_found' } });
    await expect(dreamsApi.getSymbol('nope')).rejects.toThrow('Symbol not found');
  });

  it('throws when the SDK returns no data', async () => {
    mockDreams.searchDreamSymbols.mockResolvedValue({ data: undefined, error: undefined });
    await expect(dreamsApi.listSymbols()).rejects.toThrow('Failed to fetch symbols');
  });
});
