"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import styles from "./servicios.module.css";
import {
  Servicio,
  ServicioFormState,
  initialFormState,
  loadServicios,
  saveServicios,
  updateServicios,
  removeServicios,
} from "../../types/Servicios";

export default function ServiciosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const esAdmin = user?.role === "admin";
  const [services, setServicios] = useState<Servicio[]>(() => loadServicios());
  const [form, setForm] = useState<ServicioFormState>(initialFormState);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (!esAdmin && !editingId) {
      setForm((prev) => ({
        ...prev,
        clienteNombre: user.nombre || "",
        clienteTelefono: user.telefono || "",
        clienteRut: user.rut || "",
      }));
    }
  }, [router, user, esAdmin, editingId]);

  useEffect(() => {
    saveServicios(services);
  }, [services]);

  const filteredServices = useMemo(() => {
    const visible = esAdmin ? services : services.filter((s) => s.clienteNombre === user?.nombre);
    if (!search.trim()) return visible;
    const q = search.toLowerCase();
    return visible.filter((s) => s.nombre.toLowerCase().includes(q) || s.descripcion.toLowerCase().includes(q));
  }, [search, services, esAdmin, user?.nombre]);

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

    if (!form.nombre.trim() || !form.descripcion.trim()) {
      setError("Completa nombre y descripción.");
      return;
    }
    if (esAdmin && !form.trabajador.trim()) {
      setError("Completa el trabajador.");
      return;
    }

    const nServicio: Servicio = {
      id: editingId || `${Date.now()}`,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      clienteNombre: form.clienteNombre.trim(),
      clienteRut: form.clienteRut.trim(),
      clienteTelefono: form.clienteTelefono.trim(),
      precio: esAdmin ? Number(form.precio) : 0,
      duracion: esAdmin ? form.duracion.trim() : "",
      estado: esAdmin ? form.estado : "Solicitud",
      trabajador: esAdmin ? form.trabajador.trim() : "",
      garantia: esAdmin ? form.garantia : "Sin garantía",
    };

    if (editingId) {
      setServicios((prev) => updateServicios(prev, nServicio));
    } else {
      setServicios((prev) => [...prev, nServicio]);
    }
    resetForm();
  };

  const handleEdit = (service: Servicio) => {
    setEditingId(service.id);
    setForm({
      nombre: service.nombre,
      descripcion: service.descripcion,
      clienteNombre: service.clienteNombre,
      clienteRut: service.clienteRut,
      clienteTelefono: service.clienteTelefono,
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
    setServicios((prev) => removeServicios(prev, id));
    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>Gestión de servicios</h1>
        <p>Usuario: {user?.nombre} {user?.apellido}</p>
      </header>

      <section className={styles.section}>
        <h2>{esAdmin ? "Crear servicio" : "Solicitar servicio"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>

          <div>
            <label htmlFor="clienteNombre">Nombre</label>
            <input
              id="clienteNombre"
              value={form.clienteNombre}
              readOnly
              className={styles.input}
            />
          </div>

          <div>
            <label htmlFor="clienteRut">Tu RUT</label>
            <input
              id="clienteRut"
              value={form.clienteRut}
              readOnly
              className={styles.input}
            />
          </div>

          <div>
            <label htmlFor="clienteTelefono">Tu Teléfono</label>
            <input
              id="clienteTelefono"
              value={form.clienteTelefono}
              readOnly
              className={styles.input}
            />
          </div>

          <div>
            <label htmlFor="nombre">Nombre Servicio</label>
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

          {esAdmin && (
            <>
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
            </>
          )}

          {error && <div className={styles.errorText}>{error}</div>}

          <div className={styles.buttonRow}>
            <button type="submit" className={styles.buttonPrimary}>
              {esAdmin ? "Crear servicio" : "Enviar solicitud"}
            </button>
            {editingId && <button type="button" onClick={resetForm} className={styles.buttonSecondary}>Cancelar</button>}
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
            {filteredServices.map((servicio) => (
              <article key={servicio.id} className={styles.card}>
                <h3>{servicio.nombre}</h3>
                <p>{servicio.descripcion}</p>
                {esAdmin && (
                  <>
                    <p><strong>Cliente:</strong> {servicio.clienteNombre}</p>
                    <p><strong>RUT Cliente:</strong> {servicio.clienteRut}</p>
                    <p><strong>Teléfono Cliente:</strong> {servicio.clienteTelefono}</p>
                    <p><strong>Precio:</strong> ${servicio.precio.toLocaleString()}</p>
                    <p><strong>Duración:</strong> {servicio.duracion || "Sin duración"}</p>
                    <p><strong>Estado:</strong> {servicio.estado}</p>
                    <p><strong>Trabajador:</strong> {servicio.trabajador || "Sin asignar"}</p>
                    <p><strong>Garantía:</strong> {servicio.garantia}</p>
                    <div className={styles.cardActions}>
                      <button type="button" onClick={() => handleEdit(servicio)} className={styles.buttonPrimary}>Editar</button>
                      <button type="button" onClick={() => handleDelete(servicio.id)} className={styles.buttonDanger}>Eliminar</button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}