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

    const rules = [
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
      "BIBLIOGRAPHY",
    ];

    const checks = rules.map(rule => ({
      rule,
      passed: text.toUpperCase().includes(rule),
    }));

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
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to process thesis" },
      { status: 500 }
    );
  }
}