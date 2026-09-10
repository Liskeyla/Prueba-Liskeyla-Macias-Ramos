import { useMemo } from "react";
import { calcularKpis } from "../lib/agregaciones.ts";
import { useClientesFiltrados } from "./useClientesFiltrados.ts";

export function useKpis() {
  const { filtrados, filtros } = useClientesFiltrados();
  return useMemo(() => calcularKpis(filtrados, filtros), [filtrados, filtros]);
}
