import type { LucideIcon } from "lucide-react";
import { Landmark } from "lucide-react";
import { cx } from "../../lib/formato.ts";
import styles from "./Sidebar.module.css";

export type ItemNav = {
  to: string;
  label: string;
  icon: LucideIcon;
};

type Props = {
  items: ItemNav[];
  activo: string;
  abierto: boolean;
  onNavigate: (to: string) => void;
};

export function Sidebar({ items, activo, abierto, onNavigate }: Props) {
  return (
    <aside className={cx(styles.aside, abierto && styles.abierto)} aria-label="Principal">
      <div className={styles.marca}>
        <Landmark size={22} aria-hidden />
        <span className={styles.marcaTexto}>Cartera</span>
      </div>
      <nav className={styles.nav}>
        {items.map((item) => {
          const Icono = item.icon;
          const esActivo = activo === item.to;
          return (
            <button
              key={item.to}
              type="button"
              className={cx(styles.item, esActivo && styles.activo)}
              aria-current={esActivo ? "page" : undefined}
              aria-label={item.label}
              onClick={() => onNavigate(item.to)}
            >
              <Icono size={20} aria-hidden />
              <span className={styles.etiqueta}>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
