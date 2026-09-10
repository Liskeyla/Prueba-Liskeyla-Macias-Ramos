import { Tabla, type ColumnaTabla } from "../../components/ui/Tabla.tsx";
import type { SegmentoDef } from "../../types/index.ts";
import styles from "./TablaOportunidades.module.css";

type Props = {
  segmentos: SegmentoDef[];
};

export function TablaOportunidades({ segmentos }: Props) {
  const columnas: ColumnaTabla<SegmentoDef>[] = [
    {
      id: "nombre",
      encabezado: "Segmento",
      render: (s) => (
        <>
          <span className={styles.punto} style={{ background: s.color }} />
          {s.nombre}
        </>
      ),
    },
    { id: "obs", encabezado: "Qué observamos", render: (s) => s.queObservamos },
    { id: "opp", encabezado: "Oportunidad", render: (s) => s.oportunidad },
    { id: "acc", encabezado: "Acción", render: (s) => s.accion },
  ];

  return (
    <Tabla columnas={columnas} filas={segmentos} clave={(s) => s.nombre} />
  );
}
