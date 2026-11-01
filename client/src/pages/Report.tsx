import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ScoreGauge from "../components/ScoreGauge";
import IssueCard from "../components/IssueCard";
import {
  ArrowLeft,
  Globe,
  Clock,
  FileText,
  Image,
  Link2,
  Heading,
  Tag,
  AlertCircle,
  ExternalLink,
  Type,
  Search,
} from "lucide-react";
import { useApp } from "../context/AppContext";

interface AnalysisData {
  _id: string;
  url: string;
  overallScore: number;
  status: string;
  createdAt: string;
  loadTime: number;
  pageSize: number;
  wordCount: number;
  categories: {
    seo: number;
    performance: number;
    accessibility: number;
    bestPractices: number;
  };
  metaData: {
    title: string;
    description: string;
    canonical: string;
    robots: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    twitterCard: string;
    viewport: string;
    charset: string;
  };
  headings: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
    h1Texts: string[];
  };
  links: {
    internal: number;
    external: number;
    total: number;
  };
  images: {
    total: number;
    missingAlt: number;
    withAlt: number;
  };
  keywords: { word: string; count: number; density: number }[];
  issues: {
    severity: string;
    category: string;
    message: string;
    recommendation: string;
  }[];
}

export default function Report() {
  const { api } = useApp();

  const { id } = useParams();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const fetchAnalysis = async () => {
    try {
      const res = await api.get(`/api/v1/analysis/${id}`);
      if (res.data.success) {
        if (res.data.analysis.status === "processing") {
          // Poll for completion
          setTimeout(fetchAnalysis, 2000);
          return;
        }
        setAnalysis(res.data.analysis);
      } else {
        setError("Failed to fetch analysis");
      }
    } catch {
      setError("Failed to fetch analysis");
    }
    setLoading(false);
  };

  const getScoreClass = (s: number) => {
    if (s >= 80) return "score-good";
    if (s >= 50) return "score-medium";
    return "score-poor";
  };

  const getScoreBgClass = (s: number) => {
    if (s >= 80) return "score-bg-good";
    if (s >= 50) return "score-bg-medium";
    return "score-bg-poor";
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "meta", label: "Meta Tags" },
    { id: "content", label: "Content" },
    { id: "issues", label: "Issues" },
  ];

  useEffect(() => {
    (async () => await fetchAnalysis())();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="size-7 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center bg-card border border-border rounded-2xl p-6 sm:p-10 max-w-md mx-4">
          <AlertCircle size={48} className="mx-auto text-danger mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">
            Report Not Found
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {error || "This analysis doesn't exist."}
          </p>
          <Link
            to="/dashboard"
            className="bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground inline-block"
            style={{ color: "var(--background)" }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (analysis.status === "failed") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center bg-card border border-border rounded-2xl p-6 sm:p-10 max-w-md mx-4">
          <AlertCircle size={48} className="mx-auto text-danger mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">
            Analysis Failed
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            The AI model might be down. Please try again later.
          </p>
          <Link
            to="/analyze"
            className="bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground inline-block"
            style={{ color: "var(--background)" }}
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  const criticalCount = analysis.issues.filter(
    (i) => i.severity === "critical"
  ).length;
  const warningCount = analysis.issues.filter(
    (i) => i.severity === "warning"
  ).length;
  const infoCount = analysis.issues.filter((i) => i.severity === "info").length;

  return (
    <div className="min-h-screen pt-16 md:pt-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Back + Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-medium text-foreground truncate">
                {new URL(analysis.url).hostname}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                <a
                  href={analysis.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-muted-foreground hover:text-primary truncate flex items-center gap-1 transition-colors max-w-full"
                >
                  <span className="truncate">{analysis.url}</span>
                  <ExternalLink size={12} className="shrink-0" />
                </a>
                <span className="text-[11px] sm:text-xs text-muted-foreground">
                  • {new Date(analysis.createdAt).toLocaleDateString()} at{" "}
                  {new Date(analysis.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Score Hero */}
        <div
          className="bg-card border border-border rounded-2xl p-4 sm:p-8 mb-6 overflow-hidden"
          style={{ animationDelay: "100ms" }}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            {/* Overall Score */}
            <div className="shrink-0">
              <ScoreGauge
                score={analysis.overallScore}
                size={160}
                strokeWidth={12}
                label="Overall Score"
              />
            </div>

            {/* Category Scores */}
            <div className="flex-1 w-full min-w-0">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
                {[
                  {
                    label: "SEO",
                    value: analysis.categories.seo,
                    icon: <Search size={18} />,
                  },
                  {
                    label: "Performance",
                    value: analysis.categories.performance,
                    icon: <Clock size={18} />,
                  },
                  {
                    label: "Accessibility",
                    value: analysis.categories.accessibility,
                    icon: <Globe size={18} />,
                  },
                  {
                    label: "Best Practices",
                    value: analysis.categories.bestPractices,
                    icon: <Tag size={18} />,
                  },
                ].map((cat) => (
                  <div
                    key={cat.label}
                    className={`rounded-xl p-3 sm:p-4 border text-center ${getScoreBgClass(
                      cat.value
                    )}`}
                  >
                    <div className="flex items-center justify-center gap-1.5 mb-1.5 text-muted-foreground/80">
                      {cat.icon}
                      <span className="text-xs font-medium">{cat.label}</span>
                    </div>
                    <p
                      className={`text-xl sm:text-2xl font-bold ${getScoreClass(
                        cat.value
                      )}`}
                    >
                      {cat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 sm:mt-4">
                <div className="bg-muted/30 border border-border rounded-xl p-2.5 sm:p-3 text-center">
                  <p className="text-base sm:text-lg font-bold text-primary">
                    {analysis.loadTime}ms
                  </p>
                  <p className="text-[10px] text-muted-foreground">Load Time</p>
                </div>
                <div className="bg-muted/30 border border-border rounded-xl p-2.5 sm:p-3 text-center">
                  <p className="text-base sm:text-lg font-bold text-secondary">
                    {Math.round(analysis.pageSize / 1024)}KB
                  </p>
                  <p className="text-[10px] text-muted-foreground">Page Size</p>
                </div>
                <div className="bg-muted/30 border border-border rounded-xl p-2.5 sm:p-3 text-center">
                  <p className="text-base sm:text-lg font-bold text-accent">
                    {analysis.wordCount.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Words</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1.5 mb-6 overflow-x-auto pb-2 scrollbar-none"
          style={{ animationDelay: "200ms" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              style={activeTab === tab.id ? { color: "var(--background)" } : {}}
            >
              {tab.label}
              {tab.id === "issues" && analysis.issues.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-danger/20 text-danger font-semibold">
                  {analysis.issues.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div key={activeTab}>
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Issues Summary */}
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 overflow-hidden">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertCircle size={20} className="text-danger shrink-0" />
                  Issues Summary
                </h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="severity-critical rounded-xl p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold">
                      {criticalCount}
                    </p>
                    <p className="text-xs mt-1">Critical</p>
                  </div>
                  <div className="severity-warning rounded-xl p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold">
                      {warningCount}
                    </p>
                    <p className="text-xs mt-1">Warnings</p>
                  </div>
                  <div className="severity-info rounded-xl p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-bold">{infoCount}</p>
                    <p className="text-xs mt-1">Info</p>
                  </div>
                </div>

                {analysis.issues.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {analysis.issues.slice(0, 3).map((issue, i) => (
                      <IssueCard key={i} issue={issue} />
                    ))}
                    {analysis.issues.length > 3 && (
                      <button
                        onClick={() => setActiveTab("issues")}
                        className="w-full text-center text-sm text-primary hover:underline py-2"
                      >
                        View all {analysis.issues.length} issues →
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Links & Images */}
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 overflow-hidden">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Link2 size={20} className="text-primary shrink-0" />
                    Links Analysis
                  </h3>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="glass rounded-xl p-3 sm:p-4 text-center">
                      <p className="text-xl sm:text-2xl font-bold text-primary">
                        {analysis.links.internal}
                      </p>
                      <p className="text-xs text-muted-foreground">Internal</p>
                    </div>
                    <div className="glass rounded-xl p-3 sm:p-4 text-center">
                      <p className="text-xl sm:text-2xl font-bold text-secondary">
                        {analysis.links.external}
                      </p>
                      <p className="text-xs text-muted-foreground">External</p>
                    </div>
                    <div className="glass rounded-xl p-3 sm:p-4 text-center">
                      <p className="text-xl sm:text-2xl font-bold text-accent">
                        {analysis.links.total}
                      </p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 overflow-hidden">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Image size={20} className="text-accent shrink-0" />
                    Images Audit
                  </h3>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="glass rounded-xl p-3 sm:p-4 text-center">
                      <p className="text-xl sm:text-2xl font-bold text-foreground">
                        {analysis.images.total}
                      </p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="glass rounded-xl p-3 sm:p-4 text-center">
                      <p className="text-xl sm:text-2xl font-bold text-success">
                        {analysis.images.withAlt}
                      </p>
                      <p className="text-xs text-muted-foreground">With Alt</p>
                    </div>
                    <div className="glass rounded-xl p-3 sm:p-4 text-center">
                      <p
                        className={`text-xl sm:text-2xl font-bold ${
                          analysis.images.missingAlt > 0
                            ? "text-danger"
                            : "text-success"
                        }`}
                      >
                        {analysis.images.missingAlt}
                      </p>
                      <p className="text-xs text-muted-foreground">Missing Alt</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Headings */}
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 overflow-hidden">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Heading size={20} className="text-secondary shrink-0" />
                  Heading Structure
                </h3>
                <div className="space-y-2">
                  {["h1", "h2", "h3", "h4", "h5", "h6"].map((tag) => {
                    const count = analysis.headings[
                      tag as keyof typeof analysis.headings
                    ] as number;
                    const maxBar = Math.max(
                      analysis.headings.h1,
                      analysis.headings.h2,
                      analysis.headings.h3,
                      analysis.headings.h4,
                      analysis.headings.h5,
                      analysis.headings.h6,
                      1
                    );
                    return (
                      <div
                        key={tag}
                        className="flex items-center gap-2 sm:gap-3 min-w-0"
                      >
                        <span className="text-xs font-mono text-muted-foreground w-6 uppercase shrink-0">
                          {tag}
                        </span>
                        <div className="flex-1 h-6 rounded-lg bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-lg gradient-bg transition-all"
                            style={{
                              width: `${(count / maxBar) * 100}%`,
                              minWidth: count > 0 ? "20px" : "0",
                            }}
                          />
                        </div>
                        <span
                          className={`text-sm font-bold w-8 text-right shrink-0 ${
                            tag === "h1" && count !== 1
                              ? "text-danger"
                              : "text-foreground"
                          }`}
                        >
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {analysis.headings.h1Texts.length > 0 && (
                  <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border overflow-hidden">
                    <p className="text-xs text-muted-foreground mb-1">H1 Text:</p>
                    {analysis.headings.h1Texts.map((text, i) => (
                      <p
                        key={i}
                        className="text-sm text-foreground break-words"
                      >
                        {text}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Keywords */}
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 overflow-hidden">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Type size={20} className="text-warning shrink-0" />
                  Top Keywords
                </h3>
                {analysis.keywords.length > 0 ? (
                  <div className="space-y-2.5">
                    {analysis.keywords.map((kw, i) => {
                      const num = Number(kw.density);
                      const percent = !isNaN(num)
                        ? num < 1
                          ? num * 100
                          : num
                        : 0;
                      const displayPercent =
                        percent < 0.05 && percent > 0
                          ? "<0.1%"
                          : `${percent.toFixed(1)}%`;
                      return (
                        <div
                          key={`${kw.word}-${i}`}
                          className="flex items-center gap-2 sm:gap-3 min-w-0"
                        >
                          <span className="text-xs text-muted-foreground w-4 shrink-0">
                            {i + 1}
                          </span>
                          <span
                            className="flex-1 text-sm font-medium text-foreground truncate"
                            title={kw.word}
                          >
                            {kw.word}
                          </span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {kw.count}×
                          </span>
                          <div className="w-12 sm:w-20 h-1.5 rounded-full bg-white/5 overflow-hidden shrink-0">
                            <div
                              className="h-full rounded-full bg-accent transition-all"
                              style={{
                                width: `${Math.min(
                                  Math.max(percent * 8, percent > 0 ? 4 : 0),
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-12 text-right font-mono shrink-0">
                            {displayPercent}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No keyword data available.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "meta" && (
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 shadow-sm overflow-hidden">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <FileText size={20} className="text-primary shrink-0" />
                Meta Tags Analysis
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Title",
                    value: analysis.metaData.title,
                    ideal: "50-60 characters",
                    len: analysis.metaData.title.length,
                  },
                  {
                    label: "Description",
                    value: analysis.metaData.description,
                    ideal: "150-160 characters",
                    len: analysis.metaData.description.length,
                  },
                  {
                    label: "Canonical URL",
                    value: analysis.metaData.canonical,
                  },
                  { label: "Robots", value: analysis.metaData.robots },
                  { label: "Viewport", value: analysis.metaData.viewport },
                  { label: "Charset", value: analysis.metaData.charset },
                  { label: "OG Title", value: analysis.metaData.ogTitle },
                  {
                    label: "OG Description",
                    value: analysis.metaData.ogDescription,
                  },
                  { label: "OG Image", value: analysis.metaData.ogImage },
                  {
                    label: "Twitter Card",
                    value: analysis.metaData.twitterCard,
                  },
                ].map((meta) => (
                  <div
                    key={meta.label}
                    className="bg-muted/50 border border-border rounded-xl p-3.5 sm:p-4 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {meta.label}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        {meta.len !== undefined && (
                          <span className="text-xs text-muted-foreground">
                            {meta.len} chars
                          </span>
                        )}
                        {meta.value ? (
                          <span className="w-2 h-2 rounded-full bg-success shrink-0" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-danger shrink-0" />
                        )}
                      </div>
                    </div>
                    {meta.value ? (
                      <p className="text-sm text-muted-foreground break-all">
                        {meta.value}
                      </p>
                    ) : (
                      <p className="text-sm text-danger/60 italic">Missing</p>
                    )}
                    {meta.ideal && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Ideal: {meta.ideal}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 overflow-hidden">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Content Stats
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 border border-border rounded-xl">
                    <span className="text-sm text-muted-foreground">
                      Word Count
                    </span>
                    <span className="font-bold text-foreground">
                      {analysis.wordCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 border border-border rounded-xl">
                    <span className="text-sm text-muted-foreground">
                      Page Size
                    </span>
                    <span className="font-bold text-foreground">
                      {Math.round(analysis.pageSize / 1024)} KB
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 border border-border rounded-xl">
                    <span className="text-sm text-muted-foreground">
                      Load Time
                    </span>
                    <span
                      className={`font-bold ${
                        analysis.loadTime < 3000
                          ? "score-good"
                          : analysis.loadTime < 5000
                          ? "score-medium"
                          : "score-poor"
                      }`}
                    >
                      {(analysis.loadTime / 1000).toFixed(2)}s
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 border border-border rounded-xl">
                    <span className="text-sm text-muted-foreground">
                      Total Links
                    </span>
                    <span className="font-bold text-foreground">
                      {analysis.links.total}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 border border-border rounded-xl">
                    <span className="text-sm text-muted-foreground">
                      Total Images
                    </span>
                    <span className="font-bold text-foreground">
                      {analysis.images.total}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 border border-border rounded-xl">
                    <span className="text-sm text-muted-foreground">
                      Total Headings
                    </span>
                    <span className="font-bold text-foreground">
                      {analysis.headings.h1 +
                        analysis.headings.h2 +
                        analysis.headings.h3 +
                        analysis.headings.h4 +
                        analysis.headings.h5 +
                        analysis.headings.h6}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 overflow-hidden">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Heading Hierarchy
                </h3>
                <div className="space-y-2">
                  {["h1", "h2", "h3", "h4", "h5", "h6"].map((tag, i) => {
                    const count = analysis.headings[
                      tag as keyof typeof analysis.headings
                    ] as number;
                    return (
                      <div
                        key={tag}
                        className="flex items-center gap-2 sm:gap-3 p-2.5 bg-muted/30 border border-border rounded-lg min-w-0"
                        style={{
                          paddingLeft: `${Math.min(i * 8 + 12, 32)}px`,
                        }}
                      >
                        <span className="text-xs font-mono font-bold text-primary uppercase shrink-0">
                          &lt;{tag}&gt;
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground flex-1 truncate">
                          {count} {count === 1 ? "tag" : "tags"}
                        </span>
                        {tag === "h1" && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                              count === 1
                                ? "score-bg-good text-success"
                                : "score-bg-poor text-danger"
                            }`}
                          >
                            {count === 1
                              ? "✓ Good"
                              : count === 0
                              ? "✗ Missing"
                              : "✗ Multiple"}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "issues" && (
            <div>
              {analysis.issues.length > 0 ? (
                <>
                  {/* Issue filters */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 flex-wrap">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Filter:
                    </span>
                    <span className="severity-critical px-2.5 py-1 rounded-full text-xs font-semibold">
                      {criticalCount} Critical
                    </span>
                    <span className="severity-warning px-2.5 py-1 rounded-full text-xs font-semibold">
                      {warningCount} Warnings
                    </span>
                    <span className="severity-info px-2.5 py-1 rounded-full text-xs font-semibold">
                      {infoCount} Info
                    </span>
                  </div>
                  <div className="space-y-3">
                    {analysis.issues.map((issue, i) => (
                      <IssueCard key={i} issue={issue} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} className="text-success" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Issues Found!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your website is following SEO best practices.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
