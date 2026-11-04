import { Link } from "react-router-dom";
import {
  Sparkles,
  Search,
  Target,
  BarChart3,
  Cpu,
  Layers,
  ArrowRight,
  Globe,
  Clock,
  FileCode,
  Users,
  CheckCircle2,
  Lock,
} from "lucide-react";
import Footer from "../components/home/Footer";
import { useApp } from "../context/AppContext";

export default function FeaturesPage() {
  const { user } = useApp();

  const coreFeatures = [
    {
      icon: <Sparkles size={28} className="text-primary" />,
      badge: "AI Intelligence",
      title: "Google Gemini 2.5 Flash Audits",
      desc: "Instant structured technical evaluation powered by Google's latest multimodal models. Analyzes page signals to generate categorized health scores (SEO, Performance, Accessibility, Best Practices) and prioritize critical fixes with step-by-step developer recommendations.",
      bullets: [
        "Score gauge from 0 to 100",
        "Categorized recommendations (Critical, Warning, Info)",
        "Structured JSON schema analysis",
      ],
    },
    {
      icon: <Target size={28} className="text-accent" />,
      badge: "Rank Intelligence",
      title: "Automated Google SERP Tracker",
      desc: "Monitor your exact search position on Google for your top target keywords. Track position changes (+2, -1, stable), which SERP page your site appears on, and your best-recorded ranking of all time.",
      bullets: [
        "Real-time Google search position tracking",
        "Daily change indicators and historical trendlines",
        "High-DPI custom canvas ranking charts",
      ],
    },
    {
      icon: <Cpu size={28} className="text-secondary" />,
      badge: "Hybrid Scraper",
      title: "Browserbase + Playwright CDP Engine",
      desc: "Full browser rendering via Playwright connected to Browserbase cloud sessions with ad-blocking and DOM hydration. Built with an automatic high-speed HTTP fetch fallback that guarantees 100% audit uptime even if cloud browser quotas are reached.",
      bullets: [
        "Cloud browser headless session execution",
        "Seamless native HTTP fallback engine",
        "Extracts rendered JavaScript DOM & metadata",
      ],
    },
    {
      icon: <Users size={28} className="text-warning" />,
      badge: "Competitive Edge",
      title: "SERP Competitor Discovery",
      desc: "Instantly see which domains outrank you for your target keywords on Google. Rank Pilot captures competitor page titles, domains, positions, and live search snippets so you can dissect what top pages do differently.",
      bullets: [
        "Top 10 competing URLs per keyword",
        "Snippet text extraction from Google results",
        "Direct competitor URLs and domain comparisons",
      ],
    },
    {
      icon: <FileCode size={28} className="text-primary" />,
      badge: "Technical SEO",
      title: "On-Page Metadata & Hierarchy Audit",
      desc: "Deep technical inspection of crucial search ranking elements. Identifies missing OpenGraph tags, Twitter cards, viewport configuration, canonical links, and validates strict H1–H6 heading structures.",
      bullets: [
        "Meta title & description character length check",
        "H1 heading uniqueness and hierarchy tree",
        "OpenGraph image & social sharing card validation",
      ],
    },
    {
      icon: <BarChart3 size={28} className="text-emerald-400" />,
      badge: "Content Analysis",
      title: "Keyword Density & Content Metrics",
      desc: "Scans body copy to extract top repeating keywords, occurrence frequency, and density percentages with clean formatting. Prevents search engine penalties for keyword stuffing and spots missing topical keywords.",
      bullets: [
        "Top 10 keywords frequency and density map",
        "Total word count and rendered page weight (KB)",
        "Internal vs external link ratio calculation",
      ],
    },
    {
      icon: <Clock size={28} className="text-accent" />,
      badge: "Automation",
      title: "Continuous 24/7 Cron Jobs",
      desc: "Built-in automated background rank checking powered by node-cron. Your keywords are periodically refreshed in the background, updating positions without requiring you to manually trigger scans.",
      bullets: [
        "Automated recurring SERP position checks",
        "Historical position storage per scan",
        "Zero manual effort required to keep data fresh",
      ],
    },
    {
      icon: <Lock size={28} className="text-cyan-400" />,
      badge: "Security",
      title: "Dual JWT Auth & Silent Refresh",
      desc: "Enterprise session security with short-lived 3-hour Access Tokens and secure 15-day Refresh Tokens. Features an intelligent client Axios response interceptor for silent background token rotation with zero session disruption.",
      bullets: [
        "3-Hour access token + 15-day refresh token",
        "Silent background token rotation without logout",
        "HttpOnly, SameSite=None, Secure cross-site cookies",
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-16 md:pt-24 bg-background text-foreground flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-4">
            <Layers size={14} />
            <span>Platform Capabilities</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Engineered for Serious <span className="gradient-text">SEO Performance</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            From technical page scraping and Gemini AI insights to automated SERP tracking and competitor discovery — explore everything Rank Pilot has to offer.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Link
              to={user ? "/analyze" : "/register"}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ color: "var(--background)" }}
            >
              <Search size={16} />
              {user ? "Audit a Website Now" : "Get Started Free"}
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/pricing"
              className="px-5 py-3 rounded-xl bg-card border border-border hover:bg-muted/50 text-foreground font-semibold text-sm transition-colors"
            >
              View Pricing Plans
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-20 max-w-6xl mx-auto">
          {coreFeatures.map((feat) => (
            <div
              key={feat.title}
              className="bg-card border border-border rounded-2xl p-6 sm:p-8 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-muted/60 border border-border group-hover:scale-105 transition-transform">
                    {feat.icon}
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  {feat.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60">
                <ul className="space-y-2">
                  {feat.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 size={14} className="text-primary shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Showcase */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 max-w-5xl mx-auto mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              How Rank Pilot Works Under the Hood
            </h2>
            <p className="text-sm text-muted-foreground">
              A 3-step pipeline taking you from raw URL to actionable SEO optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-muted/30 border border-border rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mx-auto mb-3">
                1
              </div>
              <h4 className="text-base font-semibold text-foreground mb-1">Crawl & Scrape</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connects via Playwright CDP over Browserbase or high-speed direct fetch to extract DOM nodes, meta tags, and latency.
              </p>
            </div>
            <div className="bg-muted/30 border border-border rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center mx-auto mb-3">
                2
              </div>
              <h4 className="text-base font-semibold text-foreground mb-1">Gemini AI Audit</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Feeds structured payload to Google Gemini 2.5 Flash to compute category scores and identify prioritized technical issues.
              </p>
            </div>
            <div className="bg-muted/30 border border-border rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center mx-auto mb-3">
                3
              </div>
              <h4 className="text-base font-semibold text-foreground mb-1">Track & Outrank</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Save keywords to the tracker. Background crons run automated checks against Google SERP and plot growth curves.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Ready to experience Rank Pilot?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Test any website URL right now. Zero setup required.
          </p>
          <Link
            to={user ? "/analyze" : "/register"}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ color: "var(--background)" }}
          >
            <Globe size={16} />
            {user ? "Go to Analyze" : "Start Free Audit"}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
