import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function exportReportToPdf(
  elementId: string,
  filename?: string
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Report container not found");
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: getComputedStyle(document.body).backgroundColor,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;

  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - margin * 2;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + margin;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;
  }

  const date = new Date().toISOString().slice(0, 10);
  pdf.save(filename ?? `lighthouse-compare-${date}.pdf`);
}
