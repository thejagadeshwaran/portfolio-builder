// frontend/src/utils/pdfGenerator.js
export const generatePDF = async (elementId, fileName) => {
  try {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById(elementId);

    if (!element) throw new Error("Element not found");

    const opt = {
      margin: 10,
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error("PDF Generation Failed:", error);
    return false;
  }
};