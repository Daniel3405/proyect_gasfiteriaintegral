"use client";

import { useEffect, useState } from "react";
import { Cotizacion } from "@/types/Cotizacion";

export default function CotizacionesPage() {
  const [solicitudId, setSolicitudId] = useState("");
  const [materiales, setMateriales] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precioTotal, setPrecioTotal] = useState("");
  const [fechaEmision, setFechaEmision] = useState("");
  const [estado, setEstado] = useState<
    "Pendiente" | "Aprobada" | "Rechazada"
  >("Pendiente");

  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);

  // Cargar cotizaciones
  useEffect(() => {
    const datosGuardados = localStorage.getItem("cotizaciones");

    if (datosGuardados) {
      setCotizaciones(JSON.parse(datosGuardados));
    }
  }, []);

  // Guardar cotizaciones
  useEffect(() => {
    localStorage.setItem(
      "cotizaciones",
      JSON.stringify(cotizaciones)
    );
  }, [cotizaciones]);

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

    const nuevaCotizacion: Cotizacion = {
      id: Date.now(),
      solicitudId: Number(solicitudId),
      materiales,
      cantidad: Number(cantidad),
      precioTotal: Number(precioTotal),
      fechaEmision,
      estado,
    };

    setCotizaciones((prev) => [
      ...prev,
      nuevaCotizacion,
    ]);

    setSolicitudId("");
    setMateriales("");
    setCantidad("");
    setPrecioTotal("");
    setFechaEmision("");
    setEstado("Pendiente");

    alert("Cotización guardada correctamente");
  };

  const eliminarCotizacion = (id: number) => {
    const confirmar = confirm(
      "¿Desea eliminar esta cotización?"
    );

    if (!confirmar) return;

    setCotizaciones((prev) =>
      prev.filter(
        (cotizacion) => cotizacion.id !== id
      )
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Cotizaciones</h1>

      <input
        type="number"
        placeholder="ID Solicitud"
        value={solicitudId}
        onChange={(e) =>
          setSolicitudId(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Materiales incluidos"
        value={materiales}
        onChange={(e) =>
          setMateriales(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Cantidad"
        value={cantidad}
        onChange={(e) =>
          setCantidad(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="number"
        placeholder="Precio Total"
        value={precioTotal}
        onChange={(e) =>
          setPrecioTotal(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="date"
        value={fechaEmision}
        onChange={(e) =>
          setFechaEmision(e.target.value)
        }
      />

      <br />
      <br />

      <select
        value={estado}
        onChange={(e) =>
          setEstado(
            e.target.value as
              | "Pendiente"
              | "Aprobada"
              | "Rechazada"
          )
        }
      >
        <option value="Pendiente">
          Pendiente
        </option>
        <option value="Aprobada">
          Aprobada
        </option>
        <option value="Rechazada">
          Rechazada
        </option>
      </select>

      <br />
      <br />

      <button onClick={guardarCotizacion}>
        Guardar Cotización
      </button>

      <hr />

      <h2>Listado de Cotizaciones</h2>

      {cotizaciones.length === 0 ? (
        <p>No existen cotizaciones registradas.</p>
      ) : (
        cotizaciones.map((cotizacion) => (
          <div
            key={cotizacion.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <h3>
              Cotización #{cotizacion.id}
            </h3>

            <p>
              <strong>ID Solicitud:</strong>{" "}
              {cotizacion.solicitudId}
            </p>

            <p>
              <strong>Materiales:</strong>{" "}
              {cotizacion.materiales}
            </p>

            <p>
              <strong>Cantidad:</strong>{" "}
              {cotizacion.cantidad}
            </p>

            <p>
              <strong>Precio Total:</strong> $
              {cotizacion.precioTotal}
            </p>

            <p>
              <strong>Fecha:</strong>{" "}
              {cotizacion.fechaEmision}
            </p>

            <p>
              <strong>Estado:</strong>{" "}
              {cotizacion.estado}
            </p>

            <button
              onClick={() =>
                eliminarCotizacion(
                  cotizacion.id
                )
              }
            >
              Eliminar
            </button>
          </div>
        ))
      )}
    </div>
  );
}