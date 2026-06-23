export type Servicio = {
  id: string;
  nombre: string;
  descripcion: string;
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
  precio: 0,
  duracion: "",
  estado: "Pendiente",
  trabajador: "",
  garantia: "Sin garantía",
};

export function loadServicios(): Servicio[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
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
