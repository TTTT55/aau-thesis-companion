export default function CheckerPage() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        AAU Thesis Checker
      </h1>

      <input
        type="file"
        accept=".docx"
        className="mb-4"
      />

      <button className="bg-black text-white px-6 py-3 rounded">
        Check Thesis
      </button>
    </main>
  );
}