import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { Boton } from "./Boton.tsx";
import styles from "./Drawer.module.css";

type Props = {
  abierto: boolean;
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
};

const SELECTOR =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

export function Drawer({ abierto, titulo, onCerrar, children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const panel = panelRef.current;
    const previo = document.activeElement as HTMLElement | null;
    const focusables = () =>
      panel ? Array.from(panel.querySelectorAll<HTMLElement>(SELECTOR)) : [];
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCerrar();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const lista = focusables();
      if (lista.length === 0) return;
      const primero = lista[0];
      const ultimo = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo?.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previo?.focus();
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={onCerrar} />
      <div
        className={styles.panel}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
      >
        <div className={styles.cabecera}>
          <h2>{titulo}</h2>
          <Boton variante="fantasma" icono aria-label="Cerrar ficha" onClick={onCerrar}>
            <X size={18} aria-hidden />
          </Boton>
        </div>
        <div className={styles.cuerpo}>{children}</div>
      </div>
    </>
  );
}
