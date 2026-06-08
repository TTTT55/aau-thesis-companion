export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-4">
        AAU Thesis Companion
      </h1>

      <p className="text-lg text-center max-w-xl mb-10">
        Generate AAU-compliant citations and validate your thesis
        before submission.
      </p>

      <div className="flex gap-4">
        <a
          href="/citation"
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Generate Citation
        </a>

        <a
          href="/checker"
          className="border px-6 py-3 rounded-lg"
        >
          Check Thesis
        </a>
      </div>
    </main>
  );
}