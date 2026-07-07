"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Cotizacion } from "@/types/Cotizacion";
import { Servicio, loadServicios } from "@/types/Servicios";

export default function CotizacionesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const esAdmin = user?.role === "admin";
  const [solicitudId, setSolicitudId] = useState("");
  const [materiales, setMateriales] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precioTotal, setPrecioTotal] = useState("");
  const [fechaEmision, setFechaEmision] = useState("");
  const [estado, setEstado] = useState<
    "Pendiente" | "Aprobada" | "Rechazada"
  >("Pendiente");
  const [selectedCotizacion, setSelectedCotizacion] = useState<Cotizacion | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>(() => {
      const datosGuardados = localStorage.getItem("cotizaciones");
    return datosGuardados ? JSON.parse(datosGuardados) : [];
  });
  const [services, setServicios] = useState<Servicio[]>(() => {
    if (typeof window === "undefined") return [];
    const datos = localStorage.getItem("gasfiteria-servicios");
    return datos ? JSON.parse(datos) : [];
  });
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
    localStorage.setItem("cotizaciones", JSON.stringify(cotizaciones));
  }, [cotizaciones]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const datos = localStorage.getItem("gasfiteria-servicios");
    if (datos) {
      setServicios(JSON.parse(datos));
    }
  }, []);

  const editarCotizacion = (cotizacion: Cotizacion) => {
    setSolicitudId(cotizacion.solicitudId);
    setMateriales(cotizacion.materiales);
    setCantidad(cotizacion.cantidad.toString());
    setPrecioTotal(cotizacion.precioTotal.toString());
    setFechaEmision(cotizacion.fechaEmision);
    setEstado(cotizacion.estado);

    setEditandoId(cotizacion.id);
  };

  const verDetalles = (cotizacion: Cotizacion) => {
    setSelectedCotizacion(cotizacion);
    setShowDetails(true);
  };

  const cotizacionesFiltradas = useMemo(() => {
    const visible = esAdmin
      ? cotizaciones
      : cotizaciones.filter((cotizacion) =>
          services.some(
            (servicio) =>
              servicio.id === cotizacion.solicitudId &&
              servicio.clienteNombre === user?.nombre &&
              servicio.clienteRut === user?.rut
          )
        );

    return visible.filter(
      (cotizacion) =>
        cotizacion.materiales.toLowerCase().includes(busqueda.toLowerCase()) ||
        cotizacion.estado.toLowerCase().includes(busqueda.toLowerCase()) ||
        cotizacion.solicitudId.includes(busqueda)
    );
  }, [busqueda, cotizaciones, esAdmin, services, user?.nombre, user?.rut]);

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
              solicitudId,
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
        solicitudId,
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
        {esAdmin && (
          <div style={{ background: "white", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", marginBottom: "25px" }}>
            <h2>Nueva Cotización</h2>

            <select
              value={solicitudId}
              onChange={(e) => setSolicitudId(e.target.value)}
              style={inputStyle}
            >
              <option value="">Selecciona una solicitud</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.nombre} ({service.id})
                </option>
              ))}
            </select>
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
        )}

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
                        onClick={() => verDetalles(cotizacion)}
                        style={detalleButton}
                      >
                        Ver detalles
                      </button>
                      {esAdmin && (
                        <>
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
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showDetails && selectedCotizacion && (
          <div style={modalOverlayStyle}>
            <div style={modalStyle}>
              <h2>Detalles de Cotización</h2>
              <p><strong>N° Cotización:</strong> {selectedCotizacion.id}</p>
              <p><strong>N° Solicitud:</strong> {selectedCotizacion.solicitudId}</p>
              <p><strong>Materiales:</strong> {selectedCotizacion.materiales}</p>
              <p><strong>Cantidad:</strong> {selectedCotizacion.cantidad}</p>
              <p><strong>Precio Total:</strong> ${selectedCotizacion.precioTotal.toLocaleString("es-CL")}</p>
              <p><strong>Fecha Emisión:</strong> {selectedCotizacion.fechaEmision}</p>
              <p><strong>Estado:</strong> {selectedCotizacion.estado}</p>
              {services.find((service) => service.id === selectedCotizacion.solicitudId) ? (
                <>
                  <h3>Solicitud vinculada</h3>
                  <p><strong>Servicio:</strong> {services.find((service) => service.id === selectedCotizacion.solicitudId)?.nombre}</p>
                  <p><strong>Cliente:</strong> {services.find((service) => service.id === selectedCotizacion.solicitudId)?.clienteNombre}</p>
                  <p><strong>Trabajador:</strong> {services.find((service) => service.id === selectedCotizacion.solicitudId)?.trabajador || "Sin asignar"}</p>
                  <p><strong>Estado solicitud:</strong> {services.find((service) => service.id === selectedCotizacion.solicitudId)?.estado}</p>
                </>
              ) : (
                <p>No se encontró la solicitud vinculada.</p>
              )}
              <button onClick={() => setShowDetails(false)} style={cerrarButton}>Cerrar</button>
            </div>
          </div>
        )}
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

const detalleButton = {
  backgroundColor: "#0f4c81",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "5px",
};

const modalOverlayStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle: CSSProperties = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "15px",
  width: "90%",
  maxWidth: "600px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

const cerrarButton: CSSProperties = {
  backgroundColor: "#6c757d",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  marginTop: "20px",
};

const thStyle = {
  padding: "12px",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};