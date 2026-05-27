"use client";

import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      {/* Mesh gradient orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="mesh-orb orb-drift"
          style={{
            top: "-10%",
            left: "-10%",
            width: "55vw",
            height: "55vw",
            background:
              "radial-gradient(closest-side, rgba(120, 90, 255, 0.45), transparent 70%)",
          }}
        />
        <div
          className="mesh-orb orb-drift-2"
          style={{
            top: "20%",
            right: "-15%",
            width: "50vw",
            height: "50vw",
            background:
              "radial-gradient(closest-side, rgba(60, 220, 180, 0.30), transparent 70%)",
          }}
        />
        <div
          className="mesh-orb orb-drift"
          style={{
            bottom: "-20%",
            left: "20%",
            width: "60vw",
            height: "60vw",
            background:
              "radial-gradient(closest-side, rgba(255, 120, 180, 0.20), transparent 70%)",
          }}
        />
      </div>

      {/* Floating glass nav pill */}
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-6">
        <nav className="hairline backdrop-blur-2xl bg-black/40 rounded-full flex items-center gap-1 p-1.5 pl-5 transition-all duration-700 ease-spring">
          <a href="#" className="text-[13px] font-medium tracking-tight pr-3">
            Rakit<span className="text-white/30">/</span>
            <span className="font-mono text-[11px] text-white/50 ml-1">
              v0.1
            </span>
          </a>
          <div className="hidden md:flex items-center gap-1 text-[13px] text-white/60">
            {["Product", "Stack", "Docs", "Changelog"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-all duration-500 ease-spring"
              >
                {label}
              </a>
            ))}
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="md:hidden relative w-9 h-9 rounded-full bg-white/5 ml-1 grid place-items-center"
          >
            <span
              className={`absolute h-px w-4 bg-white transition-all duration-500 ease-spring ${
                open ? "rotate-45 translate-y-0" : "-translate-y-1"
              }`}
            />
            <span
              className={`absolute h-px w-4 bg-white transition-all duration-500 ease-spring ${
                open ? "-rotate-45 translate-y-0" : "translate-y-1"
              }`}
            />
          </button>
          <a
            href="#start"
            className="hidden md:inline-flex group items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-white text-black text-[13px] font-medium ml-1 transition-all duration-500 ease-spring hover:bg-white/90 active:scale-[0.97]"
          >
            Get started
            <span className="w-7 h-7 rounded-full bg-black/5 grid place-items-center transition-all duration-500 ease-spring group-hover:translate-x-0.5 group-hover:-translate-y-px">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </a>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden backdrop-blur-3xl bg-black/80 transition-all duration-700 ease-spring ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="pt-32 px-8 flex flex-col gap-2">
          {["Product", "Stack", "Docs", "Changelog", "Get started"].map(
            (label, i) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className={`text-5xl font-medium tracking-tighter transition-all duration-700 ease-spring ${
                  open
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${100 + i * 60}ms` }}
              >
                {label}
              </a>
            ),
          )}
        </div>
      </div>

      {/* Hero */}
      <section className="relative pt-40 md:pt-48 pb-24 md:pb-32 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="reveal flex justify-center mb-8" style={{ animationDelay: "100ms" }}>
          <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.22em] font-medium bg-white/[0.04] hairline text-white/70">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 align-middle" />
            v0.1 — Boilerplate kit
          </span>
        </div>

        <h1
          className="reveal text-center text-[44px] sm:text-6xl md:text-7xl lg:text-[96px] leading-[0.95] tracking-[-0.04em] font-medium max-w-5xl mx-auto"
          style={{ animationDelay: "220ms" }}
        >
          Build at the
          <br />
          <span className="italic font-light text-white/70">speed of</span>{" "}
          thought.
        </h1>

        <p
          className="reveal text-center text-base md:text-lg text-white/55 max-w-xl mx-auto mt-8 leading-relaxed"
          style={{ animationDelay: "360ms" }}
        >
          Rakit is the production-grade Next.js scaffold engineered for teams
          who ship — typed, themed, and tuned for the edge.
        </p>

        <div
          className="reveal flex flex-col sm:flex-row items-center justify-center gap-3 mt-12"
          style={{ animationDelay: "480ms" }}
        >
          <a
            href="#start"
            className="group inline-flex items-center gap-2 pl-6 pr-1.5 py-1.5 rounded-full bg-white text-black text-sm font-medium transition-all duration-500 ease-spring hover:bg-white/90 active:scale-[0.98]"
          >
            <span className="py-2">Start building</span>
            <span className="w-9 h-9 rounded-full bg-black/[0.06] grid place-items-center transition-all duration-500 ease-spring group-hover:translate-x-1 group-hover:-translate-y-px group-hover:scale-105">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </a>
          <a
            href="#stack"
            className="group inline-flex items-center gap-2 pl-6 pr-1.5 py-1.5 rounded-full bg-white/[0.04] hairline text-white text-sm font-medium transition-all duration-500 ease-spring hover:bg-white/[0.08] active:scale-[0.98]"
          >
            <span className="py-2">View the stack</span>
            <span className="w-9 h-9 rounded-full bg-white/[0.06] grid place-items-center transition-all duration-500 ease-spring group-hover:translate-x-1 group-hover:-translate-y-px">
              <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        </div>

        {/* Hero double-bezel terminal card */}
        <div
          className="reveal mt-20 md:mt-28 mx-auto max-w-3xl"
          style={{ animationDelay: "640ms" }}
        >
          <DoubleBezel>
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="ml-3 font-mono text-[11px] tracking-wide text-white/40">
                ~/projects · zsh
              </span>
            </div>
            <div className="px-6 py-7 font-mono text-[13px] leading-relaxed">
              <div className="text-white/40">
                $ <span className="text-white/90">bunx create-rakit-app</span>
              </div>
              <div className="text-white/40 mt-2">
                ◐ Forging scaffolds…{" "}
                <span className="text-emerald-300/90">done</span>
              </div>
              <div className="text-white/40">
                ◐ Wiring edge runtime…{" "}
                <span className="text-emerald-300/90">done</span>
              </div>
              <div className="text-white/40">
                ◐ Tuning typography…{" "}
                <span className="text-emerald-300/90">done</span>
              </div>
              <div className="mt-3 text-white/70">
                → Ready in{" "}
                <span className="text-white">1.2s</span>. Open{" "}
                <span className="text-white">localhost:3000</span>
              </div>
            </div>
          </DoubleBezel>
        </div>
      </section>

      {/* Asymmetrical Bento */}
      <section
        id="stack"
        className="relative px-4 md:px-8 pb-32 md:pb-40 max-w-7xl mx-auto"
      >
        <div className="reveal flex items-end justify-between flex-wrap gap-6 mb-12 md:mb-16">
          <div>
            <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.22em] font-medium bg-white/[0.04] hairline text-white/60">
              The stack
            </span>
            <h2 className="mt-5 text-4xl md:text-6xl tracking-[-0.035em] font-medium max-w-2xl leading-[1]">
              Opinionated where it matters.
              <span className="text-white/40">
                {" "}
                Quiet everywhere else.
              </span>
            </h2>
          </div>
          <p className="text-sm text-white/50 max-w-xs">
            Twelve decisions already made — so your first commit is product,
            not plumbing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 auto-rows-[minmax(160px,auto)]">
          <BentoCard
            className="md:col-span-7 md:row-span-2"
            eyebrow="Runtime"
            title="Edge-ready by default."
            body="Cloudflare Workers via OpenNext. Sub-50ms cold starts, globally."
          >
            <div className="relative h-40 md:h-56 mt-6 rounded-2xl bg-black/40 inner-highlight overflow-hidden">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(circle at 30% 40%, rgba(120,90,255,0.35), transparent 50%), radial-gradient(circle at 70% 60%, rgba(60,220,180,0.25), transparent 55%)",
                }}
              />
              <svg
                viewBox="0 0 400 200"
                className="absolute inset-0 w-full h-full"
              >
                <g
                  stroke="rgba(255,255,255,0.10)"
                  strokeWidth="1"
                  fill="none"
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={i * 28}
                      x2="400"
                      y2={i * 28 - 60}
                    />
                  ))}
                </g>
                <circle cx="120" cy="90" r="3" fill="rgba(120,200,255,0.9)" />
                <circle cx="240" cy="110" r="3" fill="rgba(200,255,180,0.9)" />
                <circle cx="320" cy="60" r="3" fill="rgba(255,180,220,0.9)" />
              </svg>
            </div>
          </BentoCard>

          <BentoCard
            className="md:col-span-5"
            eyebrow="Type system"
            title="Strict, end-to-end."
            body="TypeScript 5.x, tsx-only source tree, zero `any` slipping through."
          />

          <BentoCard
            className="md:col-span-5"
            eyebrow="Styling"
            title="Tailwind, tuned."
            body="HSL token system, dark-mode primitive, no shadcn lock-in."
          />

          <BentoCard
            className="md:col-span-4"
            eyebrow="DX"
            title="Bun-first."
            body="bun.lock, ~3× installs, native test runner."
          />
          <BentoCard
            className="md:col-span-4"
            eyebrow="Deploy"
            title="One command."
            body="`bun run deploy` ships to Workers."
          />
          <BentoCard
            className="md:col-span-4"
            eyebrow="Fonts"
            title="Geist, variable."
            body="Self-hosted, FOIT-free, antialiased."
          />
        </div>
      </section>

      {/* CTA strip */}
      <section
        id="start"
        className="relative px-4 md:px-8 pb-32 md:pb-40 max-w-7xl mx-auto"
      >
        <DoubleBezel large>
          <div className="px-8 py-16 md:px-16 md:py-24 text-center">
            <h3 className="text-4xl md:text-6xl tracking-[-0.035em] font-medium leading-[1]">
              Edit{" "}
              <code className="font-mono text-[0.7em] align-middle px-3 py-1.5 rounded-xl bg-white/[0.05] hairline text-white/80">
                src/app/page.tsx
              </code>
              <br />
              and ship today.
            </h3>
            <p className="text-white/50 text-sm md:text-base mt-6 max-w-md mx-auto">
              The scaffold is done. The defaults are right. The rest is yours.
            </p>
            <div className="mt-10 flex items-center justify-center">
              <a
                href="https://github.com"
                className="group inline-flex items-center gap-2 pl-6 pr-1.5 py-1.5 rounded-full bg-white text-black text-sm font-medium transition-all duration-500 ease-spring hover:bg-white/90 active:scale-[0.98]"
              >
                <span className="py-2">Clone the repo</span>
                <span className="w-9 h-9 rounded-full bg-black/[0.06] grid place-items-center transition-all duration-500 ease-spring group-hover:translate-x-1 group-hover:-translate-y-px group-hover:scale-105">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </a>
            </div>
          </div>
        </DoubleBezel>
      </section>

      <footer className="relative px-4 md:px-8 pb-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-white/40 font-mono">
          <span>© Rakit — assembled in Jakarta.</span>
          <span>Built with Next · Tailwind · Bun · Workers</span>
        </div>
      </footer>
    </main>
  );
}

function DoubleBezel({
  children,
  large = false,
}: {
  children: React.ReactNode;
  large?: boolean;
}) {
  return (
    <div
      className={`hairline bg-white/[0.025] p-1.5 ${
        large ? "rounded-[2.5rem]" : "rounded-[2rem]"
      } backdrop-blur-xl`}
    >
      <div
        className={`inner-highlight bg-black/60 ${
          large
            ? "rounded-[calc(2.5rem-0.375rem)]"
            : "rounded-[calc(2rem-0.375rem)]"
        } overflow-hidden`}
      >
        {children}
      </div>
    </div>
  );
}

function BentoCard({
  className = "",
  eyebrow,
  title,
  body,
  children,
}: {
  className?: string;
  eyebrow: string;
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`group hairline bg-white/[0.025] p-1.5 rounded-[1.75rem] backdrop-blur-xl transition-all duration-700 ease-spring hover:bg-white/[0.04] ${className}`}
    >
      <div className="inner-highlight bg-black/50 rounded-[calc(1.75rem-0.375rem)] h-full p-6 md:p-7 flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          {eyebrow}
        </span>
        <h3 className="mt-3 text-xl md:text-2xl tracking-[-0.02em] font-medium leading-tight">
          {title}
        </h3>
        <p className="mt-2 text-sm text-white/50 leading-relaxed">{body}</p>
        {children}
      </div>
    </div>
  );
}

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}
