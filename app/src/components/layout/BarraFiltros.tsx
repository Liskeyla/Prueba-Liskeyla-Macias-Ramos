import { useState } from "react";
import { hayFiltros } from "../../lib/agregaciones.ts";
import { cx, formatoEntero } from "../../lib/formato.ts";
import type { DimensionFiltro, FiltrosEstado, Meta } from "../../types/index.ts";
import { Boton } from "../ui/Boton.tsx";
import { Chip } from "../ui/Chip.tsx";
import { SelectMultiple } from "../ui/SelectMultiple.tsx";
import styles from "./BarraFiltros.module.css";

type Props = {
  meta: Meta;
  filtros: FiltrosEstado;
  mostrados: number;
  total: number;
  onChange: (dimension: DimensionFiltro, valores: string[]) => void;
  onQuitar: (dimension: DimensionFiltro, valor: string) => void;
  onLimpiar: () => void;
};

const ETIQUETAS: Record<DimensionFiltro, string> = {
  segmento: "Segmento",
  ciudad: "Ciudad",
  producto: "Producto",
  categoria: "Categoría",
};

export function BarraFiltros({
  meta,
  filtros,
  mostrados,
  total,
  onChange,
  onQuitar,
  onLimpiar,
}: Props) {
  const [abierto, setAbierto] = useState(false);
  const activos = hayFiltros(filtros);
  const chips: Array<{ dim: DimensionFiltro; valor: string }> = [];
  (Object.keys(ETIQUETAS) as DimensionFiltro[]).forEach((dim) => {
    filtros[dim].forEach((valor) => chips.push({ dim, valor }));
  });

  return (
    <section className={styles.barra} aria-label="Filtros">
      <div className={styles.toggle}>
        <Boton variante="secundario" onClick={() => setAbierto((v) => !v)}>
          {abierto ? "Ocultar filtros" : "Mostrar filtros"}
        </Boton>
      </div>
      <div className={cx(styles.grid, !abierto && styles.cerrado)}>
        <SelectMultiple
          etiqueta="Segmento conductual"
          opciones={meta.segmentos.map((s) => s.nombre)}
          seleccion={filtros.segmento}
          onChange={(v) => onChange("segmento", v)}
        />
        <SelectMultiple
          etiqueta="Ciudad"
          opciones={meta.ciudades}
          seleccion={filtros.ciudad}
          onChange={(v) => onChange("ciudad", v)}
        />
        <SelectMultiple
          etiqueta="Producto"
          opciones={meta.productos}
          seleccion={filtros.producto}
          onChange={(v) => onChange("producto", v)}
        />
        <SelectMultiple
          etiqueta="Categoría de consumo"
          opciones={meta.categorias}
          seleccion={filtros.categoria}
          onChange={(v) => onChange("categoria", v)}
        />
      </div>
      <div className={styles.chips}>
        {chips.map((c) => (
          <Chip
            key={`${c.dim}-${c.valor}`}
            etiqueta={`${ETIQUETAS[c.dim]}: ${c.valor}`}
            onQuitar={() => onQuitar(c.dim, c.valor)}
          />
        ))}
        {activos && (
          <Boton variante="fantasma" onClick={onLimpiar}>
            Limpiar todo
          </Boton>
        )}
        <span className={styles.contador}>
          Mostrando {formatoEntero(mostrados)} de {formatoEntero(total)} clientes
        </span>
      </div>
    </section>
  );
}
