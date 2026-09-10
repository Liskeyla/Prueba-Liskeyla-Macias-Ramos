import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./EstadoVacio.module.css";

type Props = {
  titulo: string;
  mensaje: string;
  accion?: ReactNode;
};

export function EstadoVacio({ titulo, mensaje, accion }: Props) {
  return (
    <div className={styles.caja} role="status">
      <Inbox className={styles.icono} size={36} aria-hidden />
      <p className={styles.titulo}>{titulo}</p>
      <p className={styles.texto}>{mensaje}</p>
      {accion}
    </div>
  );
}
