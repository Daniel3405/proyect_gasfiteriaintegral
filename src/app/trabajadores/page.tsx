"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

interface Trabajador {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
  correo: string;
  estado: string;
}

export default function TrabajadoresPage() {
  const { user } = useAuth();
  const router = useRouter();

  const esAdmin = user?.role === "admin";

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");

  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }
  }, [user, router]);

  useEffect(() => {
    cargarTrabajadores();
  }, []);

  const cargarTrabajadores = async () => {
    try {
      const snapshot = await getDocs(collection(db, "trabajadores"));

      const lista: Trabajador[] = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...(documento.data() as Omit<Trabajador, "id">),
      }));

      setTrabajadores(lista);
    } catch (error) {
      console.error(error);
    }
  };

  const editarTrabajador = (trabajador: Trabajador) => {
    setNombre(trabajador.nombre);
    setApellido(trabajador.apellido);
    setEspecialidad(trabajador.especialidad);
    setTelefono(trabajador.telefono);
    setCorreo(trabajador.correo);

    setEditandoId(trabajador.id);
  };

  const trabajadoresVisibles = esAdmin
    ? trabajadores
    : trabajadores.filter(
        (trabajador) => trabajador.estado === "Disponible"
      );

  const trabajadoresFiltrados = trabajadoresVisibles.filter(
    (trabajador) =>
      trabajador.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      trabajador.apellido
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      trabajador.especialidad
        .toLowerCase()
        .includes(busqueda.toLowerCase())
  );

  const guardarTrabajador = async () => {
    if (
      !nombre.trim() ||
      !apellido.trim() ||
      !especialidad.trim() ||
      !telefono.trim() ||
      !correo.trim()
    ) {
      alert("Complete todos los campos");
      return;
    }

    const datos = {
      nombre,
      apellido,
      especialidad,
      telefono,
      correo,
      estado: "Disponible",
    };

    try {
      if (editandoId) {
        await updateDoc(
          doc(db, "trabajadores", editandoId),
          datos
        );

        alert("Trabajador actualizado");
      } else {
        await addDoc(
          collection(db, "trabajadores"),
          datos
        );

        alert("Trabajador guardado correctamente");
      }

      await cargarTrabajadores();

      setEditandoId(null);
      setNombre("");
      setApellido("");
      setEspecialidad("");
      setTelefono("");
      setCorreo("");

    } catch (error) {
      console.error(error);
      alert("Error al guardar trabajador");
    }
  };

  const eliminarTrabajador = async (id: string) => {
    if (!confirm("¿Desea eliminar este trabajador?")) return;

    try {
      await deleteDoc(doc(db, "trabajadores", id));

      alert("Trabajador eliminado correctamente");

      await cargarTrabajadores();

      if (editandoId === id) {
        setEditandoId(null);
        setNombre("");
        setApellido("");
        setEspecialidad("");
        setTelefono("");
        setCorreo("");
      }

    } catch (error) {
      console.error(error);
      alert("Error al eliminar trabajador");
    }
  };
  return (
  <div
    style={{
      backgroundColor: "#f4f6f9",
      minHeight: "100vh",
      padding: "30px",
    }}
  >
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          color: "#0f4c81",
          marginBottom: "20px",
        }}
      >
        👷 Gestión de Trabajadores
      </h1>

      {esAdmin && (
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            marginBottom: "25px",
          }}
        >
          <h2>
            {editandoId
              ? "Editar Trabajador"
              : "Nuevo Trabajador"}
          </h2>

          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Especialidad"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            style={inputStyle}
          />

          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            style={inputStyle}
          />

          <button
            onClick={guardarTrabajador}
            style={guardarButton}
          >
            {editandoId
              ? "Actualizar Trabajador"
              : "Guardar Trabajador"}
          </button>
        </div>
      )}

      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2>
          Trabajadores Registrados ({trabajadores.length})
        </h2>

        <input
          type="text"
          placeholder="🔍 Buscar trabajador..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={inputStyle}
        />

        {trabajadoresFiltrados.length === 0 ? (
          <p>No existen trabajadores registrados.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "15px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#0f4c81",
                  color: "white",
                }}
              >
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>Especialidad</th>
                <th style={thStyle}>Teléfono</th>
                <th style={thStyle}>Correo</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Acción</th>
              </tr>
            </thead>

            <tbody>
              {trabajadoresFiltrados.map((trabajador) => (
                <tr key={trabajador.id}>
                  <td style={tdStyle}>
                    {trabajador.nombre} {trabajador.apellido}
                  </td>

                  <td style={tdStyle}>
                    {trabajador.especialidad}
                  </td>

                  <td style={tdStyle}>
                    {trabajador.telefono}
                  </td>

                  <td style={tdStyle}>
                    {trabajador.correo}
                  </td>

                  <td style={tdStyle}>
                    {trabajador.estado}
                  </td>

                  <td style={tdStyle}>
                    {esAdmin && (
                      <>
                        <button
                          onClick={() =>
                            editarTrabajador(trabajador)
                          }
                          style={{
                            backgroundColor: "#ffc107",
                            color: "black",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            marginRight: "5px",
                          }}
                        >
                          Editar
                        </button>

                        <button
                          onClick={() =>
                            eliminarTrabajador(trabajador.id)
                          }
                          style={eliminarButton}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>
);

}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const guardarButton = {
  backgroundColor: "#0f4c81",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  cursor: "pointer",
};

const eliminarButton = {
  backgroundColor: "#dc3545",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const thStyle = {
  padding: "12px",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};