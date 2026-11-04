import { useState } from "react";
import { Link } from "react-router-dom";
import { Code, Copy, Check, Terminal, ArrowLeft } from "lucide-react";
import Footer from "../components/home/Footer";

export default function ApiDocs() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const endpoints = [
    {
      id: "health",
      method: "GET",
      path: "/api/v1/health",
      title: "System Health & Uptime",
      desc: "Returns server status, uptime telemetry, and timestamp for monitoring systems.",
      curl: `curl -X GET https://ai-seo-rank-tracker-n0xd.onrender.com/api/v1/health`,
      response: `{
  "statusCode": 200,
  "data": {
    "status": "active",
    "uptime": "1420s",
    "timestamp": "2026-11-04T16:00:00.000Z"
  },
  "message": "Server is running smoothly",
  "success": true
}`,
    },
    {
      id: "analyze",
      method: "POST",
      path: "/api/v1/analysis/analyze",
      title: "Trigger SEO Audit",
      desc: "Initiates real-time website scraping and Gemini 2.5 Flash technical evaluation.",
      curl: `curl -X POST https://ai-seo-rank-tracker-n0xd.onrender.com/api/v1/analysis/analyze \\
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`,
      response: `{
  "statusCode": 200,
  "data": {
    "analysisId": "6ae72bd881eb7512bf03fc3e"
  },
  "message": "Analysis started",
  "success": true
}`,
    },
    {
      id: "rank-add",
      method: "POST",
      path: "/api/v1/rank/add",
      title: "Track Keyword Ranking",
      desc: "Adds a target keyword and website URL to the continuous Google SERP tracker.",
      curl: `curl -X POST https://ai-seo-rank-tracker-n0xd.onrender.com/api/v1/rank/add \\
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{"keyword": "react js", "url": "https://react.dev"}'`,
      response: `{
  "statusCode": 201,
  "data": {
    "_id": "6ae72c1481eb7512bf03fc53",
    "keyword": "react js",
    "domain": "react.dev",
    "status": "checking"
  },
  "message": "Keyword added to tracking",
  "success": true
}`,
    },
  ];

  return (
    <div className="min-h-screen pt-16 md:pt-24 bg-background text-foreground flex flex-col justify-between">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-3">
            <Code size={14} />
            <span>Developer Reference</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Rank Pilot <span className="gradient-text">REST API</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Integrate Rank Pilot's AI SEO analysis and SERP rank tracking capabilities into your internal workflows, CI/CD pipelines, and applications.
          </p>
        </div>

        {/* Base URL info */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Live Production Base URL
            </span>
            <code className="text-sm font-mono text-primary font-bold">
              https://ai-seo-rank-tracker-n0xd.onrender.com
            </code>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-muted-foreground">All Systems Operational</span>
          </div>
        </div>

        {/* Endpoints List */}
        <div className="space-y-8 mb-16">
          {endpoints.map((ep) => (
            <div key={ep.id} className="bg-card border border-border rounded-2xl p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg uppercase ${
                    ep.method === "POST"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-primary/15 text-primary border border-primary/30"
                  }`}
                >
                  {ep.method}
                </span>
                <span className="text-sm sm:text-base font-mono font-bold text-foreground">
                  {ep.path}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">{ep.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">{ep.desc}</p>

              {/* cURL Block */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1 px-1">
                  <span className="flex items-center gap-1">
                    <Terminal size={12} /> Example Request
                  </span>
                  <button
                    onClick={() => copyToClipboard(ep.curl, `req-${ep.id}`)}
                    className="hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    {copied === `req-${ep.id}` ? (
                      <>
                        <Check size={12} className="text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-muted/70 border border-border p-3.5 rounded-xl text-xs font-mono text-foreground overflow-x-auto">
                  {ep.curl}
                </pre>
              </div>

              {/* Response Block */}
              <div>
                <span className="text-xs text-muted-foreground mb-1 block px-1">
                  Sample 200 OK Response
                </span>
                <pre className="bg-muted/40 border border-border p-3.5 rounded-xl text-xs font-mono text-emerald-400/90 overflow-x-auto">
                  {ep.response}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
