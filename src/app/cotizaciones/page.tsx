"use client";

import { useState, useEffect } from "react";
import { Cotizacion } from "@/types/Cotizacion";

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] =
    useState<Cotizacion[]>([]);

  const [precioTotal, setPrecioTotal] =
    useState("");

  useEffect(() => {
    const data =
      localStorage.getItem("cotizaciones");

    if (data) {
      setCotizaciones(JSON.parse(data));
    }
  }, []);

  const agregarCotizacion = () => {
    const nueva: Cotizacion = {
      id: Date.now(),
      solicitudId: 1,
      materiales: "PVC",
      cantidad: 1,
      precioTotal: Number(precioTotal),
      fechaEmision: new Date()
        .toISOString()
        .split("T")[0],
      estado: "Pendiente",
    };

    const lista = [...cotizaciones, nueva];

    setCotizaciones(lista);

    localStorage.setItem(
      "cotizaciones",
      JSON.stringify(lista)
    );

    setPrecioTotal("");
  };

  return (
    <div>
      <h1>Cotizaciones</h1>

      <input
        type="number"
        value={precioTotal}
        onChange={(e) =>
          setPrecioTotal(e.target.value)
        }
        placeholder="Precio"
      />

      <button onClick={agregarCotizacion}>
        Agregar
      </button>

      {cotizaciones.map((cotizacion) => (
        <div key={cotizacion.id}>
          <p>
            ${cotizacion.precioTotal}
          </p>
        </div>
      ))}
    </div>
  );
}