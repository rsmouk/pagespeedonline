import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Terms of Service",
  description:
    "Terms of service for using Lighthouse Compare and related website analysis tools.",
  path: "/terms",
});

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Last updated: {new Date().toISOString().slice(0, 10)}
        </p>

        <div className="prose prose-slate mt-8 max-w-none space-y-6 text-sm leading-relaxed text-slate-600 dark:prose-invert dark:text-slate-300">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Acceptance
            </h2>
            <p>
              By using Lighthouse Compare, you agree to these terms. If you do
              not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Service Description
            </h2>
            <p>
              The service provides website performance comparison via Google
              Lighthouse / PageSpeed Insights and HTTP header inspection. Results
              are provided &quot;as is&quot; for informational purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Acceptable Use
            </h2>
            <ul className="list-disc space-y-2 ps-5">
              <li>Only submit URLs you are authorized to test.</li>
              <li>Do not abuse the service with excessive automated requests.</li>
              <li>Do not attempt to disrupt or reverse-engineer the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Disclaimer
            </h2>
            <p>
              We do not guarantee accuracy, uptime, or suitability for any
              particular purpose. Lighthouse scores and header data may vary by
              region, time, and network conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Contact
            </h2>
            <p>
              Questions about these terms:{" "}
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
