export interface Cotizacion {
  id: string;
  solicitudId: string;
  materiales: string;
  cantidad: number;
  precioTotal: number;
  fechaEmision: string;
  estado: "Pendiente" | "Aprobada" | "Rechazada";
}
