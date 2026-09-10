import { useMemo } from "react";
import { filtrarClientes } from "../lib/agregaciones.ts";
import { useDatos } from "../providers/DatosProvider.tsx";
import { useFiltros } from "../providers/FiltrosProvider.tsx";

export function useClientesFiltrados() {
  const { clientes, meta, estado, error, recargar } = useDatos();
  const { filtros, setDimension, quitar, limpiar } = useFiltros();

  const filtrados = useMemo(
    () => filtrarClientes(clientes, filtros),
    [clientes, filtros],
  );

  return {
    clientes,
    filtrados,
    meta,
    filtros,
    setDimension,
    quitar,
    limpiar,
    estado,
    error,
    recargar,
  };
}
