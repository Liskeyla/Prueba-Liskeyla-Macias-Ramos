import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cx, formatoMes, formatoMonedaCompacta } from "../../lib/formato.ts";
import styles from "./Lineas.module.css";

export type PuntoLinea = {
  mes: string;
  consumo: number;
};

type Props = {
  datos: PuntoLinea[];
  ariaLabel: string;
  compacta?: boolean;
};

export function Lineas({ datos, ariaLabel, compacta = false }: Props) {
  const serie = datos.map((d) => ({ ...d, etiqueta: formatoMes(d.mes) }));

  return (
    <div
      className={cx(styles.caja, compacta && styles.cajaCorta)}
      role="img"
      aria-label={ariaLabel}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={serie} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          {!compacta && (
            <CartesianGrid stroke="var(--borde)" vertical={false} />
          )}
          <XAxis
            dataKey="etiqueta"
            tick={{ fontSize: 12, fill: "var(--tinta-3)" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            hide={compacta}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--tinta-3)" }}
            axisLine={false}
            tickLine={false}
            width={compacta ? 0 : 48}
            hide={compacta}
            tickFormatter={(v: number) => formatoMonedaCompacta(v)}
          />
          <Tooltip
            contentStyle={{
              background: "var(--superficie)",
              border: "1px solid var(--borde)",
              borderRadius: 6,
              fontSize: 12,
            }}
            formatter={(value) => [
              formatoMonedaCompacta(Number(value ?? 0)),
              "Consumo",
            ]}
          />
          <Line
            type="monotone"
            dataKey="consumo"
            stroke="var(--azul-600)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
