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

    const checks = {
      certificate1: text.includes("CERTIFICATE"),
      abstract: text.includes("ABSTRACT"),
      acknowledgement: text.includes("ACKNOWLEDGEMENT"),
      bibliography: text.includes("BIBLIOGRAPHY"),
      introduction: text.includes("INTRODUCTION"),
      discussion: text.includes("DISCUSSION"),
      summary:
        text.includes("SUMMARY AND CONCLUSION"),
    };

    return NextResponse.json({
      success: true,
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