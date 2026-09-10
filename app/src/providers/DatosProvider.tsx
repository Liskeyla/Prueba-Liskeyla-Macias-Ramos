import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Cliente, EstadoCarga, Meta } from "../types/index.ts";

type DatosContexto = {
  clientes: Cliente[];
  meta: Meta | null;
  estado: EstadoCarga;
  error: string | null;
  recargar: () => void;
};

const DatosCtx = createContext<DatosContexto | null>(null);

async function cargarJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`No se pudo cargar ${url} (${res.status})`);
  }
  return (await res.json()) as T;
}

export function DatosProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [estado, setEstado] = useState<EstadoCarga>("cargando");
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let cancelado = false;
    setEstado("cargando");
    setError(null);

    Promise.all([
      cargarJson<Cliente[]>("/data/clientes.json"),
      cargarJson<Meta>("/data/meta.json"),
    ])
      .then(([lista, catalogo]) => {
        if (cancelado) return;
        setClientes(lista);
        setMeta(catalogo);
        setEstado("listo");
      })
      .catch((err: unknown) => {
        if (cancelado) return;
        const mensaje =
          err instanceof Error ? err.message : "Error al cargar los datos";
        setError(mensaje);
        setEstado("error");
      });

    return () => {
      cancelado = true;
    };
  }, [intento]);

  const recargar = useCallback(() => {
    setIntento((n) => n + 1);
  }, []);

  const valor = useMemo<DatosContexto>(
    () => ({ clientes, meta, estado, error, recargar }),
    [clientes, meta, estado, error, recargar],
  );

  return <DatosCtx.Provider value={valor}>{children}</DatosCtx.Provider>;
}

export function useDatos(): DatosContexto {
  const ctx = useContext(DatosCtx);
  if (!ctx) throw new Error("useDatos requiere DatosProvider");
  return ctx;
}
