import { useMemo } from "react";
import {
  agregarPorSegmento,
  consumoMensualAgregado,
} from "../lib/agregaciones.ts";
import { useClientesFiltrados } from "./useClientesFiltrados.ts";

export function useAgregados() {
  const { filtrados, meta, filtros } = useClientesFiltrados();

  return useMemo(() => {
    const segmentos = meta?.segmentos ?? [];
    const meses = meta?.meses ?? [];
    return {
      porSegmento: agregarPorSegmento(filtrados, segmentos, filtros),
      mensual: consumoMensualAgregado(filtrados, meses),
    };
  }, [filtrados, meta, filtros]);
}
