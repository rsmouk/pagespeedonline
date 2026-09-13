import type { PageSpeedResult } from "@/lib/types";

export type ScreenshotSource = "final" | "full-page";

export interface ExtractedScreenshot {
  src: string | null;
  stripped: boolean;
  width?: number;
  height?: number;
  source: ScreenshotSource | null;
}

function readImageData(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export function extractScreenshot(data: PageSpeedResult): ExtractedScreenshot {
  const finalData = readImageData(
    data.lighthouseResult.audits?.["final-screenshot"]?.details?.data
  );
  if (finalData) {
    if (finalData.startsWith("[image data stripped")) {
      return { src: null, stripped: true, source: "final" };
    }
    if (finalData.startsWith("data:image")) {
      return { src: finalData, stripped: false, source: "final" };
    }
  }

  const fps = data.lighthouseResult.fullPageScreenshot?.screenshot;
  const fullData = readImageData(fps?.data);
  if (fullData) {
    if (fullData.startsWith("[image data stripped")) {
      return {
        src: null,
        stripped: true,
        width: fps?.width,
        height: fps?.height,
        source: "full-page",
      };
    }
    if (fullData.startsWith("data:image")) {
      return {
        src: fullData,
        stripped: false,
        width: fps?.width,
        height: fps?.height,
        source: "full-page",
      };
    }
  }

  return { src: null, stripped: false, source: null };
}
