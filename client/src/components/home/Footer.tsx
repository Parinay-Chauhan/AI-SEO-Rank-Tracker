import { useState } from "react";
import { Link } from "react-router-dom";
import { ChartNoAxesColumnIcon, Puzzle, Sparkles, X, Check, ArrowUpRight } from "lucide-react";
import { homefooterLinks, type FooterSection, type FooterLink } from "../../assets/assets";
import { SiX, SiInstagram, SiFacebook, SiTwitch } from "@icons-pack/react-simple-icons";
import toast from "react-hot-toast";

export default function Footer() {
    const [extensionModalOpen, setExtensionModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleExtensionWaitlist = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !email.includes("@")) {
            toast.error("Please enter a valid email address.");
            return;
        }
        setSubscribed(true);
        toast.success("You're on the waitlist! We'll notify you on launch.");
        setTimeout(() => {
            setEmail("");
            setExtensionModalOpen(false);
            setSubscribed(false);
        }, 2200);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="border-t border-border py-12 bg-card text-foreground relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-12 mb-12">
                    {/* Brand column */}
                    <div className="col-span-2">
                        <Link to="/" onClick={scrollToTop} className="inline-flex items-center gap-2 mb-4 group">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                <ChartNoAxesColumnIcon size={18} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-foreground">Rank Pilot</span>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-6 w-full max-w-sm leading-relaxed">
                            Optimize your website for search engines with AI-powered page audits, Gemini 2.5 recommendations, and real-time Google SERP rank tracking.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="X (Twitter)"
                                className="w-9 h-9 rounded-lg bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                            >
                                <SiX size={16} />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="w-9 h-9 rounded-lg bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                            >
                                <SiInstagram size={16} />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                                className="w-9 h-9 rounded-lg bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                            >
                                <SiFacebook size={16} />
                            </a>
                            <a
                                href="https://twitch.tv"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Twitch"
                                className="w-9 h-9 rounded-lg bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                            >
                                <SiTwitch size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    {homefooterLinks.map((section: FooterSection) => (
                        <div key={section.title} className="col-span-1">
                            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase mb-4">
                                {section.title}
                            </h3>
                            <ul className="space-y-2.5">
                                {section.links.map((link: FooterLink) => {
                                    if (link.action === "extension-modal") {
                                        return (
                                            <li key={link.name}>
                                                <button
                                                    onClick={() => setExtensionModalOpen(true)}
                                                    className="text-sm text-muted-foreground hover:text-primary transition-colors text-left flex items-center gap-1.5 group cursor-pointer"
                                                >
                                                    <span>{link.name}</span>
                                                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                                        Soon
                                                    </span>
                                                </button>
                                            </li>
                                        );
                                    }

                                    if (link.path) {
                                        return (
                                            <li key={link.name}>
                                                <Link
                                                    to={link.path}
                                                    onClick={scrollToTop}
                                                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
                                                >
                                                    {link.name}
                                                </Link>
                                            </li>
                                        );
                                    }

                                    return (
                                        <li key={link.name}>
                                            <a
                                                href={link.href || "#"}
                                                target={link.href?.startsWith("http") ? "_blank" : undefined}
                                                rel={link.href?.startsWith("http") ? "noreferrer" : undefined}
                                                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                                            >
                                                <span>{link.name}</span>
                                                {link.href?.startsWith("http") && <ArrowUpRight size={12} className="opacity-70" />}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Rank Pilot. All rights reserved. Built with AI-first precision.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link
                            to="/api-docs"
                            onClick={scrollToTop}
                            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>All Systems Operational (v1.0.0)</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Browser Extension Modal */}
            {extensionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
                        <button
                            onClick={() => setExtensionModalOpen(false)}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
                        >
                            <X size={20} />
                        </button>

                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-4">
                            <Puzzle size={24} />
                        </div>

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold mb-3">
                            <Sparkles size={12} />
                            <span>Chrome Web Store Extension</span>
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-2">
                            Rank Pilot Browser Companion
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                            Analyze any live webpage, extract headings, inspect canonical tags, and check your Google keyword rankings in 1 click without leaving the page.
                        </p>

                        {subscribed ? (
                            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2.5">
                                <Check size={18} />
                                <span>You are on the priority early-access list!</span>
                            </div>
                        ) : (
                            <form onSubmit={handleExtensionWaitlist} className="space-y-3">
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Enter your email for early access..."
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
                                    style={{ color: "var(--background)" }}
                                >
                                    Join Extension Waitlist
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </footer>
    );
}
