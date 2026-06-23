"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Cotizacion } from "@/types/Cotizacion";

export default function CotizacionesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [solicitudId, setSolicitudId] = useState("");
  const [materiales, setMateriales] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precioTotal, setPrecioTotal] = useState("");
  const [fechaEmision, setFechaEmision] = useState("");
  const [estado, setEstado] = useState<
    "Pendiente" | "Aprobada" | "Rechazada"
  >("Pendiente");

  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      router.replace("/login");
      return;
    }
  }, [user, router, isLoading]);

  useEffect(() => {
    const datosGuardados = localStorage.getItem("cotizaciones");

    if (datosGuardados) {
      setCotizaciones(JSON.parse(datosGuardados));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cotizaciones", JSON.stringify(cotizaciones));
  }, [cotizaciones]);

  const editarCotizacion = (cotizacion: Cotizacion) => {
    setSolicitudId(cotizacion.solicitudId.toString());
    setMateriales(cotizacion.materiales);
    setCantidad(cotizacion.cantidad.toString());
    setPrecioTotal(cotizacion.precioTotal.toString());
    setFechaEmision(cotizacion.fechaEmision);
    setEstado(cotizacion.estado);

    setEditandoId(cotizacion.id);
  };

  const cotizacionesFiltradas = cotizaciones.filter(
    (cotizacion) =>
      cotizacion.materiales.toLowerCase().includes(busqueda.toLowerCase()) ||
      cotizacion.estado.toLowerCase().includes(busqueda.toLowerCase()) ||
      cotizacion.solicitudId.toString().includes(busqueda)
  );

  const guardarCotizacion = () => {
    if (
      !solicitudId.trim() ||
      !materiales.trim() ||
      !cantidad.trim() ||
      !precioTotal.trim() ||
      !fechaEmision.trim()
    ) {
      alert("Complete todos los campos");
      return;
    }

    if (editandoId !== null) {
      const actualizadas = cotizaciones.map((c) =>
        c.id === editandoId
          ? {
              ...c,
              solicitudId: Number(solicitudId),
              materiales,
              cantidad: Number(cantidad),
              precioTotal: Number(precioTotal),
              fechaEmision,
              estado,
            }
          : c
      );

      setCotizaciones(actualizadas);
      setEditandoId(null);

      alert("Cotización actualizada");
    } else {
      const nuevaCotizacion: Cotizacion = {
        id: Date.now(),
        solicitudId: Number(solicitudId),
        materiales,
        cantidad: Number(cantidad),
        precioTotal: Number(precioTotal),
        fechaEmision,
        estado,
      };

      setCotizaciones((prev) => [...prev, nuevaCotizacion]);

      alert("Cotización guardada correctamente");
    }

    setSolicitudId("");
    setMateriales("");
    setCantidad("");
    setPrecioTotal("");
    setFechaEmision("");
    setEstado("Pendiente");
  };

  const eliminarCotizacion = (id: number) => {
    if (!confirm("¿Desea eliminar esta cotización?")) return;

    setCotizaciones((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh", padding: "30px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ color: "#0f4c81", marginBottom: "20px" }}>
          💰 Gestión de Cotizaciones
        </h1>

        {/* FORMULARIO */}
        <div style={{ background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", marginBottom: "25px" }}>
          <h2>Nueva Cotización</h2>

          <input value={solicitudId} onChange={(e) => setSolicitudId(e.target.value)} placeholder="ID Solicitud" style={inputStyle} />
          <input value={materiales} onChange={(e) => setMateriales(e.target.value)} placeholder="Materiales" style={inputStyle} />
          <input value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="Cantidad" style={inputStyle} />
          <input value={precioTotal} onChange={(e) => setPrecioTotal(e.target.value)} placeholder="Precio Total" style={inputStyle} />
          <input type="date" value={fechaEmision} onChange={(e) => setFechaEmision(e.target.value)} style={inputStyle} />

          <select
            value={estado}
            onChange={(e) =>
              setEstado(e.target.value as "Pendiente" | "Aprobada" | "Rechazada")
            }
            style={inputStyle}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobada">Aprobada</option>
            <option value="Rechazada">Rechazada</option>
          </select>

          <button onClick={guardarCotizacion} style={guardarButton}>
            {editandoId !== null ? "Actualizar Cotización" : "Guardar Cotización"}
          </button>
        </div>

        {/* LISTADO */}
        <div style={{ background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}>
          <h2>Cotizaciones Registradas ({cotizaciones.length})</h2>

          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="🔍 Buscar..."
            style={{ width: "100%", padding: "12px", marginBottom: "20px", borderRadius: "8px", border: "1px solid #ccc" }}
          />

          {cotizacionesFiltradas.length === 0 ? (
            <p>No existen cotizaciones registradas.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#0f4c81", color: "white" }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Solicitud</th>
                  <th style={thStyle}>Materiales</th>
                  <th style={thStyle}>Cantidad</th>
                  <th style={thStyle}>Precio</th>
                  <th style={thStyle}>Fecha</th>
                  <th style={thStyle}>Estado</th>
                  <th style={thStyle}>Acción</th>
                </tr>
              </thead>

              <tbody>
                {cotizacionesFiltradas.map((cotizacion) => (
                  <tr key={cotizacion.id}>
                    <td style={tdStyle}>{cotizacion.id}</td>
                    <td style={tdStyle}>{cotizacion.solicitudId}</td>
                    <td style={tdStyle}>{cotizacion.materiales}</td>
                    <td style={tdStyle}>{cotizacion.cantidad}</td>
                    <td style={tdStyle}>${cotizacion.precioTotal.toLocaleString("es-CL")}</td>
                    <td style={tdStyle}>{cotizacion.fechaEmision}</td>
                    <td style={tdStyle}>{cotizacion.estado}</td>

                    <td style={tdStyle}>
                      <button
                        onClick={() => editarCotizacion(cotizacion)}
                        style={editarButton}
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => eliminarCotizacion(cotizacion.id)}
                        style={eliminarButton}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ESTILOS */
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const guardarButton = {
  backgroundColor: "#0f4c81",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  cursor: "pointer",
};

const editarButton = {
  backgroundColor: "#ffc107",
  color: "black",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "5px",
};

const eliminarButton = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const thStyle = {
  padding: "12px",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};