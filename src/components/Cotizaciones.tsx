import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Cotizacion } from "../types/Cotizacion";

function Cotizaciones() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);

  useEffect(() => {
    const cargarCotizaciones = async () => {
      try {
        const snapshot = await getDocs(collection(db, "cotizaciones"));
        const listaCotizaciones = snapshot.docs.map((docu) => ({
          id: docu.id,
          ...(docu.data() as Omit<Cotizacion, "id">),
        }));
        setCotizaciones(listaCotizaciones);
      } catch (error) {
        console.error("Error cargando cotizaciones:", error);
      }
    };

    cargarCotizaciones();
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
