import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  HelpCircle,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  CreditCard,
  X,
} from "lucide-react";
import Footer from "../components/home/Footer";
import { useApp } from "../context/AppContext";

export default function PricingPage() {
  const { user } = useApp();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [modalPlan, setModalPlan] = useState<string | null>(null);

  const plans = [
    {
      name: "Starter",
      badge: "Free Forever",
      price: { monthly: 0, yearly: 0 },
      desc: "Perfect for personal blogs, indie hackers, and small sites starting out with SEO.",
      features: [
        "5 AI Website Audits per day",
        "3 Tracked Keywords on Google SERP",
        "Meta Tags & Canonical Verification",
        "Heading Structure (H1–H6) Checker",
        "Internal & External Link Discovery",
        "Image Alt Text Coverage Scanner",
        "Keyword Frequency & Density Map",
        "Standard Community Support",
      ],
      cta: user ? "Current Active Plan" : "Get Started Free",
      ctaLink: user ? "/dashboard" : "/register",
      popular: false,
    },
    {
      name: "Pro",
      badge: "Most Popular",
      price: { monthly: 19, yearly: 15 },
      desc: "For growing businesses, creators, and marketers who need serious Google search visibility.",
      features: [
        "Unlimited AI Website Audits",
        "50 Tracked Keywords on Google SERP",
        "Real-Time Position Change & Gain Tracker",
        "Competitor SERP Analysis & Snippet Extraction",
        "Daily Automated Cron Checks (24/7 monitoring)",
        "Google Gemini 2.5 Flash Deep Recommendations",
        "High-DPI Interactive Historical Rank Canvas Charts",
        "Export Audit Reports (PDF & CSV)",
        "Priority Email Support (under 12h response)",
      ],
      cta: "Upgrade to Pro",
      ctaAction: () => setModalPlan("Pro"),
      popular: true,
    },
    {
      name: "Agency",
      badge: "Scale & Teams",
      price: { monthly: 49, yearly: 39 },
      desc: "Comprehensive SEO intelligence suite for agencies managing multiple client domains.",
      features: [
        "Everything in Pro Plan",
        "500 Tracked Keywords across Unlimited Domains",
        "High-Frequency Hourly SERP Scans",
        "Dedicated REST API Access (10k requests/mo)",
        "Custom White-Label SEO Reports with Your Logo",
        "Bulk Domain Analysis & Multi-URL Queue",
        "Team Collaboration & Multi-User Seats",
        "24/7 Dedicated Account Manager & SLA",
      ],
      cta: "Upgrade to Agency",
      ctaAction: () => setModalPlan("Agency"),
      popular: false,
    },
  ];

  const faqs = [
    {
      q: "Can I start with the Free plan and upgrade later?",
      a: "Yes, absolutely! You can start on the Free Starter plan with zero credit card required. When your tracking needs grow, you can seamlessly upgrade to Pro or Agency.",
    },
    {
      q: "How does keyword rank tracking work?",
      a: "Rank Pilot utilizes cloud browser engines and real search queries to scrape actual Google Search results. It identifies your exact position, page number, position gain/loss compared to previous checks, and top competing URLs.",
    },
    {
      q: "When will the payment gateway be live?",
      a: "We are currently completing payment compliance for Stripe and Razorpay integrations. You can explore all plan features right now, and payment checkout will be enabled in the upcoming update.",
    },
    {
      q: "What payment methods will be accepted?",
      a: "We will support all major Credit/Debit Cards (Visa, MasterCard, American Express), Apple Pay, Google Pay, UPI, and Net Banking.",
    },
    {
      q: "Can I cancel my subscription at any time?",
      a: "Yes. There are no contracts or commitments. You can cancel, downgrade, or upgrade your subscription anytime from your dashboard.",
    },
  ];

  return (
    <div className="min-h-screen pt-16 md:pt-24 bg-background text-foreground flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-4">
            <Sparkles size={14} />
            <span>Transparent & Flexible Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Invest in Better <span className="gradient-text">Search Rankings</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Choose the plan that fits your growth. Audit technical website issues with Gemini AI, monitor Google SERP rankings 24/7, and outrank competitors.
          </p>

          {/* Billing Switcher */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span
              className={`text-sm font-medium cursor-pointer ${
                billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly Billing
            </span>
            <button
              onClick={() =>
                setBillingCycle((prev) => (prev === "monthly" ? "yearly" : "monthly"))
              }
              className="w-14 h-8 rounded-full bg-muted border border-border p-1 relative transition-colors"
              aria-label="Toggle Billing Cycle"
            >
              <div
                className={`w-6 h-6 rounded-full bg-primary transition-transform ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"
                }`}
                style={{ backgroundColor: "var(--primary)" }}
              />
            </button>
            <span
              className={`text-sm font-medium cursor-pointer flex items-center gap-1.5 ${
                billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"
              }`}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly Billing
              <span className="text-[11px] font-semibold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-20">
          {plans.map((p) => {
            const price = billingCycle === "monthly" ? p.price.monthly : p.price.yearly;
            return (
              <div
                key={p.name}
                className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  p.popular
                    ? "bg-card border-2 border-primary shadow-xl shadow-primary/5"
                    : "bg-card border border-border hover:border-muted-foreground/30"
                }`}
              >
                {p.popular && (
                  <div
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground"
                    style={{ color: "var(--background)" }}
                  >
                    {p.badge}
                  </div>
                )}
                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-foreground">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{p.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-border">
                    <span className="text-4xl sm:text-5xl font-extrabold text-foreground">
                      ${price}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      /{billingCycle === "monthly" ? "mo" : "mo, billed yearly"}
                    </span>
                  </div>

                  {/* Feature list */}
                  <div className="space-y-3 mb-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      What's included:
                    </p>
                    <ul className="space-y-2.5">
                      {p.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                          <CheckCircle size={16} className="text-primary shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action button */}
                {p.ctaLink ? (
                  <Link
                    to={p.ctaLink}
                    className={`block w-full py-3 rounded-xl text-center text-sm font-semibold transition-all ${
                      p.popular
                        ? "bg-primary text-primary-foreground hover:opacity-90 shadow-md"
                        : "bg-muted/70 hover:bg-muted text-foreground border border-border"
                    }`}
                    style={p.popular ? { color: "var(--background)" } : {}}
                  >
                    {p.cta}
                  </Link>
                ) : (
                  <button
                    onClick={p.ctaAction}
                    className={`block w-full py-3 rounded-xl text-center text-sm font-semibold transition-all cursor-pointer ${
                      p.popular
                        ? "bg-primary text-primary-foreground hover:opacity-90 shadow-md"
                        : "bg-muted/70 hover:bg-muted text-foreground border border-border"
                    }`}
                    style={p.popular ? { color: "var(--background)" } : {}}
                  >
                    {p.cta}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Section */}
        <div className="max-w-4xl mx-auto mb-20 bg-card border border-border rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">
            Plan Feature Comparison
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Compare features side-by-side to find the right tier for your site.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-3 px-4 font-semibold">Features</th>
                  <th className="py-3 px-4 font-semibold text-center">Starter</th>
                  <th className="py-3 px-4 font-semibold text-center text-primary">Pro</th>
                  <th className="py-3 px-4 font-semibold text-center">Agency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="py-3.5 px-4 font-medium">Daily AI Audits</td>
                  <td className="py-3.5 px-4 text-center text-muted-foreground">5 / day</td>
                  <td className="py-3.5 px-4 text-center font-bold text-primary">Unlimited</td>
                  <td className="py-3.5 px-4 text-center font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Tracked Keywords</td>
                  <td className="py-3.5 px-4 text-center text-muted-foreground">3</td>
                  <td className="py-3.5 px-4 text-center font-bold text-primary">50</td>
                  <td className="py-3.5 px-4 text-center font-bold">500</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">SERP Competitor Discovery</td>
                  <td className="py-3.5 px-4 text-center text-muted-foreground">—</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓ Included</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓ Included</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">Daily Cron Background Checks</td>
                  <td className="py-3.5 px-4 text-center text-muted-foreground">—</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓ Included</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓ Hourly</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">AI Recommendation Engine</td>
                  <td className="py-3.5 px-4 text-center text-muted-foreground">Standard</td>
                  <td className="py-3.5 px-4 text-center font-bold text-primary">Gemini 2.5 Flash</td>
                  <td className="py-3.5 px-4 text-center font-bold">Gemini 2.5 Flash</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium">API Access & Webhooks</td>
                  <td className="py-3.5 px-4 text-center text-muted-foreground">—</td>
                  <td className="py-3.5 px-4 text-center text-muted-foreground">—</td>
                  <td className="py-3.5 px-4 text-center text-emerald-400">✓ 10,000 req/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm">
              Have a question about our plans or billing? Find answers here.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-2">
                  <HelpCircle size={18} className="text-primary shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed pl-6.5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 via-accent/10 to-transparent border border-primary/20 rounded-2xl p-8 sm:p-12 text-center mb-16 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Ready to boost your organic traffic?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto mb-6">
              Run your first deep SEO audit in under 60 seconds. Start completely free today.
            </p>
            <Link
              to={user ? "/analyze" : "/register"}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ color: "var(--background)" }}
            >
              <Zap size={16} />
              {user ? "Analyze a Website Now" : "Create Free Account"}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Payment Gateway Preview Modal */}
      {modalPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
            <button
              onClick={() => setModalPlan(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
            >
              <X size={20} />
            </button>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <CreditCard size={24} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1">
              Upgrade to {modalPlan} Plan
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Payment Gateway Integration (Stripe / Razorpay)
            </p>

            <div className="bg-muted/40 border border-border rounded-xl p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Selected Plan:</span>
                <span className="font-semibold text-foreground">{modalPlan} Tier</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Billing:</span>
                <span className="font-semibold text-foreground capitalize">
                  {billingCycle} (Billed annually)
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-border">
                <span className="text-foreground font-semibold">Total:</span>
                <span className="font-bold text-primary text-base">
                  ${modalPlan === "Pro" ? (billingCycle === "monthly" ? 19 : 180) : (billingCycle === "monthly" ? 49 : 468)}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs leading-relaxed mb-6 flex items-start gap-2.5">
              <Shield size={18} className="shrink-0 mt-0.5" />
              <span>
                <strong>Checkout is in sandbox mode.</strong> Secure payment gateway credentials (Stripe / Razorpay) will be configured in the next release to automatically activate this plan.
              </span>
            </div>

            <button
              onClick={() => {
                alert(`Thank you for choosing ${modalPlan} Plan! Payment gateway integration will be active shortly.`);
                setModalPlan(null);
              }}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
              style={{ color: "var(--background)" }}
            >
              Proceed to Activation
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
