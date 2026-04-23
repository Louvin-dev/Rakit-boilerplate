"use client";

export const dynamic = "force-dynamic";

export default function GlobalError() {
  return (
    <html>
      <body>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 500, margin: 0 }}>Terjadi kesalahan</h1>
            <p style={{ color: "#888", fontSize: "0.875rem", marginTop: "0.5rem" }}>Coba muat ulang halaman.</p>
          </div>
        </div>
      </body>
    </html>
  );
}
