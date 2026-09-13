export const REPORT_SECTIONS = [
  { id: "overview", title: "Overview & Scores", subtitle: "Top-level metadata and category scores" },
  { id: "crux", title: "Field Data (CrUX)", subtitle: "Chrome User Experience Report — page URL" },
  { id: "origin-crux", title: "Origin Field Data", subtitle: "CrUX data for the origin" },
  { id: "meta", title: "Lighthouse Metadata", subtitle: "URLs, version, environment, config" },
  { id: "categories", title: "Category Scores & Groups", subtitle: "All categories and audit references" },
  { id: "metrics", title: "Metrics Audits", subtitle: "Core Web Vitals and performance metrics" },
  { id: "insights", title: "Insights Audits", subtitle: "Performance insights and opportunities" },
  { id: "diagnostics", title: "Diagnostics Audits", subtitle: "Additional diagnostic information" },
  { id: "all-audits", title: "All Audits (A–Z)", subtitle: "Complete audit list with full details" },
  { id: "stack-packs", title: "Stack Packs", subtitle: "Detected frameworks and recommendations" },
  { id: "entities", title: "Entities", subtitle: "First and third party origins" },
  { id: "screenshot", title: "Full Page Screenshot", subtitle: "Visual capture and DOM node bounds" },
  { id: "raw-json", title: "Raw JSON", subtitle: "Complete API response" },
] as const;

export type ReportSectionId = (typeof REPORT_SECTIONS)[number]["id"];
