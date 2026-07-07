import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type Servicio = {
  id: string;
  nombre: string;
  descripcion: string;
  clienteNombre: string;
  clienteRut: string;
  clienteTelefono: string;
  precio: number;
  duracion: string;
  estado: string;
  trabajador: string;
  garantia: string;
};

export type ServicioFormState = Omit<Servicio, "id">;

export const initialFormState: ServicioFormState = {
  nombre: "",
  descripcion: "",
  clienteNombre: "",
  clienteRut: "",
  clienteTelefono: "",
  precio: 0,
  duracion: "",
  estado: "Pendiente",
  trabajador: "",
  garantia: "Sin garantía",
};

export function buildServicio(
  form: ServicioFormState,
  editingId: string | null
): Servicio {
  return {
    id: editingId ?? "",
    ...form,
  };
}

const coleccion = collection(db, "servicios");

export async function loadServicios(): Promise<Servicio[]> {
  const snapshot = await getDocs(coleccion);

  return snapshot.docs.map((documento) => ({
    id: documento.id,
    ...(documento.data() as Omit<Servicio, "id">),
  }));
}

export async function saveServicio(servicio: Servicio) {
  const { id, ...datos } = servicio;
  await addDoc(coleccion, datos);
}

export async function updateServicio(servicio: Servicio) {
  const { id, ...datos } = servicio;

  await updateDoc(doc(db, "servicios", id), datos);
}

export async function removeServicio(id: string) {
  await deleteDoc(doc(db, "servicios", id));
}