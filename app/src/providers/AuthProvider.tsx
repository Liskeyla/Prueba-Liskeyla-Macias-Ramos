import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const CLAVE_SESION = "cartera.sesion";

/* Esta no es autenticación de producción. En producción se usaría un IdP
   (Entra ID), un token emitido por el backend y control de expiración. */

type AuthContexto = {
  autenticado: boolean;
  usuario: string | null;
  login: (usuario: string, clave: string) => boolean;
  logout: () => void;
};

const AuthCtx = createContext<AuthContexto | null>(null);

function leerSesion(): string | null {
  const raw = sessionStorage.getItem(CLAVE_SESION);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { usuario?: string };
    return parsed.usuario ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<string | null>(leerSesion);

  const login = useCallback((nombre: string, clave: string) => {
    if (nombre === "demo" && clave === "demo123") {
      sessionStorage.setItem(CLAVE_SESION, JSON.stringify({ usuario: nombre }));
      setUsuario(nombre);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(CLAVE_SESION);
    setUsuario(null);
  }, []);

  const valor = useMemo<AuthContexto>(
    () => ({ autenticado: usuario !== null, usuario, login, logout }),
    [usuario, login, logout],
  );

  return <AuthCtx.Provider value={valor}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthContexto {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth requiere AuthProvider");
  return ctx;
}
