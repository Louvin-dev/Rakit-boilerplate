export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-medium tracking-tight">404</h1>
        <p className="text-muted-foreground text-sm">Halaman tidak ditemukan.</p>
      </div>
    </div>
  );
}
