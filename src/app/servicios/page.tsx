"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import styles from "./servicios.module.css";
import {
  Service,
  ServiceFormState,
  initialFormState,
  loadServices,
  saveServices,
  buildService,
  updateService,
  removeService,
} from "../../types/Servicios";

export default function ServiciosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(() => loadServices());
  const [form, setForm] = useState<ServiceFormState>(initialFormState);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [router, user]);

  useEffect(() => {
    saveServices(services);
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
      setServices((prev) => updateService(prev, newService));
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
    setServices((prev) => removeService(prev, id));
    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>Gestión de servicios</h1>
        <p>Usuario: {user?.name}</p>
      </header>

      <section className={styles.section}>
        <h2>{editingId ? "Editar servicio" : "Agregar servicio"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              value={form.nombre}
              onChange={(event) => handleChange("nombre", event.target.value)}
              className={styles.input}
            />
          </div>

          <div>
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              value={form.descripcion}
              onChange={(event) => handleChange("descripcion", event.target.value)}
              className={styles.textarea}
            />
          </div>

          <div className={styles.gridTwo}>
            <div>
              <label htmlFor="precio">Precio</label>
              <input
                id="precio"
                type="number"
                value={form.precio}
                onChange={(event) => handleChange("precio", Number(event.target.value))}
                className={styles.input}
              />
            </div>

            <div>
              <label htmlFor="duracion">Duración</label>
              <input
                id="duracion"
                value={form.duracion}
                onChange={(event) => handleChange("duracion", event.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.gridTwo}>
            <div>
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                value={form.estado}
                onChange={(event) => handleChange("estado", event.target.value)}
                className={styles.input}
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
                className={styles.input}
              />
            </div>
          </div>

          <div>
            <label htmlFor="garantia">Garantía</label>
            <input
              id="garantia"
              value={form.garantia}
              onChange={(event) => handleChange("garantia", event.target.value)}
              className={styles.input}
            />
          </div>

          {error && <div className={styles.errorText}>{error}</div>}

          <div className={styles.buttonRow}>
            <button type="submit" className={styles.buttonPrimary}>
              {editingId ? "Guardar cambios" : "Crear servicio"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className={styles.buttonSecondary}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>
      </section>

      <section>
        <div className={styles.searchRow}>
          <h2>Listado de servicios</h2>
          <input
            type="search"
            placeholder="Buscar servicios..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className={styles.searchInput}
          />
        </div>

        {filteredServices.length === 0 ? (
          <p>No hay servicios que coincidan.</p>
        ) : (
          <div className={styles.cardGrid}>
            {filteredServices.map((service) => (
              <article key={service.id} className={styles.card}>
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
                <div className={styles.cardActions}>
                  <button
                    type="button"
                    onClick={() => handleEdit(service)}
                    className={styles.buttonPrimary}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(service.id)}
                    className={styles.buttonDanger}
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