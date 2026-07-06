import Link from "next/link";

export default function DashboardPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "#0f4c81",
            fontSize: "40px",
            marginBottom: "10px",
          }}
        >
          Intranet Gasfitería Integral
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "40px",
            fontSize: "18px",
          }}
        >
          Sistema de servicios, trabajadores y cotizaciones.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "25px",
          }}
        >
          <Link
            href="/servicios"
            style={{
              textDecoration: "none",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "15px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ color: "#0f4c81" }}>
                📋 Solicitudes
              </h2>

              <p style={{ color: "#555" }}>
                Solicitudes de servicios
                de gasfitería.
              </p>
            </div>
          </Link>

          <Link
            href="/trabajadores"
            style={{
              textDecoration: "none",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "15px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ color: "#0f4c81" }}>
                👷 Trabajadores
              </h2>

              <p style={{ color: "#555" }}>
                Personal, especialidades
                y disponibilidad.
              </p>
            </div>
          </Link>

          <Link
            href="/cotizaciones"
            style={{
              textDecoration: "none",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "15px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              <h2 style={{ color: "#0f4c81" }}>
                💰 Cotizaciones
              </h2>

              <p style={{ color: "#555" }}>
                cotizaciones.
              </p>
            </div>
          </Link>
        </div>

        <div
          style={{
            marginTop: "40px",
            background: "white",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ color: "#0f4c81" }}>
            Resumen del Sistema
          </h3>

          <p>
            Bienvenido a la Intranet de Gasfitería
            Integral. Desde aquí puedes 
            solicitar nuestros servicios, trabajadores y cotizaciones.
          </p>
        </div>
      </div>
    </main>
  );
}