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
        <pre className="mt-8">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </main>
  );
}