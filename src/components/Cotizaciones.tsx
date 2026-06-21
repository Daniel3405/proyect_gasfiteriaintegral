import { useState, useEffect } from "react";
import { Cotizacion } from "../types/Cotizacion";

function Cotizaciones() {
  const [cotizaciones, setCotizaciones] =
    useState<Cotizacion[]>([]);

  useEffect(() => {
    const data =
      localStorage.getItem("cotizaciones");

    if (data) {
      setCotizaciones(JSON.parse(data));
    }
  }, []);

  return (
    <>
      <h1>Cotizaciones</h1>

      {cotizaciones.map((cotizacion) => (
        <div key={cotizacion.id}>
          ${cotizacion.precioTotal}
        </div>
      ))}
    </>
  );
}

export default Cotizaciones;