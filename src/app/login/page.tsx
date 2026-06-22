"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
      (mode === "register" && !name.trim())
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
        name.trim(),
        email.trim(),
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
    <main
      style={{
        padding: "2rem",
        maxWidth: "520px",
        margin: "0 auto",
      }}
    >
      <h1>
        {mode === "login"
          ? "Iniciar sesión"
          : "Registrar usuario"}
      </h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        style={{
          display: "grid",
          gap: "1rem",
        }}
      >
        {mode === "register" && (
          <div>
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              style={{
                width: "100%",
                padding: "0.75rem",
                marginTop: "0.4rem",
              }}
            />
          </div>
        )}

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            style={{
              width: "100%",
              padding: "0.75rem",
              marginTop: "0.4rem",
            }}
          />
        </div>

        <div>
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
            style={{
              width: "100%",
              padding: "0.75rem",
              marginTop: "0.4rem",
            }}
          />
        </div>

        {mode === "register" && (
          <div>
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
              style={{
                width: "100%",
                padding: "0.75rem",
                marginTop: "0.4rem",
              }}
            />
          </div>
        )}

        {error && (
          <div style={{ color: "crimson" }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.85rem",
            backgroundColor: "#0f4c81",
            color: "#fa9090",
            border: "none",
            cursor: "pointer",
          }}
        >
          {mode === "login"
            ? "Entrar"
            : "Registrarse"}
        </button>
      </form>

      <div
        style={{
          marginTop: "1.5rem",
          textAlign: "center",
        }}
      >
        {mode === "login" ? (
          <>
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
              style={{
                color: "#0f4c81",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
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
              style={{
                color: "#0f4c81",
                background: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              Iniciar sesión
            </button>
          </>
        )}
      </div>
    </main>
  );
}