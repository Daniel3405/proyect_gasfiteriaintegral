export interface Cotizacion {
  id: number;
  solicitudId: string;
  materiales: string;
  cantidad: number;
  precioTotal: number;
  fechaEmision: string;
  estado: "Pendiente" | "Aprobada" | "Rechazada";
}