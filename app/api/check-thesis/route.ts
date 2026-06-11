import { NextResponse } from "next/server";
import mammoth from "mammoth";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await mammoth.extractRawText({
      buffer,
    });

    const text = result.value;

    const wordCount = text
      .split(/\s+/)
      .filter(Boolean)
      .length;

    const characterCount = text.length;

    const rules = [
      {
        name: "Certificate-I",
        patterns: [
          "CERTIFICATE-I",
          "CERTIFICATE - I",
          "CERTIFICATE I"
        ]
      },

      {
        name: "Certificate-II",
        patterns: [
          "CERTIFICATE-II",
          "CERTIFICATE - II",
          "CERTIFICATE II"
        ]
      },

      {
        name: "Acknowledgement",
    	patterns: [
          "ACKNOWLEDGEMENT",
          "ACKNOWLEDGEMENTS"
        ]
      },

      {
        name: "Abstract",
        patterns: [
          "ABSTRACT"
        ]
      },

      {
        name: "Contents",
        patterns: [
          "CONTENTS",
          "CONTENTS PAGE",
          "TABLE OF CONTENTS"
        ]
      },

      {
        name: "Introduction",
        patterns: [
          "INTRODUCTION"
        ]
      },

      {
        name: "Review of Literature",
        patterns: [
          "REVIEW OF LITERATURE"
        ]
      },

      {
        name: "Materials and Methods",
        patterns: [
          "MATERIALS AND METHODS",
          "MATERIALS & METHODS"
        ]
      },

      {
        name: "Experimental Findings",
        patterns: [
          "EXPERIMENTAL FINDINGS",
          "RESULTS",
          "RESULTS AND DISCUSSION"
        ]
      },

      {
        name: "Discussion",
        patterns: [
          "DISCUSSION"
        ]
      },

      {
        name: "Summary and Conclusion",
        patterns: [
          "SUMMARY AND CONCLUSION",
          "SUMMARY & CONCLUSION",
          "CONCLUSION"
        ]
      },

      {
        name: "Bibliography",
        patterns: [
          "BIBLIOGRAPHY",
          "REFERENCES"
        ]
      }
    ];

    const upperText = text.toUpperCase();

    const bibliographyIndex =
      upperText.indexOf("BIBLIOGRAPHY");

    let bibliographyStatus =
      "Not Found";

    if (bibliographyIndex !== -1) {

      const bibliographyText =
        text.substring(bibliographyIndex);

      const bibliographyLines =
        bibliographyText
          .split("\n")
          .filter(line =>
            line.trim().length > 0
          );

      if (bibliographyLines.length > 20) {
        bibliographyStatus = "Good";
      }
      else if (
        bibliographyLines.length > 5
      ) {
        bibliographyStatus = "Possibly Incomplete";
      }
      else {
        bibliographyStatus = "Very Short";
      }
    }

    const expectedOrder = [
      "CERTIFICATE-I",
      "CERTIFICATE-II",
      "ACKNOWLEDGEMENT",
      "ABSTRACT",
      "CONTENTS",
      "INTRODUCTION",
      "REVIEW OF LITERATURE",
      "MATERIALS AND METHODS",
      "EXPERIMENTAL FINDINGS",
      "DISCUSSION",
      "SUMMARY AND CONCLUSION",
      "BIBLIOGRAPHY"
    ];

    const positions = expectedOrder.map(section => ({
      section,
      position: upperText.indexOf(section)
    }));

    let orderErrors: string[] = [];

    for (let i = 0; i < positions.length - 1; i++) {

      const current = positions[i];
      const next = positions[i + 1];

      if (
        current.position !== -1 &&
        next.position !== -1 &&
        current.position > next.position
      ) {
        orderErrors.push(
          `${current.section} appears after ${next.section}`
        );
      }
    }

    const checks = rules.map(rule => ({
      rule: rule.name,

      passed: rule.patterns.some(pattern =>
        upperText.includes(pattern.toUpperCase())
      )
    }));

    const missingSections = checks
      .filter(check => !check.passed)
      .map(check => check.rule);

    const foundSections =
      checks.filter(c => c.passed).length;

    const passedCount = checks.filter(
      c => c.passed
    ).length;

    const score = Math.round(
      (passedCount / rules.length) * 100
    );

    return NextResponse.json({
      success: true,
      score,
      checks,
      orderErrors,
      missingSections,
      bibliographyStatus,

      statistics: {
        wordCount,
        characterCount,
        foundSections,
        totalSections: rules.length,
      }
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to process thesis" },
      { status: 500 }
    );
  }
}