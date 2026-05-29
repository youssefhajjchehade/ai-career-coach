import { jsPDF } from "jspdf";

const formatArray = (arr) => {
  if (!arr || arr.length === 0) return "None";
  return arr.join(", ");
};

const addWrappedText = (doc, text, x, y, maxWidth, lineHeight = 7) => {
  const lines = doc.splitTextToSize(text || "Not provided", maxWidth);

  lines.forEach((line) => {
    if (y > 275) {
      doc.addPage();
      y = 20;
    }

    doc.text(line, x, y);
    y += lineHeight;
  });

  return y;
};

const addSectionTitle = (doc, title, y) => {
  if (y > 265) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(title, 14, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  return y + 8;
};

const addBulletList = (doc, items, y) => {
  if (!items || items.length === 0) {
    return addWrappedText(doc, "• None", 18, y, 175);
  }

  items.forEach((item) => {
    y = addWrappedText(doc, `• ${item}`, 18, y, 175);
    y += 2;
  });

  return y;
};

export const generateReportPdf = (analysis) => {
  if (!analysis) return;

  const doc = new jsPDF();

  const fileDate = new Date().toLocaleDateString();
  const fileName = `career-analysis-${analysis.matchScore || 0}-percent.pdf`;

  let y = 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("AI Career Coach Report", 14, y);

  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Generated on: ${fileDate}`, 14, y);

  y += 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`Match Score: ${analysis.matchScore ?? "N/A"}%`, 14, y);

  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  y = addWrappedText(
    doc,
    `Analysis mode: ${
      analysis.analysisMode === "ai" ? "AI-powered analysis" : "Rule-based fallback"
    }`,
    14,
    y,
    180
  );

  y = addWrappedText(
    doc,
    `Detected role: ${analysis.jobTitle || "Not detected"}`,
    14,
    y,
    180
  );

  y = addWrappedText(
    doc,
    `Career field: ${analysis.careerField || "Not detected"}`,
    14,
    y,
    180
  );

  y = addWrappedText(
    doc,
    `Seniority level: ${analysis.seniorityLevel || "Not detected"}`,
    14,
    y,
    180
  );

  y += 4;

  y = addSectionTitle(doc, "Overall Feedback", y);
  y = addWrappedText(doc, analysis.overallFeedback || "No feedback available.", 14, y, 180);

  y += 4;

  y = addSectionTitle(doc, "Matched Skills", y);
  y = addWrappedText(doc, formatArray(analysis.matchedSkills), 14, y, 180);

  y += 4;

  y = addSectionTitle(doc, "Missing Skills", y);
  y = addWrappedText(doc, formatArray(analysis.missingSkills), 14, y, 180);

  y += 4;

  y = addSectionTitle(doc, "Missing Keywords", y);
  y = addWrappedText(doc, formatArray(analysis.missingKeywords), 14, y, 180);

  y += 4;

  y = addSectionTitle(doc, "Strengths", y);
  y = addBulletList(doc, analysis.strengths, y);

  y += 4;

  y = addSectionTitle(doc, "Resume Improvements", y);
  y = addBulletList(
    doc,
    analysis.resumeImprovements?.length > 0
      ? analysis.resumeImprovements
      : analysis.suggestions,
    y
  );

  y += 4;

  y = addSectionTitle(doc, "Interview Questions", y);
  y = addBulletList(doc, analysis.interviewQuestions, y);

  doc.save(fileName);
};