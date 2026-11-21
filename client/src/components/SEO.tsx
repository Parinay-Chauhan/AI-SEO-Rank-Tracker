import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  noindex?: boolean;
  schema?: Record<string, unknown>;
}

export default function SEO({
  title,
  description,
  canonical,
  keywords,
  noindex = false,
  schema,
}: SEOProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = `${title} | Rank Pilot`;

    // 2. Update Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }

    // 3. Update Canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink && canonical) {
      canonicalLink.setAttribute("href", canonical);
    }

    // 4. Update Keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute("content", keywords);
      }
    }

    // 5. Update Robots Meta (Index / Noindex)
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement("meta");
      metaRobots.setAttribute("name", "robots");
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute(
      "content",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
    );

    // 6. Optional Per-Page JSON-LD Schema (e.g., FAQPage, Breadcrumbs)
    const existingSchemaScript = document.getElementById("page-schema");
    if (existingSchemaScript) {
      existingSchemaScript.remove();
    }
    if (schema) {
      const script = document.createElement("script");
      script.id = "page-schema";
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const cleanupScript = document.getElementById("page-schema");
      if (cleanupScript) {
        cleanupScript.remove();
      }
    };
  }, [title, description, canonical, keywords, noindex, schema]);

  return null;
}
