import { getUniqueUrls } from '../scrapeUtils';

describe('getUniqueUrls', () => {
  it('should remove duplicate URLs across all queries, ignoring fragment identifiers', () => {
    const inputMap = new Map([
      ['query1', [
        { website: 'https://example.com', title: 'Example 1', snippet: 'Snippet 1', id: 0 },
        { website: 'https://example.org', title: 'Example 2', snippet: 'Snippet 2', id: 1 },
      ]],
      ['query2', [
        { website: 'https://example.com#section1', title: 'Example 3', snippet: 'Snippet 3', id: 0 },
        { website: 'https://example.net', title: 'Example 4', snippet: 'Snippet 4', id: 1 },
      ]],
      ['query3', [
        { website: 'https://example.org#different-section', title: 'Example 5', snippet: 'Snippet 5', id: 0 },
        { website: 'https://example.edu', title: 'Example 6', snippet: 'Snippet 6', id: 1 },
      ]],
    ]);

    const uniqueResultsMap = getUniqueUrls(inputMap);

    expect(uniqueResultsMap.size).toBe(3);
    expect(uniqueResultsMap.get('query1')).toEqual([
      { website: 'https://example.com', title: 'Example 1', snippet: 'Snippet 1', id: 0, query: 'query1' },
      { website: 'https://example.org', title: 'Example 2', snippet: 'Snippet 2', id: 1, query: 'query1' },
    ]);
    expect(uniqueResultsMap.get('query2')).toEqual([
      { website: 'https://example.net', title: 'Example 4', snippet: 'Snippet 4', id: 1, query: 'query2' },
    ]);
    expect(uniqueResultsMap.get('query3')).toEqual([
      { website: 'https://example.edu', title: 'Example 6', snippet: 'Snippet 6', id: 1, query: 'query3' },
    ]);
  });

  it('should return an empty map when given an empty map', () => {
    const inputMap = new Map();
    const uniqueResultsMap = getUniqueUrls(inputMap);
    expect(uniqueResultsMap.size).toBe(0);
  });

  it('should return a map with added query property when there are no duplicates', () => {
    const inputMap = new Map([
      ['query1', [
        { website: 'https://example.com', title: 'Example 1', snippet: 'Snippet 1', id: 0 },
      ]],
      ['query2', [
        { website: 'https://example.org', title: 'Example 2', snippet: 'Snippet 2', id: 0 },
      ]],
      ['query3', [
        { website: 'https://example.net', title: 'Example 3', snippet: 'Snippet 3', id: 0 },
      ]],
    ]);

    const uniqueResultsMap = getUniqueUrls(inputMap);

    const expectedMap = new Map([
      ['query1', [
        { website: 'https://example.com', title: 'Example 1', snippet: 'Snippet 1', id: 0, query: 'query1' },
      ]],
      ['query2', [
        { website: 'https://example.org', title: 'Example 2', snippet: 'Snippet 2', id: 0, query: 'query2' },
      ]],
      ['query3', [
        { website: 'https://example.net', title: 'Example 3', snippet: 'Snippet 3', id: 0, query: 'query3' },
      ]],
    ]);

    expect(uniqueResultsMap).toEqual(expectedMap);
  });
});