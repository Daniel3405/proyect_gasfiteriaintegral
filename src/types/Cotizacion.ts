export interface Cotizacion {
  id: number;
  solicitudId: number;
  materiales: string;
  cantidad: number;
  precioTotal: number;
  fechaEmision: string;
  estado: "Pendiente" | "Aprobada" | "Rechazada";
}