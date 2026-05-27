export default function Home() {
  return (
    <main className="min-h-[100dvh] grid place-items-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center gap-2 rounded-full hairline bg-black/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-black/60">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Rakit v0.1
        </div>

        <h1 className="mt-6 text-3xl md:text-4xl tracking-[-0.03em] font-medium">
          Boilerplate ready.
        </h1>

        <p className="mt-3 text-sm text-black/50 leading-relaxed">
          Edit{" "}
          <code className="font-mono text-[12px] px-1.5 py-0.5 rounded-md bg-black/[0.05] hairline text-black/80">
            src/app/page.tsx
          </code>{" "}
          to get started.
        </p>
      </div>
    </main>
  );
}
