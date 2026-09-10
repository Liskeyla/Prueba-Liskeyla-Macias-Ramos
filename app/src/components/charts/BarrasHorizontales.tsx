import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./BarrasHorizontales.module.css";

export type BarraDato = {
  nombre: string;
  valor: number;
  color: string;
  etiqueta: string;
};

type Props = {
  datos: BarraDato[];
  ariaLabel: string;
};

export function BarrasHorizontales({ datos, ariaLabel }: Props) {
  const ordenados = [...datos].sort((a, b) => b.valor - a.valor);

  return (
    <div className={styles.caja} role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={ordenados}
          layout="vertical"
          margin={{ top: 8, right: 48, left: 8, bottom: 8 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="nombre"
            width={128}
            tick={{ fontSize: 12, fill: "var(--tinta-2)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--superficie)",
              border: "1px solid var(--borde)",
              borderRadius: 6,
              fontSize: 12,
            }}
            formatter={(value) => [String(value ?? ""), "Valor"]}
          />
          <Bar dataKey="valor" radius={[0, 4, 4, 0]} maxBarSize={18}>
            {ordenados.map((d) => (
              <Cell key={d.nombre} fill={d.color} />
            ))}
            <LabelList dataKey="etiqueta" position="right" style={{ fontSize: 12 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
