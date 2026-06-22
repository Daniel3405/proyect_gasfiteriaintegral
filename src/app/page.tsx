import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <section style={{ textAlign: "center", marginBottom: "2rem" }}>
        <p style={{ color: "#0f4c81", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em" }}>
          Intranet Gasfitería Integral
        </p>
        <h1 style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)", margin: "1rem 0" }}>
          Administración de servicios y trabajadores
        </h1>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#39424e" }}>
          
          Inicia sesión para ver los datos, administrar tus servicios y controlar el personal.
        </p>
      </section>

      <section style={{ display: "grid", gap: "1rem", justifyItems: "center" }}>
        <Link
          href="/login"
          style={{
            display: "inline-block",
            padding: "1rem 1.8rem",
            backgroundColor: "#0f4c81",
            color: "#eb6060",
            borderRadius: "999px",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Ir al login
        </Link>

        <div style={{ maxWidth: "640px", textAlign: "center", color: "#555" }}>
          <p>
            Si ya estás logueado, podrás acceder al módulo de servicios y al módulo de trabajadores.
            El sistema almacena los datos en <strong>localStorage</strong> y protege las rutas con sesión activa.
          </p>
        </div>
      </section>
    </main>
  );
}
