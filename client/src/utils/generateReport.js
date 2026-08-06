import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateReport = (analysis, fileName = "Resume") => {
  const doc = new jsPDF();

  // ===============================
  // HEADER
  // ===============================

  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Campus Buddy", 20, 18);

  doc.setFontSize(11);
  doc.text("AI Resume Analysis Report", 20, 24);

  doc.setTextColor(0, 0, 0);

  // ===============================
  // DETAILS
  // ===============================

  doc.setFontSize(12);

  doc.text(`Resume : ${fileName}`, 20, 40);
  doc.text(`Target Role : ${analysis.targetRole || "N/A"}`, 20, 48);
  doc.text(`Generated : ${new Date().toLocaleString()}`, 20, 56);

  // ===============================
  // SCORES
  // ===============================

  doc.setFontSize(18);
  doc.setTextColor(37, 99, 235);
  doc.text("Overall Analysis", 20, 72);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(13);

  doc.text(`Overall Score : ${analysis.overallScore}/100`, 20, 85);
  doc.text(`ATS Score : ${analysis.atsScore}%`, 20, 95);

  // ===============================
  // CATEGORY TABLE
  // ===============================

  autoTable(doc, {
    startY: 105,
    head: [["Category", "Score", "Status"]],
    body: Object.values(analysis.categoryScores || {}).map((value) => [
      value.label,
      `${value.score}/${value.max}`,
      value.status,
    ]),
    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  let y = doc.lastAutoTable.finalY + 15;

  // ===============================
  // STRENGTHS
  // ===============================

  doc.setFontSize(16);
  doc.setTextColor(34, 197, 94);
  doc.text("Strengths", 20, y);

  y += 8;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  (analysis.strengths || []).forEach((item) => {
    const lines = doc.splitTextToSize(`• ${item}`, 170);
    doc.text(lines, 25, y);
    y += lines.length * 6 + 2;
  });

  // ===============================
  // WEAKNESSES
  // ===============================

  y += 8;

  doc.setFontSize(16);
  doc.setTextColor(245, 158, 11);
  doc.text("Areas for Improvement", 20, y);

  y += 8;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  (analysis.weaknesses || []).forEach((item) => {
    const lines = doc.splitTextToSize(`• ${item}`, 170);
    doc.text(lines, 25, y);
    y += lines.length * 6 + 2;
  });

  // ===============================
  // KEYWORDS
  // ===============================

  y += 10;

  doc.setFontSize(16);
  doc.setTextColor(37, 99, 235);
  doc.text("Found Keywords", 20, y);

  y += 8;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  doc.text(doc.splitTextToSize((analysis.foundKeywords || []).join(", ") || "None found", 170), 25, y);

  y += 15;

  doc.setFontSize(16);
  doc.setTextColor(220, 38, 38);
  doc.text("Missing Keywords", 20, y);

  y += 8;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  doc.text(doc.splitTextToSize((analysis.missingKeywords || []).join(", ") || "None", 170), 25, y);

  // ===============================
  // NEW PAGE — SUMMARY & READINESS
  // ===============================

  doc.addPage();

  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text("Resume Summary", 20, 20);

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  let sy = 32;
  doc.text(doc.splitTextToSize(analysis.resumeSummary || "Not available.", 170), 20, sy);

  sy += doc.splitTextToSize(analysis.resumeSummary || "", 170).length * 6 + 15;

  doc.setFontSize(16);
  doc.setTextColor(37, 99, 235);
  doc.text("Career Readiness", 20, sy);

  sy += 8;

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(doc.splitTextToSize(analysis.careerReadiness || "Not available.", 170), 20, sy);

  if ((analysis.missingInformation || []).length > 0) {
    sy += doc.splitTextToSize(analysis.careerReadiness || "", 170).length * 6 + 15;

    doc.setFontSize(16);
    doc.setTextColor(217, 119, 6);
    doc.text("Missing Information", 20, sy);

    sy += 8;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    analysis.missingInformation.forEach((item) => {
      const lines = doc.splitTextToSize(`• ${item}`, 170);
      doc.text(lines, 25, sy);
      sy += lines.length * 6 + 2;
    });
  }

  // ===============================
  // NEW PAGE — RECOMMENDATIONS
  // ===============================

  doc.addPage();

  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235);
  doc.text("AI Recommendations", 20, 20);

  let yy = 40;

  (analysis.recommendations || []).forEach((rec, index) => {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);

    doc.text(`${index + 1}. ${rec.title}`, 20, yy);

    yy += 8;

    doc.setFontSize(11);

    const lines = doc.splitTextToSize(rec.description, 170);

    doc.text(lines, 25, yy);

    yy += lines.length * 7 + 10;
  });

  if ((analysis.suggestedImprovements || []).length > 0) {
    yy += 5;
    doc.setFontSize(16);
    doc.setTextColor(34, 197, 94);
    doc.text("Suggested Next Steps", 20, yy);

    yy += 8;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    analysis.suggestedImprovements.forEach((item) => {
      const lines = doc.splitTextToSize(`• ${item}`, 170);
      doc.text(lines, 25, yy);
      yy += lines.length * 6 + 2;
    });
  }

  // ===============================
  // FOOTER
  // ===============================

  doc.setFontSize(10);
  doc.setTextColor(120);

  doc.text("Generated by Campus Buddy AI", 20, 285);
  doc.text("Version 1.0", 170, 285);

  doc.save("CampusBuddy_Resume_Report.pdf");
};
