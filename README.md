# Lighthouse Compare

A Next.js tool to compare two websites side-by-side using the [Google PageSpeed Insights API v5](https://developers.google.com/speed/docs/insights/v5/get-started).

## Features

- Compare **two URLs** in a dual-column layout
- **Mobile** and **Desktop** Lighthouse analysis
- All categories: Performance, Accessibility, Best Practices, SEO
- Full API response coverage: CrUX field data, all audits, stack packs, entities, screenshots, raw JSON
- **Dark mode** support
- **PDF export** of the comparison report
- API key kept server-side (never exposed to the browser)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and add your PageSpeed API key:

```bash
cp .env.example .env.local
```

```env
PAGESPEED_API_KEY=your_api_key_here
```

Get a key from [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repository to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variable:
   - `PAGESPEED_API_KEY` = your Google API key
4. Deploy

### Vercel timeout note

Each PageSpeed scan can take 15–40 seconds. The API route sets `maxDuration = 60` (requires Vercel Pro for timeouts over 10s). On Hobby plan, scans may timeout for slow sites — consider upgrading or testing with faster URLs.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- next-themes
- jspdf + html2canvas (PDF export)

## Project Structure

```
app/
  api/pagespeed/route.ts   # Server-side API proxy
  page.tsx                 # Main page
components/
  sections/                # Report sections (CrUX, audits, etc.)
  audit/                   # Audit card + details renderer
lib/
  types.ts                 # PageSpeed API types
  pagespeed-client.ts      # Client fetch helper
  export-pdf.ts            # PDF generation
```

## License

MIT
