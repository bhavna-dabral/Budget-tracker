import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportToPDF = async (elementId) => {
  const element = document.getElementById(elementId);

  if (!element) return;

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save("expense-report.pdf");
};