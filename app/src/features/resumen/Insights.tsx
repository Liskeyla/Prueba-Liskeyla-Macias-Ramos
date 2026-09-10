import { Tarjeta } from "../../components/ui/Tarjeta.tsx";
import { formatoEntero, formatoPorcentaje } from "../../lib/formato.ts";
import type { AgregadoSegmento, Kpis } from "../../types/index.ts";
import styles from "./Insights.module.css";

type Props = {
  kpis: Kpis;
  porSegmento: AgregadoSegmento[];
  porVencer: number;
};

export function Insights({ kpis, porSegmento, porVencer }: Props) {
  const top = [...porSegmento].sort((a, b) => b.clientes - a.clientes)[0];
  const pctSin =
    kpis.clientesUnicos === 0
      ? 0
      : (100 * kpis.clientesSinConsumo) / kpis.clientesUnicos;
  const pctMulti =
    kpis.clientesUnicos === 0
      ? 0
      : (100 * kpis.clientesMultiproducto) / kpis.clientesUnicos;

  const tarjetas = [
    {
      color: top?.color ?? "var(--s1)",
      texto: top
        ? `${top.nombre} concentra el ${formatoPorcentaje(top.pctClientes)} de los clientes y genera el ${formatoPorcentaje(top.pctConsumo)} del consumo.`
        : "No hay segmentos en el universo filtrado.",
    },
    {
      color: "var(--alerta)",
      texto: `${formatoEntero(kpis.clientesSinConsumo)} clientes (${formatoPorcentaje(pctSin)}) no registran consumo aplicable.`,
    },
    {
      color: "var(--exito)",
      texto:
        porVencer > 0
          ? `${formatoEntero(porVencer)} clientes tienen un producto por vencer en los próximos 60 días. El ${formatoPorcentaje(pctMulti)} ya es multiproducto.`
          : `El ${formatoPorcentaje(pctMulti)} de la cartera filtrada es multiproducto.`,
    },
  ];

  return (
    <div className={styles.grid}>
      {tarjetas.map((t) => (
        <Tarjeta key={t.texto}>
          <span className={styles.marca} style={{ background: t.color }} />
          <p className={styles.texto}>{t.texto}</p>
        </Tarjeta>
      ))}
    </div>
  );
}
