"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Cotizacion } from "@/types/Cotizacion";
import { Servicio } from "@/types/Servicios";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CotizacionesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const esAdmin = user?.role === "admin";

  const [solicitudId, setSolicitudId] = useState("");
  const [materiales, setMateriales] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precioTotal, setPrecioTotal] = useState("");
  const [fechaEmision, setFechaEmision] = useState("");

  const [estado, setEstado] = useState<"Pendiente" | "Aprobada" | "Rechazada">("Pendiente");
  const [selectedCotizacion, setSelectedCotizacion] = useState<Cotizacion | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [services, setServicios] = useState<Servicio[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
    }
  }, [user, router, isLoading]);

  const cargarCotizaciones = async () => {
    try {
      const snapshot = await getDocs(collection(db, "cotizaciones"));
      const listaCotizaciones: Cotizacion[] = snapshot.docs.map((docu) => ({
        id: docu.id,
        ...(docu.data() as Omit<Cotizacion, "id">),
      }));
      setCotizaciones(listaCotizaciones);
    } catch (error) {
      console.error("Error cargando cotizaciones:", error);
    }
  };

  const cargarServicios = async () => {
    try {
      const snapshotServicios = await getDocs(collection(db, "servicios"));
      const listaServicios: Servicio[] = snapshotServicios.docs.map((docu) => {
        const data = docu.data();
        return {
          id: docu.id,
          nombre: data.nombre || "",
          descripcion: data.descripcion || "",
          clienteNombre: data.clienteNombre || "",
          clienteRut: data.clienteRut || "",
          clienteTelefono: data.clienteTelefono || "",
          precio: data.precio || 0,
          duracion: data.duracion || "",
          estado: data.estado || "Pendiente",
          trabajador: data.trabajador || "",
          garantia: data.garantia || "Sin garantía",
        };
      });
      setServicios(listaServicios);
    } catch (error) {
      console.error("Error cargando servicios:", error);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!user) return;

    cargarCotizaciones();
    cargarServicios();
  }, [user, isLoading]);

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
    const visibles = esAdmin
      ? cotizaciones
      : cotizaciones.filter((cotizacion) =>
          services.some(
            (servicio) =>
              servicio.id === cotizacion.solicitudId &&
              servicio.clienteNombre === user?.nombre &&
              servicio.clienteRut === user?.rut
          )
        );

    return visibles.filter(
      (cotizacion) =>
        cotizacion.materiales.toLowerCase().includes(busqueda.toLowerCase()) ||
        cotizacion.estado.toLowerCase().includes(busqueda.toLowerCase()) ||
        cotizacion.solicitudId.includes(busqueda)
    );
  }, [busqueda, cotizaciones, services, esAdmin, user?.nombre, user?.rut]);

  const guardarCotizacion = async () => {
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

    try {
      if (editandoId !== null) {
        await updateDoc(doc(db, "cotizaciones", editandoId), {
          solicitudId,
          materiales,
          cantidad: Number(cantidad),
          precioTotal: Number(precioTotal),
          fechaEmision,
          estado,
        });
        alert("Cotización actualizada");
      } else {
        await addDoc(collection(db, "cotizaciones"), {
          solicitudId,
          materiales,
          cantidad: Number(cantidad),
          precioTotal: Number(precioTotal),
          fechaEmision,
          estado,
        });
        alert("Cotización guardada correctamente");
      }

      setSolicitudId("");
      setMateriales("");
      setCantidad("");
      setPrecioTotal("");
      setFechaEmision("");
      setEstado("Pendiente");
      setEditandoId(null);
      await cargarCotizaciones();
    } catch (error) {
      console.error("Error guardando cotización:", error);
      alert("Error al guardar cotización");
    }
  };

  const eliminarCotizacion = async (id: string) => {
    if (!confirm("¿Desea eliminar esta cotización?")) return;

    try {
      await deleteDoc(doc(db, "cotizaciones", id));
      setCotizaciones((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error eliminando cotización:", error);
      alert("Error al eliminar cotización");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
        padding: "30px",
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
            marginBottom: "20px",
          }}
        >
          💰 Gestión de Cotizaciones
        </h1>

        {esAdmin && (
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              marginBottom: "25px",
            }}
          >
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

            <input
              value={materiales}
              onChange={(e) => setMateriales(e.target.value)}
              placeholder="Materiales"
              style={inputStyle}
            />

            <input
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              placeholder="Cantidad"
              style={inputStyle}
            />

            <input
              value={precioTotal}
              onChange={(e) => setPrecioTotal(e.target.value)}
              placeholder="Precio Total"
              style={inputStyle}
            />

            <input
              type="date"
              value={fechaEmision}
              onChange={(e) => setFechaEmision(e.target.value)}
              style={inputStyle}
            />

            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as "Pendiente" | "Aprobada" | "Rechazada")}
              style={inputStyle}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobada">Aprobada</option>
              <option value="Rechazada">Rechazada</option>
            </select>

            <button onClick={guardarCotizacion} style={guardarButton}>
              {editandoId ? "Actualizar Cotización" : "Guardar Cotización"}
            </button>
          </div>
        )}

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h2>Cotizaciones Registradas ({cotizacionesFiltradas.length})</h2>

          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="🔍 Buscar..."
            style={inputStyle}
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
                      <button onClick={() => verDetalles(cotizacion)} style={detalleButton}>
                        Ver detalles
                      </button>
                      {esAdmin && (
                        <>
                          <button onClick={() => editarCotizacion(cotizacion)} style={editarButton}>
                            Editar
                          </button>
                          <button onClick={() => eliminarCotizacion(cotizacion.id)} style={eliminarButton}>
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
              <h2>Detalle de Cotización</h2>
              <p>
                <strong>Materiales:</strong> {selectedCotizacion.materiales}
              </p>
              <p>
                <strong>Cantidad:</strong> {selectedCotizacion.cantidad}
              </p>
              <p>
                <strong>Precio:</strong> ${selectedCotizacion.precioTotal.toLocaleString("es-CL")}
              </p>
              {services.find((service) => service.id === selectedCotizacion.solicitudId) ? (
                <>
                  <h3>Solicitud vinculada</h3>
                  <p>
                    <strong>Servicio:</strong>{" "}
                    {services.find((service) => service.id === selectedCotizacion.solicitudId)?.nombre}
                  </p>
                  <p>
                    <strong>Cliente:</strong>{" "}
                    {services.find((service) => service.id === selectedCotizacion.solicitudId)?.clienteNombre}
                  </p>
                  <p>
                    <strong>Trabajador:</strong>{" "}
                    {services.find((service) => service.id === selectedCotizacion.solicitudId)?.trabajador || "Sin asignar"}
                  </p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    {services.find((service) => service.id === selectedCotizacion.solicitudId)?.estado}
                  </p>
                </>
              ) : (
                <p>No se encontró la solicitud vinculada.</p>
              )}
              <button onClick={() => setShowDetails(false)} style={cerrarButton}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const guardarButton: CSSProperties = {
  backgroundColor: "#0f4c81",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  cursor: "pointer",
};

const editarButton: CSSProperties = {
  backgroundColor: "#ffc107",
  color: "black",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const eliminarButton: CSSProperties = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const detalleButton: CSSProperties = {
  backgroundColor: "#0f4c81",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
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
};

const thStyle: CSSProperties = {
  padding: "12px",
};

const tdStyle: CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};
