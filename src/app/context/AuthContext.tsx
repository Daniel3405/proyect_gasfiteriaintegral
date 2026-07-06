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
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

type UserSession = {
  nombre: string;
  apellido: string;
  email: string;
  role: string;
  telefono?: string;
  rut?: string;
};

type AuthContextType = {
  user: UserSession | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
};

type StoredUser = {
  name: string;
  email: string;
  password: string;
  role: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "gasfiteria-session";
const USERS_KEY = "gasfiteria-users";

const initialUsers: StoredUser[] = [
  {
    name: "Administrador",
    email: "admin@gasfiteria.com",
    password: "123456",
    role: "admin",
  },
];

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [users, setUsers] = useState<StoredUser[]>(initialUsers);

  useEffect(() => {
    const storedSession = localStorage.getItem(SESSION_KEY);
    const storedUsers = localStorage.getItem(USERS_KEY);

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    if (storedSession) {
      setUser(JSON.parse(storedSession));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  const login = (email: string, password: string) => {
    const found = users.find((item) => item.email === email && item.password === password);
    if (!found) return false;

    const session = {
      name: found.name,
      email: found.email,
      role: found.role,
    };
    setUser(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  };

  const register = (name: string, email: string, password: string) => {
    const exists = users.some((item) => item.email === email);
    if (exists) return false;

    const newUser: StoredUser = {
      name,
      email,
      password,
      role: "user",
    };

    setUsers((prev) => [...prev, newUser]);
    const session = { name, email, role: "user" };
    setUser(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user, users]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}