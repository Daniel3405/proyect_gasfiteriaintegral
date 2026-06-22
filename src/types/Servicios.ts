export type Service = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: string;
  estado: string;
  trabajador: string;
  garantia: string;
};

export type ServiceFormState = Omit<Service, "id">;

export const STORAGE_KEY = "gasfiteria-servicios";

export const initialFormState: ServiceFormState = {
  nombre: "",
  descripcion: "",
  precio: 0,
  duracion: "",
  estado: "Pendiente",
  trabajador: "",
  garantia: "Sin garantía",
};

export function loadServices(): Service[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveServices(services: Service[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
}

export function buildService(form: ServiceFormState, editingId: string | null): Service {
  return {
    id: editingId ?? `${Date.now()}`,
    ...form,
  };
}

export function updateService(services: Service[], newService: Service): Service[] {
  return services.map((item) => (item.id === newService.id ? newService : item));
}

export function removeService(services: Service[], id: string): Service[] {
  return services.filter((service) => service.id !== id);
}
