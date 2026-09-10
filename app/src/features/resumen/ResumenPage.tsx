import { useMemo } from "react";
import { BarrasHorizontales } from "../../components/charts/BarrasHorizontales.tsx";
import { Lineas } from "../../components/charts/Lineas.tsx";
import { Tarjeta } from "../../components/ui/Tarjeta.tsx";
import { useAgregados } from "../../hooks/useAgregados.ts";
import { useClientesFiltrados } from "../../hooks/useClientesFiltrados.ts";
import { useKpis } from "../../hooks/useKpis.ts";
import {
  formatoEntero,
  formatoMonedaCompacta,
} from "../../lib/formato.ts";
import { Insights } from "./Insights.tsx";
import { KpiRow } from "./KpiRow.tsx";
import styles from "./ResumenPage.module.css";

export function ResumenPage() {
  const { filtrados, meta, filtros } = useClientesFiltrados();
  const kpis = useKpis();
  const { porSegmento, mensual } = useAgregados();

  const porVencer = useMemo(
    () =>
      filtrados.filter(
        (c) =>
          c.diasProximoVencimiento !== null &&
          c.diasProximoVencimiento >= 0 &&
          c.diasProximoVencimiento <= 60,
      ).length,
    [filtrados],
  );

  const topClientes = [...porSegmento].sort((a, b) => b.clientes - a.clientes)[0];
  const topSaldo = [...porSegmento].sort((a, b) => b.saldo - a.saldo)[0];

  if (!meta) return null;

  return (
    <div className={styles.pagina}>
      <KpiRow
        kpis={kpis}
        fechaCorte={meta.fechaCorte}
        notaCategoria={filtros.categoria.length > 0}
      />
      <div className={styles.grid}>
        <Tarjeta>
          <h2 className={styles.tituloHallazgo}>
            {topClientes
              ? `${topClientes.nombre} concentra ${formatoEntero(topClientes.clientes)} clientes`
              : "Clientes por segmento"}
          </h2>
          <BarrasHorizontales
            ariaLabel="Clientes por segmento"
            datos={porSegmento.map((s) => ({
              nombre: s.nombre,
              valor: s.clientes,
              color: s.color,
              etiqueta: formatoEntero(s.clientes),
            }))}
          />
        </Tarjeta>
        <Tarjeta>
          <h2 className={styles.tituloHallazgo}>
            {topSaldo
              ? `${topSaldo.nombre} reúne ${formatoMonedaCompacta(topSaldo.saldo)} de saldo`
              : "Saldo por segmento"}
          </h2>
          <BarrasHorizontales
            ariaLabel="Saldo por segmento"
            datos={porSegmento.map((s) => ({
              nombre: s.nombre,
              valor: s.saldo,
              color: s.color,
              etiqueta: formatoMonedaCompacta(s.saldo),
            }))}
          />
        </Tarjeta>
        <Tarjeta className={styles.ancho}>
          <h2 className={styles.tituloHallazgo}>
            El consumo filtrado suma {formatoMonedaCompacta(kpis.consumoTotal)} en
            los {mensual.length} meses de la serie
          </h2>
          <Lineas
            datos={mensual}
            ariaLabel="Evolución mensual del consumo"
          />
        </Tarjeta>
      </div>
      <Insights kpis={kpis} porSegmento={porSegmento} porVencer={porVencer} />
    </div>
  );
}
