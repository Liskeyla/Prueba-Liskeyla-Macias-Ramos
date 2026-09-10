import { CircleAlert } from "lucide-react";
import { Boton } from "./Boton.tsx";
import styles from "./EstadoError.module.css";

type Props = {
  mensaje?: string;
  onReintentar: () => void;
};

export function EstadoError({
  mensaje = "No se pudieron cargar los datos de la cartera.",
  onReintentar,
}: Props) {
  return (
    <div className={styles.caja} role="alert">
      <CircleAlert className={styles.icono} size={36} aria-hidden />
      <p className={styles.titulo}>Error al cargar</p>
      <p className={styles.texto}>{mensaje}</p>
      <Boton variante="primario" onClick={onReintentar}>
        Reintentar
      </Boton>
    </div>
  );
}
