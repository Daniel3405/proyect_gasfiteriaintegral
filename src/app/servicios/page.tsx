"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import styles from "./servicios.module.css";

import type { Trabajador } from "../../types/Trabajador";

import {
  Servicio,
  ServicioFormState,
  initialFormState,
} from "../../types/Servicios";

import { db } from "@/lib/firebase";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function ServiciosPage() {
  const { user } = useAuth();
  const router = useRouter();

  const esAdmin = user?.role === "admin";

  const [services, setServicios] = useState<Servicio[]>([]);
  const [form, setForm] =
    useState<ServicioFormState>(initialFormState);

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  const [trabajadores, setTrabajadores] =
    useState<Trabajador[]>(() => {
      if (typeof window === "undefined") return [];

      const saved =
        localStorage.getItem("trabajadores");

      return saved ? JSON.parse(saved) : [];
    });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved =
      localStorage.getItem("trabajadores");

    if (saved) {
      setTrabajadores(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "servicios")
      );

      const lista: Servicio[] = snapshot.docs.map(
        (documento) => ({
          id: documento.id,
          ...(documento.data() as Omit<
            Servicio,
            "id"
          >),
        })
      );

      setServicios(lista);
    } catch (error) {
      console.error(error);
    }
  };

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

  const filteredServices = useMemo(() => {
    const visible = esAdmin
      ? services
      : services.filter(
          (s) =>
            s.clienteNombre === user?.nombre &&
            s.clienteRut === user?.rut
        );

    if (!search.trim()) return visible;

    const q = search.toLowerCase();

    return visible.filter(
      (s) =>
        s.nombre.toLowerCase().includes(q) ||
        s.descripcion.toLowerCase().includes(q)
    );
  }, [
    search,
    services,
    esAdmin,
    user?.nombre,
    user?.rut,
  ]);

  const handleChange = (
    field: keyof typeof initialFormState,
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (
      !form.nombre.trim() ||
      !form.descripcion.trim()
    ) {
      setError(
        "Completa nombre y descripción."
      );
      return;
    }

    if (
      esAdmin &&
      !form.trabajador.trim()
    ) {
      setError(
        "Completa el trabajador."
      );
      return;
    }

    const nuevoServicio = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      clienteNombre:
        form.clienteNombre.trim(),
      clienteRut: form.clienteRut.trim(),
      clienteTelefono:
        form.clienteTelefono.trim(),
      precio: esAdmin
        ? Number(form.precio)
        : 0,
      duracion: esAdmin
        ? form.duracion.trim()
        : "",
      estado: esAdmin
        ? form.estado
        : "Solicitud",
      trabajador: esAdmin
        ? form.trabajador.trim()
        : "",
      garantia: esAdmin
        ? form.garantia
        : "Sin garantía",
    };

    try {
      if (editingId) {
        await updateDoc(
          doc(db, "servicios", editingId),
          nuevoServicio
        );

        alert("Servicio actualizado.");
      } else {
        await addDoc(
          collection(db, "servicios"),
          nuevoServicio
        );

        alert("Servicio creado.");
      }

      resetForm();
      cargarServicios();
    } catch (error) {
      console.error(error);
      alert(
        "Error al guardar el servicio."
      );
    }
  };

  const handleEdit = (
    service: Servicio
  ) => {
    setEditingId(service.id);

    setForm({
      nombre: service.nombre,
      descripcion: service.descripcion,
      clienteNombre: service.clienteNombre,
      clienteRut: service.clienteRut,
      clienteTelefono:
        service.clienteTelefono,
      precio: service.precio,
      duracion: service.duracion,
      estado: service.estado,
      trabajador: service.trabajador,
      garantia: service.garantia,
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm(
      "¿Eliminar este servicio?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "servicios", id));

      alert(
        "Servicio eliminado correctamente."
      );

      if (editingId === id) {
        resetForm();
      }

      cargarServicios();
    } catch (error) {
      console.error(error);
      alert(
        "Error al eliminar el servicio."
      );
    }
  };

  const showClientFields =
    !esAdmin || Boolean(editingId);
      return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1>Gestión de servicios</h1>
        <p>
          Usuario: {user?.nombre} {user?.apellido}
        </p>
      </header>

      <section className={styles.section}>
        <h2>
          {esAdmin
            ? "Crear servicio"
            : "Solicitar servicio"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >
          {showClientFields && (
            <>
              <div>
                <label>Nombre</label>
                <input
                  value={form.clienteNombre}
                  readOnly
                  className={styles.input}
                />
              </div>

              <div>
                <label>RUT</label>
                <input
                  value={form.clienteRut}
                  readOnly
                  className={styles.input}
                />
              </div>

              <div>
                <label>Teléfono</label>
                <input
                  value={form.clienteTelefono}
                  readOnly
                  className={styles.input}
                />
              </div>
            </>
          )}

          <div>
            <label>Nombre Servicio</label>
            <input
              value={form.nombre}
              onChange={(e) =>
                handleChange(
                  "nombre",
                  e.target.value
                )
              }
              className={styles.input}
            />
          </div>

          <div>
            <label>Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) =>
                handleChange(
                  "descripcion",
                  e.target.value
                )
              }
              className={styles.textarea}
            />
          </div>

          {esAdmin && (
            <>
              <div className={styles.gridTwo}>
                <div>
                  <label>Precio</label>
                  <input
                    type="number"
                    value={form.precio}
                    onChange={(e) =>
                      handleChange(
                        "precio",
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className={styles.input}
                  />
                </div>

                <div>
                  <label>Duración</label>
                  <input
                    value={form.duracion}
                    onChange={(e) =>
                      handleChange(
                        "duracion",
                        e.target.value
                      )
                    }
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.gridTwo}>
                <div>
                  <label>Estado</label>

                  <select
                    value={form.estado}
                    onChange={(e) =>
                      handleChange(
                        "estado",
                        e.target.value
                      )
                    }
                    className={styles.input}
                  >
                    <option>Pendiente</option>
                    <option>En progreso</option>
                    <option>Finalizado</option>
                    <option>Cancelado</option>
                  </select>
                </div>

                <div>
                  <label>Trabajador</label>

                  <select
                    value={form.trabajador}
                    onChange={(e) =>
                      handleChange(
                        "trabajador",
                        e.target.value
                      )
                    }
                    className={styles.input}
                  >
                    <option value="">
                      Seleccione
                    </option>

                    {trabajadores.map(
                      (trabajador) => (
                        <option
                          key={trabajador.id}
                          value={`${trabajador.nombre} ${trabajador.apellido}`}
                        >
                          {trabajador.nombre}{" "}
                          {trabajador.apellido}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label>Garantía</label>

                <input
                  value={form.garantia}
                  onChange={(e) =>
                    handleChange(
                      "garantia",
                      e.target.value
                    )
                  }
                  className={styles.input}
                />
              </div>
            </>
          )}

          {error && (
            <div className={styles.errorText}>
              {error}
            </div>
          )}

          <div className={styles.buttonRow}>
            <button
              type="submit"
              className={styles.buttonPrimary}
            >
              {editingId
                ? "Actualizar"
                : esAdmin
                ? "Crear servicio"
                : "Enviar solicitud"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className={styles.buttonSecondary}
              >
                Cancelar
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
            placeholder="Buscar..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className={styles.searchInput}
          />
        </div>

        {filteredServices.length ===
        0 ? (
          <p>No existen servicios.</p>
        ) : (
          <div className={styles.cardGrid}>
            {filteredServices.map(
              (servicio) => (
                <article
                  key={servicio.id}
                  className={styles.card}
                >
                  <h3>{servicio.nombre}</h3>

                  <p>
                    {servicio.descripcion}
                  </p>

                  {esAdmin && (
                    <>
                      <p>
                        <strong>
                          Cliente:
                        </strong>{" "}
                        {
                          servicio.clienteNombre
                        }
                      </p>

                      <p>
                        <strong>
                          Precio:
                        </strong>{" "}
                        $
                        {servicio.precio.toLocaleString()}
                      </p>

                      <p>
                        <strong>
                          Estado:
                        </strong>{" "}
                        {servicio.estado}
                      </p>

                      <p>
                        <strong>
                          Trabajador:
                        </strong>{" "}
                        {
                          servicio.trabajador
                        }
                      </p>

                      <div
                        className={
                          styles.cardActions
                        }
                      >
                        <button
                          onClick={() =>
                            handleEdit(
                              servicio
                            )
                          }
                          className={
                            styles.buttonPrimary
                          }
                        >
                          Editar
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              servicio.id
                            )
                          }
                          className={
                            styles.buttonDanger
                          }
                        >
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </article>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}