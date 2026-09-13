export type Strategy = "mobile" | "desktop";

export type LighthouseCategory =
  | "performance"
  | "accessibility"
  | "best-practices"
  | "seo";

export interface Distribution {
  min?: number;
  max?: number;
  proportion: number;
}

export interface CruxMetric {
  percentile?: number;
  category?: string;
  distributions?: Distribution[];
  [key: string]: unknown;
}

export interface LoadingExperience {
  id?: string;
  initial_url?: string;
  overall_category?: string;
  origin_fallback?: boolean;
  metrics?: Record<string, CruxMetric>;
  [key: string]: unknown;
}

export interface AuditRef {
  id: string;
  weight?: number;
  group?: string;
  acronym?: string;
}

export interface CategoryGroup {
  title: string;
  description?: string;
}

export interface AuditHeading {
  key?: string;
  valueType?: string;
  label?: string;
  subItemsHeading?: AuditHeading;
  subItems?: AuditHeading[];
}

export interface AuditDetails {
  type?: string;
  headings?: AuditHeading[];
  items?: Record<string, unknown>[];
  overallSavingsMs?: number;
  overallSavingsBytes?: number;
  sortedBy?: string[];
  debugData?: Record<string, unknown>;
  chains?: Record<string, unknown>;
  longestChain?: Record<string, unknown>;
  summary?: Record<string, unknown>;
  nodes?: Record<string, unknown>;
  screenshot?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Audit {
  id: string;
  title: string;
  description?: string;
  score?: number | null;
  scoreDisplayMode?: string;
  displayValue?: string;
  numericValue?: number;
  numericUnit?: string;
  metricSavings?: Record<string, number>;
  warnings?: string[];
  explanation?: string;
  details?: AuditDetails;
  [key: string]: unknown;
}

export interface LighthouseCategoryResult {
  id: string;
  title: string;
  score?: number | null;
  auditRefs?: AuditRef[];
}

export interface StackPack {
  id: string;
  title: string;
  iconDataURL?: string;
  descriptions?: Record<string, string>;
}

export interface Entity {
  name: string;
  homepage?: string;
  category?: string;
  origins?: string[];
  isFirstParty?: boolean;
  isUnrecognized?: boolean;
  [key: string]: unknown;
}

export interface LighthouseResult {
  requestedUrl?: string;
  finalUrl?: string;
  mainDocumentUrl?: string;
  finalDisplayedUrl?: string;
  lighthouseVersion?: string;
  userAgent?: string;
  fetchTime?: string;
  environment?: Record<string, unknown>;
  runWarnings?: string[];
  configSettings?: Record<string, unknown>;
  audits: Record<string, Audit>;
  categories: Record<string, LighthouseCategoryResult>;
  categoryGroups?: Record<string, CategoryGroup>;
  timing?: Record<string, number>;
  stackPacks?: StackPack[];
  entities?: Entity[];
  fullPageScreenshot?: {
    screenshot?: {
      data?: string;
      width?: number;
      height?: number;
    };
    nodes?: Record<string, Record<string, number>>;
  };
  i18n?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface PageSpeedResult {
  captchaResult?: string;
  kind?: string;
  id?: string;
  analysisUTCTimestamp?: string;
  loadingExperience?: LoadingExperience;
  originLoadingExperience?: LoadingExperience;
  lighthouseResult: LighthouseResult;
  [key: string]: unknown;
}

export interface ScanRequest {
  url: string;
  strategy: Strategy;
  label: string;
}

export type ScanStatus = "idle" | "loading" | "done" | "error";

export interface ScanState {
  key: string;
  url: string;
  strategy: Strategy;
  label: string;
  status: ScanStatus;
  data?: PageSpeedResult;
  error?: string;
}

export interface CompareState {
  siteA: string;
  siteB: string;
  scans: ScanState[];
}

export const LIGHTHOUSE_CATEGORIES: LighthouseCategory[] = [
  "performance",
  "accessibility",
  "best-practices",
  "seo",
];

export function scanKey(url: string, strategy: Strategy): string {
  return `${url}::${strategy}`;
}
