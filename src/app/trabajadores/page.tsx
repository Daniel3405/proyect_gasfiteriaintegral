"use client";

import { useEffect, useState } from "react";

interface Trabajador {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  telefono: string;
  correo: string;
  estado: string;
}

export default function TrabajadoresPage() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");

  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  useEffect(() => {
    const datosGuardados = localStorage.getItem("trabajadores");

    if (datosGuardados) {
      setTrabajadores(JSON.parse(datosGuardados));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "trabajadores",
      JSON.stringify(trabajadores)
    );
  }, [trabajadores]);

  const editarTrabajador = (trabajador: Trabajador) => {
  setNombre(trabajador.nombre);
  setApellido(trabajador.apellido);
  setEspecialidad(trabajador.especialidad);
  setTelefono(trabajador.telefono);
  setCorreo(trabajador.correo);

  setEditandoId(trabajador.id);
};

  const trabajadoresFiltrados = trabajadores.filter(
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

 const guardarTrabajador = () => {
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

  if (editandoId !== null) {
    const actualizados = trabajadores.map((t) =>
      t.id === editandoId
        ? {
            ...t,
            nombre,
            apellido,
            especialidad,
            telefono,
            correo,
          }
        : t
    );

    setTrabajadores(actualizados);
    setEditandoId(null);

    alert("Trabajador actualizado");
  } else {
    const nuevoTrabajador: Trabajador = {
      id: Date.now(),
      nombre,
      apellido,
      especialidad,
      telefono,
      correo,
      estado: "Disponible",
    };

    setTrabajadores((prev) => [...prev, nuevoTrabajador]);

    alert("Trabajador guardado correctamente");
  }

  setNombre("");
  setApellido("");
  setEspecialidad("");
  setTelefono("");
  setCorreo("");
};
    
  const eliminarTrabajador = (id: number) => {
    if (!confirm("¿Desea eliminar este trabajador?")) {
      return;
    }

    setTrabajadores((prev) =>
      prev.filter((trabajador) => trabajador.id !== id)
    );
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

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            marginBottom: "25px",
          }}
        >
          <h2>Nuevo Trabajador</h2>

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
            Guardar Trabajador
          </button>
        </div>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
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
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
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
                      <button
                        onClick={() =>
                          eliminarTrabajador(trabajador.id)
                        }
                        style={eliminarButton}
                      >
                        Eliminar
                      </button>
                      <button
                    onClick={() => editarTrabajador(trabajador)}
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
