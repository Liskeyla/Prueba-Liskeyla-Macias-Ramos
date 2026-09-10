import {
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { formatoEntero, formatoMonedaCompacta } from "../../lib/formato.ts";
import type { AgregadoSegmento } from "../../types/index.ts";
import styles from "./Dispersion.module.css";

type Props = {
  datos: AgregadoSegmento[];
  ariaLabel: string;
};

export function Dispersion({ datos, ariaLabel }: Props) {
  const puntos = datos.filter((d) => d.clientes > 0);

  return (
    <div className={styles.caja} role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 24, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid stroke="var(--borde)" />
          <XAxis
            dataKey="consumoPromedio"
            name="Consumo promedio"
            tick={{ fontSize: 12, fill: "var(--tinta-3)" }}
            tickFormatter={(v: number) => formatoMonedaCompacta(v)}
          />
          <YAxis
            dataKey="clientes"
            name="Clientes"
            tick={{ fontSize: 12, fill: "var(--tinta-3)" }}
            tickFormatter={(v: number) => formatoEntero(v)}
          />
          <ZAxis dataKey="consumo" range={[80, 360]} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            contentStyle={{
              background: "var(--superficie)",
              border: "1px solid var(--borde)",
              borderRadius: 6,
              fontSize: 12,
            }}
            formatter={(value, name) => {
              const n = Number(value ?? 0);
              if (name === "clientes") return [formatoEntero(n), "Clientes"];
              return [formatoMonedaCompacta(n), String(name)];
            }}
          />
          {puntos.map((p) => (
            <Scatter key={p.nombre} name={p.nombre} data={[p]} fill={p.color}>
              <LabelList dataKey="nombre" position="top" style={{ fontSize: 12 }} />
            </Scatter>
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
