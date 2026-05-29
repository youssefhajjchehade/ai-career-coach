import { generateReportPdf } from "../utils/generateReportPdf";

function ReportButton({ analysis, small = false }) {
  if (!analysis) return null;

  return (
    <button
      type="button"
      className={small ? "report-btn report-btn-small" : "report-btn"}
      onClick={() => generateReportPdf(analysis)}
    >
      Download PDF Report
    </button>
  );
}

export default ReportButton;