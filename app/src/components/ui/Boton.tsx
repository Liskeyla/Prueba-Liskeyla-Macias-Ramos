import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/formato.ts";
import styles from "./Boton.module.css";

type Variante = "primario" | "secundario" | "fantasma" | "peligro";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: Variante;
  icono?: boolean;
  children: ReactNode;
};

export function Boton({
  variante = "secundario",
  icono = false,
  className,
  children,
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={cx(styles.boton, styles[variante], icono && styles.icono, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
