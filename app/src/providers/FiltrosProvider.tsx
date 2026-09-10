import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router-dom";
import { FILTROS_VACIOS } from "../lib/agregaciones.ts";
import type { DimensionFiltro, FiltrosEstado } from "../types/index.ts";

type FiltrosContexto = {
  filtros: FiltrosEstado;
  setDimension: (dimension: DimensionFiltro, valores: string[]) => void;
  quitar: (dimension: DimensionFiltro, valor: string) => void;
  limpiar: () => void;
};

const FiltrosCtx = createContext<FiltrosContexto | null>(null);

const DIMENSIONES: DimensionFiltro[] = [
  "segmento",
  "ciudad",
  "producto",
  "categoria",
];

function leer(params: URLSearchParams): FiltrosEstado {
  return {
    segmento: params.getAll("segmento"),
    ciudad: params.getAll("ciudad"),
    producto: params.getAll("producto"),
    categoria: params.getAll("categoria"),
  };
}

function escribir(filtros: FiltrosEstado): URLSearchParams {
  const params = new URLSearchParams();
  for (const dim of DIMENSIONES) {
    for (const valor of filtros[dim]) {
      params.append(dim, valor);
    }
  }
  return params;
}

export function FiltrosProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filtros = useMemo(() => {
    const leidos = leer(searchParams);
    return leidos;
  }, [searchParams]);

  const setDimension = useCallback(
    (dimension: DimensionFiltro, valores: string[]) => {
      setSearchParams(
        (prev) => {
          const actual = leer(prev);
          return escribir({ ...actual, [dimension]: valores });
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const quitar = useCallback(
    (dimension: DimensionFiltro, valor: string) => {
      setSearchParams(
        (prev) => {
          const actual = leer(prev);
          return escribir({
            ...actual,
            [dimension]: actual[dimension].filter((v) => v !== valor),
          });
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const limpiar = useCallback(() => {
    setSearchParams(escribir(FILTROS_VACIOS), { replace: true });
  }, [setSearchParams]);

  const valor = useMemo<FiltrosContexto>(
    () => ({ filtros, setDimension, quitar, limpiar }),
    [filtros, setDimension, quitar, limpiar],
  );

  return <FiltrosCtx.Provider value={valor}>{children}</FiltrosCtx.Provider>;
}

export function useFiltros(): FiltrosContexto {
  const ctx = useContext(FiltrosCtx);
  if (!ctx) throw new Error("useFiltros requiere FiltrosProvider");
  return ctx;
}
