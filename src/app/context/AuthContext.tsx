"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

type UserSession = {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  rut?: string;
  role: string;
};

type AuthContextType = {
  user: UserSession | null;
  isLoading: boolean;

  login(
    email: string,
    password: string
  ): Promise<boolean>;

  register(
    nombre: string,
    apellido: string,
    email: string,
    telefono: string,
    rut: string,
    password: string
  ): Promise<boolean>;

  logout(): Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<UserSession | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const docRef = doc(
              db,
              "usuario",
              firebaseUser.uid
            );

            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              const data = docSnap.data();

              setUser({
                nombre: data.nombre,
                apellido: data.apellido,
                email: data.email,
                telefono: data.telefono,
                rut: data.rut,
                role: data.role,
              });
            } else {
              setUser({
                nombre: firebaseUser.displayName || "",
                apellido: "",
                email: firebaseUser.email || "",
                role:
                  firebaseUser.email ===
                  "admin@gasfiteria.com"
                    ? "admin"
                    : "cliente",
              });
            }
          } catch (error) {
            console.error(error);

            setUser({
              nombre: firebaseUser.displayName || "",
              apellido: "",
              email: firebaseUser.email || "",
              role: "cliente",
            });
          }
        } else {
          setUser(null);
        }

        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const login = async (
    email: string,
    password: string
  ) => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const register = async (
    nombre: string,
    apellido: string,
    email: string,
    telefono: string,
    rut: string,
    password: string
  ): Promise<boolean> => {
    try {
      const result =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await updateProfile(result.user, {
        displayName: nombre,
      });

      await setDoc(
        doc(db, "usuario", result.user.uid),
        {
          nombre,
          apellido,
          email,
          telefono,
          rut,
          role:
            email === "admin@gasfiteria.com"
              ? "admin"
              : "cliente",
        }
      );

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
    }),
    [
      user,
      isLoading,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe estar dentro de AuthProvider"
    );
  }

  return context;
}