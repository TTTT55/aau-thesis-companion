"use client";

import { useState } from "react";

export default function CheckerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);

  async function checkThesis() {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/check-thesis", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setResult(data);
  }

  let status = "";
  let statusColor = "";

  if (result) {
    if (result.score >= 90) {
      status = "Excellent";
      statusColor = "text-green-500";
    } else if (result.score >= 70) {
      status = "Needs Attention";
      statusColor = "text-yellow-500";
    } else {
      status = "Major Issues";
      statusColor = "text-red-500";
    }
  }

  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        AAU Thesis Checker
      </h1>

      <input
        type="file"
        accept=".docx"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <button
        onClick={checkThesis}
        className="block mt-4 bg-black text-white px-6 py-3 rounded"
      >
        Check Thesis
      </button>

      {result && (
        <div className="mt-8">

          <h2 className="text-2xl font-bold mb-4">
            AAU Compliance Score
          </h2>

          <div
            className={`text-xl font-bold mb-4 ${statusColor}`}
          >
            {status}
          </div>

          <div className="text-6xl font-bold mb-6">
            {result.score}%
    	  </div>

          <div className="space-y-2">
            {result.checks.map(
              (check: any) => (
                <div
                  key={check.rule}
                  className="flex items-center gap-3"
                >
                  <span>
                    {check.passed ? "✅" : "❌"}
                  </span>

                  <span>
                    {check.rule}
                  </span>
                </div>
              )
            )}
          </div>

          {result.missingSections?.length > 0 && (
            <div className="mt-8">

              <h2 className="text-xl font-bold text-red-600 mb-3">
                Missing Sections
              </h2>

              {result.missingSections.map(
                (section: string, index: number) => (
                  <div
                    key={index}
                    className="mb-2"
                  >
                    ❌ {section}
                  </div>
                )
              )}

            </div>
          )}

          {result.orderErrors?.length > 0 && (
            <div className="mt-8">

              <h2 className="text-xl font-bold text-red-600 mb-3">
                Section Order Issues
              </h2>

              {result.orderErrors.map(
                (error: string, index: number) => (
                  <div
                    key={index}
                   className="mb-2"
                  >
                   ❌ {error}
                  </div>
                )
              )}

             </div>
          )}

        </div>
      )}
    </main>
  );
}