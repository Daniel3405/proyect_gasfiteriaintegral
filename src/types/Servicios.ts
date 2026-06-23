export type Servicio = {
  id: string;
  nombre: string;
  descripcion: string;
  telefono: string;
  rut: string;
  precio: number;
  duracion: string;
  estado: string;
  trabajador: string;
  garantia: string;
};

export type ServicioFormState = Omit<Servicio, "id">;

export const STORAGE_KEY = "gasfiteria-servicios";

export const initialFormState: ServicioFormState = {
  nombre: "",
  descripcion: "",
  telefono: "",
  rut: "",
  precio: 0,
  duracion: "",
  estado: "Pendiente",
  trabajador: "",
  garantia: "Sin garantía",
};

export function loadServicios(): Servicio[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  return JSON.parse(stored).map((item: any) => ({
    clienteNombre: item.clienteNombre || "",
    clienteRut: item.clienteRut || "",
    clienteTelefono: item.clienteTelefono || "",
    nombre: item.nombre || "",
    descripcion: item.descripcion || "",
    precio: item.precio ?? 0,
    duracion: item.duracion || "",
    estado: item.estado || "Pendiente",
    trabajador: item.trabajador || "",
    garantia: item.garantia || "Sin garantía",
    id: item.id ?? `${Date.now()}`,
  }));
}

export function saveServicios(services: Servicio[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
}

export function buildServicio(form: ServicioFormState, editingId: string | null): Servicio {
  return {
    id: editingId ?? `${Date.now()}`,
    ...form,
  };
}

export function updateServicios(servicio: Servicio[], nServicio: Servicio): Servicio[] {
  return servicio.map((item) => (item.id === nServicio.id ? nServicio : item));
}

export function removeServicios(servicio: Servicio[], id: string): Servicio[] {
  return servicio.filter((servicio) => servicio.id !== id);
}
