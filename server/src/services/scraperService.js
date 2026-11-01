import { chromium } from "playwright-core";
import Browserbase from "@browserbasehq/sdk";

let bb = null;
if (process.env.BROWSERBASE_API_KEY) {
  try {
    bb = new Browserbase({
      apiKey: process.env.BROWSERBASE_API_KEY,
    });
  } catch (err) {
    console.warn("[SCRAPER] Failed to initialize Browserbase client:", err.message);
  }
}

export async function scrapeUrl(url) {
  let browser;
  try {
    if (!bb) {
      throw new Error("Browserbase client not initialized");
    }

    const session = await bb.sessions.create({
      browserSettings: { blockAds: true },
    });

    browser = await chromium.connectOverCDP(session.connectUrl);
    const defaultContext = browser.contexts()[0];
    const page = defaultContext.pages()[0];
    page.setDefaultNavigationTimeout(30000);

    const startTime = Date.now();
    let response;
    try {
      response = await page.goto(url, { waitUntil: "domcontentloaded" });
    } catch (navError) {
      await browser.close().catch(() => {});
      browser = null;
      console.warn("[SCRAPER] Navigation failed, falling back to fetch:", navError.message);
      return await scrapeWithFetch(url);
    }

    const loadTime = Date.now() - startTime;
    await page.waitForTimeout(2000);

    // Extract all SEO-relevant data from the rendered page
    const scrapedData = await page.evaluate(() => {
      const getMeta = (name) => {
        const el =
          document.querySelector(`meta[name="${name}"]`) ||
          document.querySelector(`meta[property="${name}"]`);
        return el ? el.getAttribute("content") || "" : "";
      };
      const title = document.title || "";
      const description = getMeta("description");
      const canonical =
        document.querySelector('link[rel="canonical"]')?.href || "";
      const robots = getMeta("robots");
      const ogTitle = getMeta("og:title");
      const ogDescription = getMeta("og:description");
      const ogImage = getMeta("og:image");
      const twitterCard = getMeta("twitter:card");
      const viewport = getMeta("viewport");
      const charsetMeta = document.querySelector("meta[charset]");
      const charset = charsetMeta
        ? charsetMeta.getAttribute("charset") || ""
        : "";
      const h1Elements = document.querySelectorAll("h1");
      const h1Texts = Array.from(h1Elements).map(
        (el) => el.textContent?.trim() || ""
      );
      const headings = {
        h1: document.querySelectorAll("h1").length,
        h2: document.querySelectorAll("h2").length,
        h3: document.querySelectorAll("h3").length,
        h4: document.querySelectorAll("h4").length,
        h5: document.querySelectorAll("h5").length,
        h6: document.querySelectorAll("h6").length,
        h1Texts,
      };
      const allLinks = Array.from(document.querySelectorAll("a[href]"));
      const currentHost = window.location.hostname;
      let internalLinks = 0;
      let externalLinks = 0;
      allLinks.forEach((link) => {
        try {
          const href = link.href;
          if (href.startsWith("mailto:") || href.startsWith("tel:")) return;
          const linkUrl = new URL(href);
          if (linkUrl.hostname === currentHost) internalLinks++;
          else externalLinks++;
        } catch {}
      });
      const allImages = Array.from(document.querySelectorAll("img"));
      const missingAlt = allImages.filter(
        (img) => !img.alt || img.alt.trim() === ""
      ).length;

      const bodyText = document.body?.innerText || "";
      const wordCount = bodyText
        .split(/\s+/)
        .filter((w) => w.length > 0).length;
      const pageSize = document.documentElement.outerHTML.length;

      return {
        metaData: {
          title,
          description,
          canonical,
          robots,
          ogTitle,
          ogDescription,
          ogImage,
          twitterCard,
          viewport,
          charset,
        },
        headings,
        links: {
          internal: internalLinks,
          external: externalLinks,
          total: allLinks.length,
        },
        images: {
          total: allImages.length,
          missingAlt,
          withAlt: allImages.length - missingAlt,
        },
        wordCount,
        pageSize,
        bodyText: bodyText.substring(0, 3000),
      };
    });
    const statusCode = response?.status() || 0;
    await page.close();
    await browser.close();

    return {
      success: true,
      data: { ...scrapedData, loadTime, statusCode, url },
    };
  } catch (error) {
    console.warn(
      `[SCRAPER] Browserbase unavailable or failed (${error.message}). Falling back to HTTP fetch scraper...`
    );
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.error("[SCRAPER] Browser close failed:", closeErr.message);
      }
    }
    // Seamless fallback to native HTTP scraper
    return await scrapeWithFetch(url);
  }
}

export async function scrapeWithFetch(url) {
  const startTime = Date.now();
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
      redirect: "follow",
    });

    const loadTime = Date.now() - startTime;
    const statusCode = res.status;
    const html = await res.text();
    const pageSize = html.length;

    const getMeta = (name) => {
      const escaped = name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const r1 = new RegExp(
        `<meta[^>]+(?:name|property)=["']${escaped}["'][^>]+content=["']([^"']*)["']`,
        "i"
      );
      const r2 = new RegExp(
        `<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${escaped}["']`,
        "i"
      );
      const m = html.match(r1) || html.match(r2);
      return m ? m[1].trim() : "";
    };

    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";
    const description = getMeta("description");

    const canonicalMatch = html.match(
      /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i
    );
    const canonical = canonicalMatch ? canonicalMatch[1].trim() : "";

    const robots = getMeta("robots");
    const ogTitle = getMeta("og:title");
    const ogDescription = getMeta("og:description");
    const ogImage = getMeta("og:image");
    const twitterCard = getMeta("twitter:card");
    const viewport = getMeta("viewport");

    const charsetMatch =
      html.match(/<meta[^>]+charset=["']?([^"'\s>]+)/i) ||
      html.match(/charset=([^"'\s>]+)/i);
    const charset = charsetMatch ? charsetMatch[1] : "";

    // Headings
    const getHeadingCount = (tag) => {
      const matches = html.match(new RegExp(`<${tag}[^>]*>`, "gi"));
      return matches ? matches.length : 0;
    };

    const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
    const h1Texts = [];
    let h1Match;
    while ((h1Match = h1Regex.exec(html)) !== null) {
      const cleanH1 = h1Match[1].replace(/<[^>]+>/g, "").trim();
      if (cleanH1) h1Texts.push(cleanH1);
    }

    const headings = {
      h1: getHeadingCount("h1"),
      h2: getHeadingCount("h2"),
      h3: getHeadingCount("h3"),
      h4: getHeadingCount("h4"),
      h5: getHeadingCount("h5"),
      h6: getHeadingCount("h6"),
      h1Texts,
    };

    // Links
    const currentHost = new URL(url).hostname;
    let internalLinks = 0;
    let externalLinks = 0;
    const linkRegex = /<a[^>]+href=["']([^"']*)["']/gi;
    let linkMatch;
    let totalLinks = 0;
    while ((linkMatch = linkRegex.exec(html)) !== null) {
      totalLinks++;
      const href = linkMatch[1].trim();
      if (
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#")
      )
        continue;
      try {
        const fullUrl = new URL(href, url);
        if (fullUrl.hostname === currentHost) internalLinks++;
        else externalLinks++;
      } catch {}
    }

    // Images
    const imgRegex = /<img[^>]+>/gi;
    const imgMatches = html.match(imgRegex) || [];
    let missingAlt = 0;
    imgMatches.forEach((img) => {
      const altMatch = img.match(/alt=["']([^"']*)["']/i);
      if (!altMatch || !altMatch[1].trim()) missingAlt++;
    });

    // Body text extraction
    let cleanText = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ")
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, " ")
      .trim();

    const wordCount = cleanText
      .split(/\s+/)
      .filter((w) => w.length > 0).length;

    const bodyText = cleanText.substring(0, 3000);

    return {
      success: true,
      data: {
        metaData: {
          title,
          description,
          canonical,
          robots,
          ogTitle,
          ogDescription,
          ogImage,
          twitterCard,
          viewport,
          charset,
        },
        headings,
        links: {
          internal: internalLinks,
          external: externalLinks,
          total: totalLinks,
        },
        images: {
          total: imgMatches.length,
          missingAlt,
          withAlt: imgMatches.length - missingAlt,
        },
        wordCount,
        pageSize,
        bodyText,
        loadTime,
        statusCode,
        url,
      },
    };
  } catch (err) {
    console.error("[SCRAPER] HTTP fetch fallback failed:", err.message);
    return { success: false, error: err.message };
  }
}
