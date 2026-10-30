import { chromium } from "playwright-core";
import Browserbase from "@browserbasehq/sdk";

const bb = new Browserbase({
  apiKey: process.env.BROWSERBASE_API_KEY,
});

// Search Google for a keyword and extract ranking result for a target domain

function normalizeDomain(value) {
  const input = value.includes("://") ? value : `https://${value}`;
  return new URL(input).hostname.replace(/^www\./, "").toLowerCase();
}

export async function rankTracker(keyword, targetDomain) {
  let browser;

  try {
    const session = await bb.sessions.create({
      browserSettings: { blockAds: true },
      api_timeout: 300,
      keepAlive: false,
    });

    browser = await chromium.connectOverCDP(session.connectUrl);

    const page = browser.contexts()[0]?.pages()[0];
    if (!page) {
      throw new Error("Browser session did not provide a page");
    }

    page.setDefaultNavigationTimeout(45000);

    const cleanTarget = normalizeDomain(targetDomain);
    const allResults = [];
    let found = null;

    // Har Google results page par jao aur usi page ke results process karo.
    for (let gPage = 0; gPage < 5; gPage++) {
      await page.goto(
        `https://www.google.com/search?q=${encodeURIComponent(keyword)}&start=${gPage * 10}&num=10&hl=en&gl=us`,
        { waitUntil: "domcontentloaded" }
      );

      let pageResults = [];

      for (let retry = 0; retry < 3; retry++) {
        try {
          await page.waitForSelector("h3", { timeout: 10000 });

          pageResults = await page.evaluate(() =>
            Array.from(document.querySelectorAll("h3"))
              .map((h3) => {
                const anchor = h3.closest("a");
                if (!anchor || !anchor.href.startsWith("http")) return null;

                const url = anchor.href;
                const domain = new URL(url).hostname
                  .replace(/^www\./, "")
                  .toLowerCase();

                if (domain.includes("google.")) return null;

                const container = anchor.parentElement?.parentElement;
                const snippet =
                  (container?.innerText || "")
                    .split("\n")
                    .find(
                      (line) =>
                        line.length > 30 &&
                        !line.includes(h3.innerText.substring(0, 20))
                    )
                    ?.trim()
                    .substring(0, 300) || "";

                return {
                  url,
                  domain,
                  title: h3.innerText.trim(),
                  snippet,
                };
              })
              .filter(Boolean)
          );

          if (pageResults.length > 0) break;
        } catch {
          // Retry this results page, up to three times.
        }

        if (retry < 2) await page.waitForTimeout(1000);
      }

      for (const result of pageResults) {
        result.position = allResults.length + 1;
        allResults.push(result);

        const isTarget =
          result.domain === cleanTarget ||
          result.domain.endsWith(`.${cleanTarget}`);

        if (isTarget) {
          found = { ...result, page: gPage + 1 };
          break;
        }
      }

      if (found) break;
    }

    const competitors = allResults
      .filter(
        (result) =>
          result.domain !== cleanTarget &&
          !result.domain.endsWith(`.${cleanTarget}`)
      )
      .slice(0, 10);

    return {
      success: true,
      data: {
        keyword,
        targetDomain,
        position: found?.position ?? null,
        page: found?.page ?? null,
        title: found?.title || "",
        snippet: found?.snippet || "",
        competitors,
        totalResultScanned: allResults.length,
      },
    };
  } catch (error) {
    console.error("Rank check:", error.message);
    return { success: false, error: error.message };
  } finally {
    if (browser?.isConnected()) {
      await browser.close().catch(() => {});
    }
  }
}
