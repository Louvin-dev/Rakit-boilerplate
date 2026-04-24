export default function Home() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-8">
      <div className="max-w-xl space-y-4 text-center">
        <h1 className="text-4xl font-medium tracking-tighter">
          Aplikasimu mulai di sini.
        </h1>
        <p className="text-muted-foreground text-sm">
          Edit{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted text-xs">
            src/app/page.tsx
          </code>{" "}
          untuk mulai membangun.
        </p>
      </div>
    </main>
  );
}
