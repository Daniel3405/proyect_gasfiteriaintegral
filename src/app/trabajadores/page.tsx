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

  // Cargar datos desde localStorage
  useEffect(() => {
    const datosGuardados = localStorage.getItem("trabajadores");

    if (datosGuardados) {
      setTrabajadores(JSON.parse(datosGuardados));
    }
  }, []);

  // Guardar datos en localStorage
  useEffect(() => {
    localStorage.setItem(
      "trabajadores",
      JSON.stringify(trabajadores)
    );
  }, [trabajadores]);

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

    setNombre("");
    setApellido("");
    setEspecialidad("");
    setTelefono("");
    setCorreo("");

    alert("Trabajador guardado correctamente");
  };

  const eliminarTrabajador = (id: number) => {
    const confirmar = confirm(
      "¿Desea eliminar este trabajador?"
    );

    if (!confirmar) return;

    setTrabajadores((prev) =>
      prev.filter(
        (trabajador) => trabajador.id !== id
      )
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Trabajadores</h1>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Especialidad"
        value={especialidad}
        onChange={(e) => setEspecialidad(e.target.value)}
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />

      <br />
      <br />

      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />

      <br />
      <br />

      <button onClick={guardarTrabajador}>
        Guardar Trabajador
      </button>

      <hr />

      <h2>Listado de Trabajadores</h2>

      {trabajadores.length === 0 ? (
        <p>No existen trabajadores registrados.</p>
      ) : (
        trabajadores.map((trabajador) => (
          <div
            key={trabajador.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <h3>
              {trabajador.nombre}{" "}
              {trabajador.apellido}
            </h3>

            <p>
              <strong>Especialidad:</strong>{" "}
              {trabajador.especialidad}
            </p>

            <p>
              <strong>Teléfono:</strong>{" "}
              {trabajador.telefono}
            </p>

            <p>
              <strong>Correo:</strong>{" "}
              {trabajador.correo}
            </p>

            <p>
              <strong>Estado:</strong>{" "}
              {trabajador.estado}
            </p>

            <button
              onClick={() =>
                eliminarTrabajador(
                  trabajador.id
                )
              }
            >
              Eliminar
            </button>
          </div>
        ))
      )}
    </div>
  );
}