import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import Pricing from "../components/home/Pricing";
import Footer from "../components/home/Footer";
import SEO from "../components/SEO";

export default function Home() {
    return (
        <div className="min-h-screen">
            <SEO
                title="AI SEO Analyzer & Google SERP Rank Tracker"
                description="Boost search rankings with Rank Pilot. Instant AI-powered website audits, Google Gemini 2.5 technical recommendations, real-time SERP position tracking, and competitor analysis."
                canonical="https://ai-seo-rank-tracker-seven.vercel.app/"
                keywords="AI SEO analyzer, SERP rank tracker, Google keyword ranking, SEO audit tool, Gemini AI SEO, website health score"
            />
            <Hero />
            <Features />
            <HowItWorks />
            <Pricing />
            <Footer />
        </div>
    );
}
