import { Tarjeta } from "../../components/ui/Tarjeta.tsx";
import {
  formatoEntero,
  formatoMonedaCompacta,
  formatoPorcentaje,
} from "../../lib/formato.ts";
import type { AgregadoSegmento } from "../../types/index.ts";
import styles from "./TarjetaSegmento.module.css";

type Props = {
  dato: AgregadoSegmento;
  onClick: () => void;
};

export function TarjetaSegmento({ dato, onClick }: Props) {
  return (
    <Tarjeta onClick={onClick} ariaLabel={`Filtrar por ${dato.nombre}`}>
      <div className={styles.cab}>
        <span className={styles.marca} style={{ background: dato.color }} />
        <h2>{dato.nombre}</h2>
      </div>
      <div className={styles.nums}>
        <p>
          Clientes
          <span className={styles.valor}>
            {formatoEntero(dato.clientes)} · {formatoPorcentaje(dato.pctClientes)}
          </span>
        </p>
        <p>
          Consumo
          <span className={styles.valor}>
            {formatoMonedaCompacta(dato.consumo)} · {formatoPorcentaje(dato.pctConsumo)}
          </span>
        </p>
        <p>
          Ticket
          <span className={styles.valor}>{formatoMonedaCompacta(dato.ticketPromedio)}</span>
        </p>
        <p>
          Saldo
          <span className={styles.valor}>{formatoMonedaCompacta(dato.saldo)}</span>
        </p>
      </div>
    </Tarjeta>
  );
}
