import styles from "./Skeleton.module.css";

type Props = {
  alto?: number;
  ancho?: string;
};

export function Skeleton({ alto = 16, ancho = "100%" }: Props) {
  return <div className={styles.bloque} style={{ height: alto, width: ancho }} />;
}

export function SkeletonPagina() {
  return (
    <div className={styles.fila} aria-busy="true" aria-label="Cargando">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Skeleton alto={88} />
        <Skeleton alto={88} />
        <Skeleton alto={88} />
        <Skeleton alto={88} />
      </div>
      <Skeleton alto={240} />
      <Skeleton alto={240} />
    </div>
  );
}
