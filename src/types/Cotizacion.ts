export interface Cotizacion {
<<<<<<< Updated upstream
  id: number;
  solicitudId: string;
=======
  id: string;
  solicitudId: number;
>>>>>>> Stashed changes
  materiales: string;
  cantidad: number;
  precioTotal: number;
  fechaEmision: string;
  estado: "Pendiente" | "Aprobada" | "Rechazada";
}