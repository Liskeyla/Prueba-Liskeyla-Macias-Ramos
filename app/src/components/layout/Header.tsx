import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatoFecha } from "../../lib/formato.ts";
import { Boton } from "../ui/Boton.tsx";
import styles from "./Header.module.css";

type Props = {
  titulo: string;
  fechaCorte: string | null;
  usuario: string;
  onLogout: () => void;
  onMenu: () => void;
};

export function Header({ titulo, fechaCorte, usuario, onLogout, onMenu }: Props) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDoc);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDoc);
    };
  }, [abierto]);

  return (
    <header className={styles.header}>
      <div className={styles.izq}>
        <Boton
          variante="fantasma"
          icono
          className={styles.menuBtn}
          aria-label="Abrir menú de navegación"
          onClick={onMenu}
        >
          <Menu size={20} aria-hidden />
        </Boton>
        <div className={styles.meta}>
          <h1>{titulo}</h1>
          {fechaCorte && (
            <p className={styles.fecha}>Fecha de corte · {formatoFecha(fechaCorte)}</p>
          )}
        </div>
      </div>
      <div className={styles.der} ref={ref}>
        <button
          type="button"
          className={styles.usuario}
          aria-haspopup="menu"
          aria-expanded={abierto}
          onClick={() => setAbierto((v) => !v)}
        >
          {usuario}
        </button>
        {abierto && (
          <div className={styles.menu} role="menu">
            <button
              type="button"
              className={styles.menuItem}
              role="menuitem"
              onClick={onLogout}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
