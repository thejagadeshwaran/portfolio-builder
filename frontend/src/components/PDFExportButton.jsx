import React from "react";
import { generatePortfolioPDF } from "../utils/pdfGenerator";

function PDFExportButton({
  elementId = "portfolio-preview",
  fileName = "Portfolio.pdf"
}) {
  const handleDownload = async () => {
    await generatePortfolioPDF(elementId, fileName);
  };

  return (
    <button
      type="button"
      className="btn btn-danger me-2"
      onClick={handleDownload}
    >
      📄 Download Portfolio PDF
    </button>
  );
}

export default PDFExportButton;