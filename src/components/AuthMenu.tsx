"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../app/context/AuthContext";
import styles from "./AuthMenu.module.css";

export default function AuthMenu() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div>Gasfitería Integral</div>
        <span className={styles.brandSeparator}>|</span>
        <span className={styles.brandText}>
          {user ? `Conectado: ${user.nombre || user.email}` : "Invitado"}
        </span>
      </div>

      <nav className={styles.nav}>
        <MenuLink href="/" active={pathname === "/"}>
          Inicio
        </MenuLink>
        <MenuLink href="/servicios" active={pathname === "/servicios"}>
          Servicios
        </MenuLink>
        <MenuLink href="/perfil" active={pathname === "/perfil"}>
          Mi Perfil
        </MenuLink>
        <MenuLink href="/trabajadores" active={pathname === "/trabajadores"}>
          Trabajadores
        </MenuLink>
        <MenuLink href="/cotizaciones" active={pathname === "/cotizaciones"}>
          Cotizaciones
        </MenuLink>
      </nav>

      <div className={styles.authActions}>
        {user ? (
          <>
            <span className={styles.userLabel}>
              {user.nombre || user.email}
            </span>
            <button
              type="button"
              className={styles.logoutButton}
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.authButton}>
              Iniciar sesión
            </Link>
            <Link
              href="/login?mode=register"
              className={styles.authButtonSecondary}
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

function MenuLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${styles.navLink} ${active ? styles.activeLink : ""}`}
    >
      {children}
    </Link>
  );
}
