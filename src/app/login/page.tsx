"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import styles from "./login.module.css";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { user, login, register } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (
      !email.trim() ||
      !password.trim() ||
      (mode === "register" && (!nombre.trim() || !apellido.trim() || !telefono.trim() || !rut.trim()))
    ) {
      setError("Completa todos los campos obligatorios.");
      return;
    }

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }

      const success = register(
        nombre.trim(),
        apellido.trim(),
        email.trim(),
        telefono.trim(),
        rut.trim(),
        password.trim()
      );

      if (!success) {
        setError("Ese email ya está registrado.");
        return;
      }

      router.push("/dashboard");
      return;
    }

    const success = login(
      email.trim(),
      password.trim()
    );

    if (!success) {
      setError("Credenciales incorrectas.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        {mode === "login"
          ? "Iniciar sesión"
          : "Registrar usuario"}
      </h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className={styles.form}
      >
        {mode === "register" && (
          <>
            <div className={styles.field}>
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                type="text"
                value={nombre}
                onChange={(event) =>
                  setNombre(event.target.value)
                }
                className={styles.input}
              />
            </div>
              
            <div className={styles.field}>
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                type="text"
                value={apellido}
                onChange={(event) =>
                  setApellido(event.target.value)
                }
                className={styles.input}
              />
            </div>


            <div className={styles.field}>
              <label htmlFor="telefono">Teléfono</label>
              <input
                id="telefono"
                type="tel"
                value={telefono}
                onChange={(event) =>
                  setTelefono(event.target.value)
                }
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="rut">RUT</label>
              <input
                id="rut"
                type="text"
                value={rut}
                onChange={(event) =>
                  setRut(event.target.value)
                }
                className={styles.input}
              />
            </div>
          </>
        )}

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            className={styles.input}
          />
        </div>

        {mode === "register" && (
          <div className={styles.field}>
            <label htmlFor="confirmPassword">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              className={styles.input}
            />
          </div>
        )}

        {error && (
          <div className={styles.errorText}>
            {error}
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
        >
          {mode === "login"
            ? "Entrar"
            : "Registrarse"}
        </button>
      </form>

      <div className={styles.switchRow}>
        {mode === "login" ? (
          <>
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={styles.switchButton}
            >
              Registrarse
            </button>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={styles.switchButton}
            >
              Iniciar sesión
            </button>
          </>
        )}
      </div>
    </main>
  );
}