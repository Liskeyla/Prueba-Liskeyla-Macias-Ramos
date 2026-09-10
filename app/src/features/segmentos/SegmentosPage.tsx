import { Dispersion } from "../../components/charts/Dispersion.tsx";
import { Tarjeta } from "../../components/ui/Tarjeta.tsx";
import { useAgregados } from "../../hooks/useAgregados.ts";
import { useClientesFiltrados } from "../../hooks/useClientesFiltrados.ts";
import { TablaOportunidades } from "./TablaOportunidades.tsx";
import { TarjetaSegmento } from "./TarjetaSegmento.tsx";
import styles from "./SegmentosPage.module.css";

export function SegmentosPage() {
  const { meta, setDimension } = useClientesFiltrados();
  const { porSegmento } = useAgregados();

  if (!meta) return null;

  return (
    <div className={styles.pagina}>
      <div className={styles.grid}>
        {porSegmento.map((s) => (
          <TarjetaSegmento
            key={s.nombre}
            dato={s}
            onClick={() => setDimension("segmento", [s.nombre])}
          />
        ))}
      </div>
      <Tarjeta>
        <h2>Consumo promedio frente a tamaño del segmento</h2>
        <Dispersion
          datos={porSegmento}
          ariaLabel="Dispersión de segmentos: consumo promedio, clientes y consumo total"
        />
      </Tarjeta>
      <Tarjeta>
        <h2>Oportunidades por segmento</h2>
        <TablaOportunidades segmentos={meta.segmentos} />
      </Tarjeta>
    </div>
  );
}
