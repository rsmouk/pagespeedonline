import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy — Lighthouse Compare",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="text-sm text-teal-600 hover:underline dark:text-teal-400"
        >
          ← Back to home
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-slate-50">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Last updated: {new Date().toISOString().slice(0, 10)}
        </p>

        <div className="prose prose-slate mt-8 max-w-none space-y-6 text-sm leading-relaxed text-slate-600 dark:prose-invert dark:text-slate-300">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Overview
            </h2>
            <p>
              Lighthouse Compare (&quot;we&quot;, &quot;the service&quot;) helps you
              analyze and compare websites using Google PageSpeed Insights and
              server-side HTTP header inspection. This policy explains what data
              we process when you use the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Information We Process
            </h2>
            <ul className="list-disc space-y-2 ps-5">
              <li>
                <strong>URLs you submit</strong> — sent to our servers to run
                Lighthouse scans or header checks. We do not permanently store
                your comparison history unless required for technical logs.
              </li>
              <li>
                <strong>Technical logs</strong> — hosting providers (e.g. Vercel)
                may record IP addresses, timestamps, and request metadata for
                security and performance.
              </li>
              <li>
                <strong>Third-party APIs</strong> — Lighthouse requests are
                forwarded to Google PageSpeed Insights using our API key. Google&apos;s
                privacy policy applies to that processing.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Cookies & Local Storage
            </h2>
            <p>
              We use browser local storage for theme preference (light/dark mode)
              only. We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Contact
            </h2>
            <p>
              For privacy questions, contact{" "}
              <a
                href="https://hesdev.com/contact"
                className="text-teal-600 hover:underline dark:text-teal-400"
              >
                hesdev
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
