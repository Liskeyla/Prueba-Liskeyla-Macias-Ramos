import { Lineas } from "../../components/charts/Lineas.tsx";
import { Drawer } from "../../components/ui/Drawer.tsx";
import { formatoMoneda, formatoPorcentaje } from "../../lib/formato.ts";
import type { Cliente } from "../../types/index.ts";
import styles from "./DrawerCliente.module.css";

type Props = {
  cliente: Cliente | null;
  meses: string[];
  onCerrar: () => void;
};

export function DrawerCliente({ cliente, meses, onCerrar }: Props) {
  const cats = cliente
    ? Object.entries(cliente.consumoPorCategoria)
        .filter(([cat]) => cat !== "NO APLICA")
        .sort((a, b) => b[1][0] - a[1][0])
    : [];
  const maxCat = cats[0]?.[1][0] ?? 0;
  const serie =
    cliente?.consumoMensual.map((consumo, i) => ({
      mes: meses[i] ?? String(i),
      consumo,
    })) ?? [];

  return (
    <Drawer
      abierto={cliente !== null}
      titulo={cliente ? cliente.nombre : "Cliente"}
      onCerrar={onCerrar}
    >
      {cliente && (
        <>
          <p className={styles.muted}>
            {cliente.id} · {cliente.segmento} · {cliente.ciudad}
          </p>
          <section>
            <h2>Productos y saldo</h2>
            {cliente.productos.map((p) => (
              <div className={styles.fila} key={p}>
                <span>{p}</span>
                <span className="tabular">
                  {formatoMoneda(cliente.saldoPorProducto[p] ?? 0)}
                </span>
              </div>
            ))}
            {cliente.utilizacionTC !== null && (
              <p className={styles.muted}>
                Utilización TC {formatoPorcentaje(cliente.utilizacionTC * 100)}
              </p>
            )}
          </section>
          <section>
            <h2>Consumo por categoría</h2>
            {cats.length === 0 && (
              <p className={styles.muted}>Sin consumo categorizable.</p>
            )}
            {cats.map(([cat, [monto]]) => (
              <div className={styles.itemCat} key={cat}>
                <div className={styles.fila}>
                  <span>{cat}</span>
                  <span className="tabular">{formatoMoneda(monto)}</span>
                </div>
                <div className={styles.barra}>
                  <div
                    className={styles.fill}
                    style={{ width: maxCat === 0 ? "0%" : `${(100 * monto) / maxCat}%` }}
                  />
                </div>
              </div>
            ))}
          </section>
          <section>
            <h2>Serie mensual</h2>
            <Lineas datos={serie} ariaLabel="Consumo mensual del cliente" compacta />
          </section>
        </>
      )}
    </Drawer>
  );
}
