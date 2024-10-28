import puppeteer from "puppeteer";
import { SearchResult } from "./types";
import fs from 'fs/promises';
import path from 'path';
const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36";

const TIMEOUT = 30000;

const BLOCKED_RESOURCE_TYPES = [
  "image",
  "media",
  "font",
  "stylesheet",
  "other",
];
const BLOCKED_EXTENSIONS = [".pdf", ".zip", ".exe", ".dmg", ".doc", ".docx"];

const isDownloadableResource = (url: string) => {
  return BLOCKED_EXTENSIONS.some((ext) => url.toLowerCase().endsWith(ext));
};

export const scrapeConcurrently = async (
  queries: string[],
  companyName = "",
  picky = false,
  resultLimit = Infinity
): Promise<Map<string, SearchResult[]>> => {
  const resultsMap = new Map<string, SearchResult[]>();
  let successfulRequests = 0;
  const totalRequests = queries.length;
  const MAX_RETRIES = 3; // Max retry attempts

  try {
    const scrapePromises = queries.map(async (query) => {
      let retryCount = 0;
      let success = false;

      while (retryCount < MAX_RETRIES && !success) {
        const browser = await puppeteer.launch({
          headless: true,
          args: ["--disable-http2", "--disable-web-security"],
        });

        const page = await browser.newPage();
        await page.setUserAgent(DEFAULT_USER_AGENT);

        await page.setRequestInterception(true);
        page.on("request", (request) => {
          const resourceType = request.resourceType();
          const url = request.url();

          if (
            BLOCKED_RESOURCE_TYPES.includes(resourceType) ||
            isDownloadableResource(url)
          ) {
            request.abort();
          } else {
            request.continue();
          }
        });

        try {
          await page.goto(
            `https://www.bing.com/search?q=${encodeURIComponent(
              query
            )}&PC=U316&FORM=CHROMN`,
            {
              waitUntil: "domcontentloaded",
              timeout: TIMEOUT,
            }
          );
          console.log(`Scraping for query: ${query}`);
          const results = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".b_algo")).map(
              (result, index) => ({
                title: result.querySelector("h2")?.textContent || "",
                website: result.querySelector("a")?.href || "",
                snippet: result.querySelector(".b_caption")?.textContent || "",
                id: index,
              })
            );
          });

          if (results.length === 0) {
            console.log(
              `found no results: ${`https://www.bing.com/search?q=${encodeURIComponent(
                query
              )}&PC=U316&FORM=CHROMN`}`
            );
            console.log(await page.evaluate(() => document.body.innerText));
          }

          let resultsToReturn = results;
          if (picky) {
            resultsToReturn = resultsToReturn.filter((result) =>
              result.title
                .toLocaleLowerCase()
                .includes(companyName.toLocaleLowerCase())
            );
          }
          if (resultsToReturn.length > resultLimit) {
            resultsToReturn = resultsToReturn.slice(0, resultLimit);
          }
          //make sure resultsToReturn does not contain any duplicates. This includes sources already added in other queries.
          const uniqueUrls = new Set();
          resultsToReturn = resultsToReturn.filter((result) => {
            if (!uniqueUrls.has(result.website)) {
              uniqueUrls.add(result.website);
              return true;
            }
            return false;
          });
          resultsMap.set(query, resultsToReturn);
          successfulRequests++;
          success = true; // Mark the request as successful
        } catch (error) {
          retryCount++;
          console.log(
            `Failed to scrape for query: ${query}. Retry attempt ${retryCount}/${MAX_RETRIES}. Error: ${error}`
          );
        } finally {
          await page.close();
          await browser.close();
        }
      }

      if (!success) {
        console.log(`Max retries reached for query: ${query}`);
      }
    });

    await Promise.all(scrapePromises);

   

  } catch (error) {
    console.error(`An error occurred during scraping: ${error}`);
  } finally {
    console.log(
      `Scraping complete: ${successfulRequests}/${totalRequests} requests successful`
    );
  }

  return getUniqueUrls(resultsMap);
};

export const fetchFullTextsConcurrently = async (
  resultsMap: Map<string, SearchResult[]>
): Promise<Map<string, { text: string; url: string, title:string, }[]>> => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-http2", "--disable-web-security"],
  });
  const fullTextsMap = new Map<
    string,
    { text: string; url: string; title: string }[]
  >();
  let successfulRequests = 0;
  let totalRequests = 0;

  try {
    const fetchPromises = [];
    for (const [query, results] of resultsMap.entries()) {
      totalRequests += results.length;
      for (const result of results) {
        fetchPromises.push(
          (async () => {
            const page = await browser.newPage();
            await page.setUserAgent(DEFAULT_USER_AGENT);

            await page.setRequestInterception(true);
            page.on("request", (request) => {
              const resourceType = request.resourceType();
              const url = request.url();

              if (
                BLOCKED_RESOURCE_TYPES.includes(resourceType) ||
                isDownloadableResource(url)
              ) {
                request.abort();
              } else {
                request.continue();
              }
            });

            try {
              await page.goto(result.website, {
                waitUntil: "domcontentloaded",
                timeout: TIMEOUT,
              });

              const text = await page.evaluate(() => document.body.innerText);

              if (!fullTextsMap.has(query)) {
                fullTextsMap.set(query, []);
              }
              fullTextsMap
                .get(query)
                ?.push({ text, url: result.website, title: result.title });
              successfulRequests++;
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
              console.log("found an error");
            } finally {
              await page.close();
            }
          })()
        );
      }
    }

    await Promise.all(fetchPromises);
  } catch (error) {
    console.error(`An error occurred during fetching`, error);
  } finally {
    await browser.close();
    console.log(
      `Fetching complete: ${successfulRequests}/${totalRequests} requests successful`
    );
  }

  return fullTextsMap;
};

export function getUniqueUrls(resultsMap: Map<string, SearchResult[]>): Map<string, SearchResult[]> {
  const uniqueUrls = new Set<string>();
  const uniqueResultsMap = new Map<string, SearchResult[]>();

  for (const [query, results] of resultsMap.entries()) {
    const uniqueResults = results.filter(result => {
      // Remove the fragment identifier from the URL
      const baseUrl = result.website.split('#')[0];
      if (uniqueUrls.has(baseUrl)) {
        return false;
      }
      uniqueUrls.add(baseUrl);
      return true;
    });
    uniqueResultsMap.set(query, uniqueResults.map(r => ({...r, query})));
  }

  return uniqueResultsMap;
}
