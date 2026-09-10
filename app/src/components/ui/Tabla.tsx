import type { KeyboardEvent, ReactNode } from "react";
import { cx } from "../../lib/formato.ts";
import styles from "./Tabla.module.css";

export type ColumnaTabla<T> = {
  id: string;
  encabezado: string;
  numerica?: boolean;
  render: (fila: T) => ReactNode;
  ordenar?: (a: T, b: T) => number;
};

type SortDir = "asc" | "desc";

type Props<T> = {
  columnas: ColumnaTabla<T>[];
  filas: T[];
  clave: (fila: T) => string;
  sortId?: string;
  sortDir?: SortDir;
  onSort?: (id: string) => void;
  onFila?: (fila: T) => void;
};

export function Tabla<T>({
  columnas,
  filas,
  clave,
  sortId,
  sortDir,
  onSort,
  onFila,
}: Props<T>) {
  return (
    <div className={styles.wrap}>
      <table className={styles.tabla}>
        <thead>
          <tr>
            {columnas.map((col) => {
              const ariaSort =
                sortId === col.id
                  ? sortDir === "asc"
                    ? "ascending"
                    : "descending"
                  : "none";
              return (
                <th
                  key={col.id}
                  scope="col"
                  className={cx(
                    styles.th,
                    col.numerica && styles.num,
                    col.ordenar && styles.sortable,
                  )}
                  aria-sort={ariaSort}
                  onClick={col.ordenar && onSort ? () => onSort(col.id) : undefined}
                >
                  {col.encabezado}
                  {sortId === col.id ? (sortDir === "asc" ? " ↑" : " ↓") : ""}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => {
            const onKey = (e: KeyboardEvent<HTMLTableRowElement>) => {
              if (!onFila) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onFila(fila);
              }
            };
            return (
              <tr
                key={clave(fila)}
                className={cx(styles.fila, onFila && styles.filaClic)}
                tabIndex={onFila ? 0 : undefined}
                onClick={onFila ? () => onFila(fila) : undefined}
                onKeyDown={onFila ? onKey : undefined}
              >
                {columnas.map((col) => (
                  <td
                    key={col.id}
                    className={cx(styles.td, col.numerica && styles.num)}
                  >
                    {col.render(fila)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
