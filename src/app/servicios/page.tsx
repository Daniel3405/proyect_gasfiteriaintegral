"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

type Service = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: string;
  estado: string;
  trabajador: string;
  garantia: string;
};

const STORAGE_KEY = "gasfiteria-servicios";

const initialFormState = {
  nombre: "",
  descripcion: "",
  precio: 0,
  duracion: "",
  estado: "Pendiente",
  trabajador: "",
  garantia: "Sin garantía",
};

export default function ServiciosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState(initialFormState);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setServices(JSON.parse(stored));
    } else {
      setServices([]);
    }
  }, [router, user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
  }, [services]);

  const filteredServices = useMemo(
    () =>
      services.filter((service) =>
        [service.nombre, service.descripcion, service.trabajador, service.estado]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase().trim())
      ),
    [search, services]
  );

  const handleChange = (
    field: keyof typeof initialFormState,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.nombre.trim() || !form.descripcion.trim() || !form.trabajador.trim()) {
      setError("Completa nombre, descripción y trabajador.");
      return;
    }

    if (form.precio <= 0) {
      setError("El precio debe ser mayor a 0.");
      return;
    }

    const newService: Service = {
      id: editingId ?? `${Date.now()}`,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      duracion: form.duracion.trim(),
      estado: form.estado,
      trabajador: form.trabajador.trim(),
      garantia: form.garantia,
    };

    if (editingId) {
      setServices((prev) =>
        prev.map((item) => (item.id === editingId ? newService : item))
      );
    } else {
      setServices((prev) => [...prev, newService]);
    }

    resetForm();
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setForm({
      nombre: service.nombre,
      descripcion: service.descripcion,
      precio: service.precio,
      duracion: service.duracion,
      estado: service.estado,
      trabajador: service.trabajador,
      garantia: service.garantia,
    });
  };

  const handleDelete = (id: string) => {
    const confirmed = confirm("¿Eliminar este servicio?");
    if (!confirmed) return;
    setServices((prev) => prev.filter((service) => service.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "1100px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1>Gestión de servicios</h1>
        <p>Usuario: {user?.name}</p>
      </header>

      <section style={{ marginBottom: "2rem" }}>
        <h2>{editingId ? "Editar servicio" : "Agregar servicio"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
          <div>
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              value={form.nombre}
              onChange={(event) => handleChange("nombre", event.target.value)}
              style={{ width: "100%", padding: "0.75rem", marginTop: "0.4rem" }}
            />
          </div>

          <div>
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              value={form.descripcion}
              onChange={(event) => handleChange("descripcion", event.target.value)}
              style={{ width: "100%", padding: "0.75rem", marginTop: "0.4rem" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label htmlFor="precio">Precio</label>
              <input
                id="precio"
                type="number"
                value={form.precio}
                onChange={(event) => handleChange("precio", Number(event.target.value))}
                style={{ width: "100%", padding: "0.75rem", marginTop: "0.4rem" }}
              />
            </div>

            <div>
              <label htmlFor="duracion">Duración</label>
              <input
                id="duracion"
                value={form.duracion}
                onChange={(event) => handleChange("duracion", event.target.value)}
                style={{ width: "100%", padding: "0.75rem", marginTop: "0.4rem" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                value={form.estado}
                onChange={(event) => handleChange("estado", event.target.value)}
                style={{ width: "100%", padding: "0.75rem", marginTop: "0.4rem" }}
              >
                <option>Pendiente</option>
                <option>En progreso</option>
                <option>Finalizado</option>
              </select>
            </div>

            <div>
              <label htmlFor="trabajador">Trabajador asociado</label>
              <input
                id="trabajador"
                value={form.trabajador}
                onChange={(event) => handleChange("trabajador", event.target.value)}
                style={{ width: "100%", padding: "0.75rem", marginTop: "0.4rem" }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="garantia">Garantía</label>
            <input
              id="garantia"
              value={form.garantia}
              onChange={(event) => handleChange("garantia", event.target.value)}
              style={{ width: "100%", padding: "0.75rem", marginTop: "0.4rem" }}
            />
          </div>

          {error && <div style={{ color: "crimson" }}>{error}</div>}

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              type="submit"
              style={{ padding: "0.85rem 1.2rem", background: "#0f4c81", color: "#fff", border: "none", cursor: "pointer" }}
            >
              {editingId ? "Guardar cambios" : "Crear servicio"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                style={{ padding: "0.85rem 1.2rem", background: "#999", color: "#fff", border: "none", cursor: "pointer" }}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2>Listado de servicios</h2>
          <input
            type="search"
            placeholder="Buscar servicios..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ padding: "0.75rem", width: "240px" }}
          />
        </div>

        {filteredServices.length === 0 ? (
          <p>No hay servicios que coincidan.</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {filteredServices.map((service) => (
              <article
                key={service.id}
                style={{
                  border: "1px solid #fc6666",
                  borderRadius: "12px",
                  padding: "1rem",
                  background: "#f37676",
                }}
              >
                <h3>{service.nombre}</h3>
                <p>{service.descripcion}</p>
                <p>
                  <strong>Precio:</strong> ${service.precio.toLocaleString()}
                </p>
                <p>
                  <strong>Duración:</strong> {service.duracion || "Sin duración"}
                </p>
                <p>
                  <strong>Estado:</strong> {service.estado}
                </p>
                <p>
                  <strong>Trabajador:</strong> {service.trabajador}
                </p>
                <p>
                  <strong>Garantía:</strong> {service.garantia}
                </p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
                  <button
                    type="button"
                    onClick={() => handleEdit(service)}
                    style={{ padding: "0.65rem 1rem", background: "#0f4c81", color: "#fff", border: "none", cursor: "pointer" }}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(service.id)}
                    style={{ padding: "0.65rem 1rem", background: "#c0392b", color: "#fff", border: "none", cursor: "pointer" }}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}