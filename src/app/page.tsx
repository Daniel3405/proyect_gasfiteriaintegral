import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <section style={{ textAlign: "center", marginBottom: "2rem" }}>
        <p style={{ color: "#0f4c81", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em" }}>
          Intranet Gasfitería Integral
        </p>
        <h1 style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", margin: "1rem 0" }}>
          Gasfitería Integral
        </h1>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#39424e" }}>
          
          Inicia sesión para Solicitar un servicio o cotizar.
        </p>
      </section>

      <section style={{ display: "grid", gap: "1rem", justifyItems: "center" }}>
        <Link
          href="/login"
          style={{
            display: "inline-block",
            padding: "1rem 1.8rem",
            backgroundColor: "#0f4c81",
            color: "#000000",
            borderRadius: "999px",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Ir al login
        </Link>

      </section>
    </main>
  );
}
