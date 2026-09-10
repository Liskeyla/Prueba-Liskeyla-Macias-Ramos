import { Tarjeta } from "../../components/ui/Tarjeta.tsx";
import {
  formatoEntero,
  formatoMonedaCompacta,
} from "../../lib/formato.ts";
import type { Kpis } from "../../types/index.ts";
import styles from "./KpiRow.module.css";

type Props = {
  kpis: Kpis;
  fechaCorte: string;
  notaCategoria: boolean;
};

export function KpiRow({ kpis, fechaCorte, notaCategoria }: Props) {
  const items = [
    {
      etiqueta: "Clientes únicos",
      valor: formatoEntero(kpis.clientesUnicos),
      contexto: "universo filtrado",
    },
    {
      etiqueta: "Saldo total",
      valor: formatoMonedaCompacta(kpis.saldoTotal),
      contexto: `estado al ${fechaCorte}`,
    },
    {
      etiqueta: "Saldo promedio",
      valor: formatoMonedaCompacta(kpis.saldoPromedio),
      contexto: "por cliente",
    },
    {
      etiqueta: "Consumo total",
      valor: formatoMonedaCompacta(kpis.consumoTotal),
      contexto: "monto mayor a cero",
    },
    {
      etiqueta: "Consumo promedio",
      valor: formatoMonedaCompacta(kpis.consumoPromedio),
      contexto: "incluye clientes sin consumo",
    },
  ];

  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <Tarjeta key={item.etiqueta}>
          <p className={styles.etiqueta}>{item.etiqueta}</p>
          <p className={styles.valor}>{item.valor}</p>
          <p className={styles.contexto}>{item.contexto}</p>
        </Tarjeta>
      ))}
      {notaCategoria && (
        <p className={styles.nota}>
          El consumo refleja únicamente las categorías seleccionadas.
        </p>
      )}
    </div>
  );
}
