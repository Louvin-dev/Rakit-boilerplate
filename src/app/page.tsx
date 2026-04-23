import { Sparkle, ArrowRight, Circle } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

/**
 * Starter canvas.
 *
 * This page is what the user sees immediately after `git clone`. It exists
 * to prove the design system is wired up — the AI is expected to replace
 * this file with whatever the user asked for on the first prompt.
 *
 * Keep the asymmetric split, controlled hierarchy, and grain overlay. Do
 * NOT reintroduce centered-hero templates.
 */
export default function Home() {
  return (
    <main className="relative min-h-[100dvh]">
      <div className="absolute inset-0 mesh pointer-events-none" />

      <Nav />

      <section className="relative max-w-7xl mx-auto px-6 pt-16 md:pt-28 pb-24 grid md:grid-cols-[1.05fr_1fr] gap-10 md:gap-20 items-center">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 backdrop-blur-sm px-3 py-1 text-[11px] font-mono text-muted-foreground">
            <Circle weight="fill" className="h-2 w-2 text-brand animate-pulse" />
            canvas siap · tunggu instruksi
          </div>

          <h1 className="text-balance text-4xl md:text-5xl font-medium tracking-tighter leading-[1.02]">
            Aplikasimu mulai
            <br />
            <span className="text-brand">dari halaman ini.</span>
          </h1>

          <p className="text-base text-muted-foreground max-w-[52ch] leading-relaxed">
            Design system sudah terpasang — Geist Sans + Mono, palet krem hangat,
            aksen emerald desaturasi, grain overlay, spring physics. Tulis di
            chat apa yang ingin dibangun; file ini akan diganti otomatis.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button size="lg">
              Mulai bangun
              <ArrowRight weight="bold" className="h-3.5 w-3.5" />
            </Button>
            <Button size="lg" variant="ghost">
              Lihat dokumentasi
            </Button>
          </div>

          <dl className="grid grid-cols-3 gap-4 pt-6 text-[11px] font-mono max-w-md">
            <Stat label="framework" value="next 16" />
            <Stat label="tipografi" value="geist" />
            <Stat label="runtime" value="workers" />
          </dl>
        </div>

        <CanvasMockup />
      </section>
    </main>
  );
}

function Nav() {
  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium tracking-tight">
          <Sparkle weight="fill" className="h-4 w-4 text-brand" />
          <span>rakit</span>
          <span className="text-muted-foreground text-xs font-mono">
            starter
          </span>
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          v0.1 · siap dikembangkan
        </div>
      </div>
    </nav>
  );
}

function CanvasMockup() {
  return (
    <div className="relative rounded-[22px] border border-border/70 bg-card/50 backdrop-blur-xl overflow-hidden shadow-[0_20px_50px_-20px_rgba(60,40,20,0.18)]">
      <div className="h-9 border-b border-border/60 flex items-center justify-between px-4">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
          <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
          <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
        </div>
        <div className="text-[10px] font-mono text-muted-foreground">
          kanvas.tsx
        </div>
        <div className="w-12" />
      </div>

      <div className="p-7 space-y-5 min-h-[300px] flex flex-col justify-between">
        <div className="space-y-3">
          <div className="h-2 w-24 rounded-full bg-muted/80" />
          <div className="h-1.5 w-40 rounded-full bg-muted/50" />
          <div className="h-1.5 w-32 rounded-full bg-muted/40" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-lg border border-border/60 bg-gradient-to-br from-muted/40 to-muted/10"
            />
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
            <Circle
              weight="fill"
              className="h-1.5 w-1.5 text-brand animate-pulse"
            />
            menunggu prompt
          </div>
          <div className="h-6 w-20 rounded bg-foreground/90" />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-border/60 pt-2">
      <dt className="text-[9px] uppercase tracking-wider text-muted-foreground/70">
        {label}
      </dt>
      <dd className="tabular-nums text-foreground">{value}</dd>
    </div>
  );
}
