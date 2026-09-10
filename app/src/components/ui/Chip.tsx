import { X } from "lucide-react";
import styles from "./Chip.module.css";

type Props = {
  etiqueta: string;
  onQuitar: () => void;
};

export function Chip({ etiqueta, onQuitar }: Props) {
  return (
    <span className={styles.chip}>
      {etiqueta}
      <button
        type="button"
        className={styles.quitar}
        onClick={onQuitar}
        aria-label={`Quitar filtro ${etiqueta}`}
      >
        <X size={12} aria-hidden />
      </button>
    </span>
  );
}
