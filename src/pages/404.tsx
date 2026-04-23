export default function Custom404() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 500 }}>404</h1>
        <p style={{ color: "#888", fontSize: "0.875rem" }}>
          Halaman tidak ditemukan.
        </p>
      </div>
    </div>
  );
}
