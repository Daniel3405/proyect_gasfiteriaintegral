"use client";

import { useEffect, useState } from "react";

interface Cotizacion {
  idCotizacion: number;
  idSolicitud: string;
  materiales: string;
  cantidad: number;
  precioTotal: number;
  fechaEmision: string;
  estado: string;
}

export default function CotizacionesPage() {
  const [idSolicitud, setIdSolicitud] = useState("");
  const [materiales, setMateriales] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precioTotal, setPrecioTotal] = useState("");
  const [fechaEmision, setFechaEmision] = useState("");
  const [estado, setEstado] = useState("Pendiente");

  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);

  // Cargar desde localStorage
  useEffect(() => {
    const datos = localStorage.getItem("cotizaciones");

    if (datos) {
      setCotizaciones(JSON.parse(datos));
    }
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem(
      "cotizaciones",
      JSON.stringify(cotizaciones)
    );
  }, [cotizaciones]);

  const guardarCotizacion = () => {
    if (
      !idSolicitud ||
      !materiales ||
      !cantidad ||
      !precioTotal ||
      !fechaEmision
    ) {
      alert("Complete todos los campos");
      return;
    }

    const nuevaCotizacion: Cotizacion = {
      idCotizacion: Date.now(),
      idSolicitud,
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

    setIdSolicitud("");
    setMateriales("");
    setCantidad("");
    setPrecioTotal("");
    setFechaEmision("");
    setEstado("Pendiente");

    alert("Cotización guardada correctamente");
  };

  const eliminarCotizacion = (
    idCotizacion: number
  ) => {
    const confirmar = confirm(
      "¿Desea eliminar esta cotización?"
    );

    if (!confirmar) return;

    setCotizaciones((prev) =>
      prev.filter(
        (cotizacion) =>
          cotizacion.idCotizacion !== idCotizacion
      )
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Cotizaciones</h1>

      <input
        type="text"
        placeholder="ID Solicitud"
        value={idSolicitud}
        onChange={(e) =>
          setIdSolicitud(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Materiales Incluidos"
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
          setEstado(e.target.value)
        }
      >
        <option>Pendiente</option>
        <option>Aprobada</option>
        <option>Rechazada</option>
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
            key={cotizacion.idCotizacion}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <h3>
              Cotización #{cotizacion.idCotizacion}
            </h3>

            <p>
              <strong>ID Solicitud:</strong>{" "}
              {cotizacion.idSolicitud}
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
                  cotizacion.idCotizacion
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