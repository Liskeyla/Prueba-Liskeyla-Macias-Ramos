import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./SelectMultiple.module.css";

type Props = {
  etiqueta: string;
  opciones: string[];
  seleccion: string[];
  onChange: (valores: string[]) => void;
};

export function SelectMultiple({ etiqueta, opciones, seleccion, onChange }: Props) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!abierto) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [abierto]);

  const toggle = (opcion: string) => {
    if (seleccion.includes(opcion)) {
      onChange(seleccion.filter((v) => v !== opcion));
    } else {
      onChange([...seleccion, opcion]);
    }
  };

  const resumen =
    seleccion.length === 0
      ? "Todas"
      : seleccion.length === 1
        ? seleccion[0]
        : `${seleccion.length} seleccionadas`;

  return (
    <div className={styles.wrap} ref={ref}>
      <span className={styles.etiqueta} id={`${listId}-lbl`}>
        {etiqueta}
      </span>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-labelledby={`${listId}-lbl`}
        onClick={() => setAbierto((v) => !v)}
      >
        <span className={styles.valor}>{resumen}</span>
        <ChevronDown size={16} aria-hidden />
      </button>
      {abierto && (
        <ul className={styles.lista} role="listbox" aria-multiselectable>
          {opciones.map((op) => (
            <li key={op}>
              <label className={styles.opcion}>
                <input
                  type="checkbox"
                  checked={seleccion.includes(op)}
                  onChange={() => toggle(op)}
                />
                {op}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
