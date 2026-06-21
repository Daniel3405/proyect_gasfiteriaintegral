export interface Trabajador {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
  correo: string;
  estado: "Disponible" | "Ocupado" | "Vacaciones";
}