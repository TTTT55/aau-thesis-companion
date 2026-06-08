export default function CitationPage() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        AAU Citation Generator
      </h1>

      <input
        type="text"
        placeholder="Enter DOI"
        className="border p-3 w-full max-w-xl"
      />

      <button className="mt-4 bg-black text-white px-6 py-3 rounded">
        Generate Citation
      </button>
    </main>
  );
}