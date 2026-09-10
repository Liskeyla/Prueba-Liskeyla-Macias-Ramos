import type { KeyboardEvent, ReactNode } from "react";
import { cx } from "../../lib/formato.ts";
import styles from "./Tarjeta.module.css";

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export function Tarjeta({ children, className, onClick, ariaLabel }: Props) {
  const clases = cx(styles.tarjeta, onClick && styles.clicable, className);

  if (onClick) {
    const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    };
    return (
      <div
        className={clases}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onKey}
        aria-label={ariaLabel}
      >
        {children}
      </div>
    );
  }

  return <div className={clases}>{children}</div>;
}
