export function downloadJsonFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function jsonFilename(prefix: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `${prefix}-${date}.json`;
}
