import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import Footer from "../components/home/Footer";

export default function PrivacyPolicy() {
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
          <Shield size={14} />
          <span>Legal & Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Overview</h2>
            <p>
              Rank Pilot respects your privacy. This Privacy Policy describes how we collect, store, and use information when you use our AI SEO analyzer, rank tracking services, and website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Account Information:</strong> Name, email address, and encrypted passwords used for authentication.</li>
              <li><strong>Analysis Telemetry:</strong> Public website URLs submitted for audits, extracted page metadata, heading tags, link structures, and performance timings.</li>
              <li><strong>Rank Tracking Keywords:</strong> Target keywords and domains configured in your dashboard for Google SERP monitoring.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. How Information is Used</h2>
            <p>
              We use collected information solely to generate structured SEO audit reports, compute Google search rankings, provide automated progress charts, and maintain account security through dual-token authentication.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Third-Party Services</h2>
            <p>
              Rank Pilot communicates with trusted enterprise cloud providers: Google Gemini AI (for structured intelligence evaluation), Browserbase (for headless browser automation), and MongoDB Atlas (for encrypted database storage).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Data Retention & Security</h2>
            <p>
              Your data is secured with industry-standard cryptographic practices (bcrypt password hashing, short-lived JWT access tokens, HttpOnly secure cookies). You may delete tracked keywords or request account removal at any time.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
