"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Gauge,
  Layers,
  Moon,
  Search,
  Smartphone,
  Zap,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MockCharts } from "@/components/landing/MockCharts";
import { GoogleAttribution } from "@/components/GoogleAttribution";
import { normalizeUrl } from "@/lib/formatters";

const FEATURES = [
  {
    icon: Layers,
    title: "Side-by-Side Compare",
    description:
      "Analyze two URLs in aligned columns with synchronized report sections.",
  },
  {
    icon: Smartphone,
    title: "Mobile & Desktop",
    description:
      "Full Lighthouse runs for both strategies with all four categories.",
  },
  {
    icon: BarChart3,
    title: "Complete Reports",
    description:
      "CrUX field data, every audit, stack packs, entities, and raw JSON.",
  },
  {
    icon: Moon,
    title: "Dark Mode & PDF",
    description:
      "Professional UI with dark theme support and one-click PDF export.",
  },
];

export function LandingPage() {
  const router = useRouter();
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const a = normalizeUrl(urlA);
    const b = normalizeUrl(urlB);
    if (!a || !b) return;

    router.push(
      `/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -start-24 -top-24 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
            <div className="absolute -bottom-24 -end-24 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm text-teal-700 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300">
                <Zap className="h-4 w-4" />
                Powered by Google Lighthouse
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
                Compare Website Performance{" "}
                <span className="text-teal-600 dark:text-teal-400">
                  Side by Side
                </span>
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                Run Google PageSpeed Insights on two URLs and get a full
                Lighthouse comparison report — mobile, desktop, and every audit
                in one place.
              </p>
            </div>

            {/* URL form */}
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="landing-url-a"
                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Site A — First URL
                  </label>
                  <input
                    id="landing-url-a"
                    type="url"
                    value={urlA}
                    onChange={(e) => setUrlA(e.target.value)}
                    placeholder="https://example.com"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="landing-url-b"
                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Site B — Second URL
                  </label>
                  <input
                    id="landing-url-b"
                    type="url"
                    value={urlB}
                    onChange={(e) => setUrlB(e.target.value)}
                    placeholder="https://another-site.com"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!normalizeUrl(urlA) || !normalizeUrl(urlB)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-50 dark:bg-teal-500 dark:text-teal-950 dark:hover:bg-teal-400"
              >
                <Search className="h-4 w-4" />
                Compare Both Sites
              </button>
            </form>

            <div className="mx-auto mt-6 max-w-3xl">
              <GoogleAttribution compact />
            </div>
          </div>
        </section>

        {/* Mock charts preview */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              Rich Performance Insights
            </h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Preview of the metrics and comparisons you&apos;ll receive
            </p>
          </div>
          <MockCharts />
        </section>

        {/* Features */}
        <section className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                Everything You Need
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Decorative shapes */}
        <section className="relative overflow-hidden py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="relative rounded-3xl border border-slate-200 bg-gradient-to-br from-teal-50 to-slate-50 p-10 text-center dark:border-slate-800 dark:from-teal-950/30 dark:to-slate-900">
              <Gauge className="mx-auto h-12 w-12 text-teal-600 dark:text-teal-400" />
              <h2 className="mt-4 text-2xl font-semibold text-slate-800 dark:text-slate-100">
                Ready to compare?
              </h2>
              <p className="mx-auto mt-2 max-w-md text-slate-500 dark:text-slate-400">
                Enter two URLs above and get a comprehensive Lighthouse report
                powered by Google&apos;s PageSpeed Insights API.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
