"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Network, Search, Shield, Zap } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UrlCompareInputs } from "@/components/UrlCompareInputs";
import { normalizeUrl } from "@/lib/formatters";

const FEATURES = [
  {
    icon: Network,
    title: "Request & Response Headers",
    description: "Full header tables like Chrome DevTools Network tab.",
  },
  {
    icon: Shield,
    title: "Browser-Like Requests",
    description: "Chrome User-Agent, Accept-Language, Sec-Fetch-* and more.",
  },
  {
    icon: Zap,
    title: "Side-by-Side Diff",
    description: "Hover to highlight matching headers across both sites.",
  },
];

export function HeaderLandingPage() {
  const router = useRouter();
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const a = normalizeUrl(urlA);
    const b = normalizeUrl(urlB);
    if (!a || !b) return;
    router.push(
      `/headers/compare?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -start-24 -top-24 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl" />
            <div className="absolute -bottom-24 -end-24 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300">
                <Network className="h-4 w-4" />
                Independent HTTP Header Tool
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
                Compare HTTP{" "}
                <span className="text-violet-600 dark:text-violet-400">
                  Headers
                </span>
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                Inspect request and response headers for two URLs — redirects,
                status codes, and DevTools-style tables side by side.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-10 max-w-4xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <UrlCompareInputs
                idPrefix="headers"
                urlA={urlA}
                urlB={urlB}
                onUrlAChange={setUrlA}
                onUrlBChange={setUrlB}
              />
              <button
                type="submit"
                disabled={!normalizeUrl(urlA) || !normalizeUrl(urlB)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50 dark:bg-violet-500 dark:text-violet-950 dark:hover:bg-violet-400"
              >
                <Search className="h-4 w-4" />
                Compare Headers
              </button>
              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                Server-side GET with browser-like headers — User-Agent, Accept-Language,
                Cache-Control, Sec-Fetch-*.
              </p>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
