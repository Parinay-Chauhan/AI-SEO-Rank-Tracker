import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";
import Footer from "../components/home/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen pt-16 md:pt-24 bg-background text-foreground flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-3">
          <FileText size={14} />
          <span>User Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Rank Pilot, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Permitted Use</h2>
            <p>
              Rank Pilot provides SEO analysis, website auditing, and search engine ranking monitoring. You agree not to abuse the scraping engine, perform denial of service attacks, or attempt unauthorized access to infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Subscription & Billing</h2>
            <p>
              Free accounts provide standard audit and keyword limits. Paid tiers (Pro, Agency) unlock higher quotas, continuous cron intervals, and priority AI processing. Subscriptions will be managed through secure payment processors upon integration.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Disclaimers & Accuracy</h2>
            <p>
              Search engine ranking algorithms fluctuate continuously. While Rank Pilot captures actual live SERP results, rankings can differ across geolocations, personalization filters, and search query variants. We do not guarantee specific Google position outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate our security guidelines or engage in automated abusive crawling against third-party sites.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
