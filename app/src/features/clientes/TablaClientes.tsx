import { useMemo, useState, type ReactNode } from "react";
import { Boton } from "../../components/ui/Boton.tsx";
import { Tabla, type ColumnaTabla } from "../../components/ui/Tabla.tsx";
import { Tarjeta } from "../../components/ui/Tarjeta.tsx";
import { consumoDeCliente, saldoDeCliente } from "../../lib/agregaciones.ts";
import {
  formatoDecimal,
  formatoEntero,
  formatoMoneda,
  formatoPorcentaje,
} from "../../lib/formato.ts";
import type { Cliente, FiltrosEstado, SegmentoDef } from "../../types/index.ts";
import styles from "./TablaClientes.module.css";

type Props = {
  clientes: Cliente[];
  filtros: FiltrosEstado;
  segmentos: SegmentoDef[];
  onSeleccionar: (cliente: Cliente) => void;
};

type SortId =
  | "nombre" | "segmento" | "ciudad" | "nProductos"
  | "saldo" | "consumo" | "trx" | "ticket" | "util" | "recencia";

function valorFila(c: Cliente, filtros: FiltrosEstado) {
  const cons = consumoDeCliente(c, filtros.categoria);
  const saldo = saldoDeCliente(c, filtros.producto);
  const ticket = cons.transacciones === 0 ? 0 : cons.consumo / cons.transacciones;
  return { cons, saldo, ticket };
}

function cmp(a: Cliente, b: Cliente, id: SortId, filtros: FiltrosEstado): number {
  const va = valorFila(a, filtros);
  const vb = valorFila(b, filtros);
  if (id === "nombre") return a.nombre.localeCompare(b.nombre, "es");
  if (id === "segmento") return a.segmento.localeCompare(b.segmento, "es");
  if (id === "ciudad") return a.ciudad.localeCompare(b.ciudad, "es");
  if (id === "nProductos") return a.nProductos - b.nProductos;
  if (id === "saldo") return va.saldo - vb.saldo;
  if (id === "consumo") return va.cons.consumo - vb.cons.consumo;
  if (id === "trx") return va.cons.transacciones - vb.cons.transacciones;
  if (id === "ticket") return va.ticket - vb.ticket;
  if (id === "util") return (a.utilizacionTC ?? -1) - (b.utilizacionTC ?? -1);
  return (a.recenciaDias ?? 99999) - (b.recenciaDias ?? 99999);
}

export function TablaClientes({ clientes, filtros, segmentos, onSeleccionar }: Props) {
  const [sortId, setSortId] = useState<SortId>("saldo");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const color = (n: string) => segmentos.find((s) => s.nombre === n)?.color ?? "var(--s6)";

  const ordenados = useMemo(() => {
    const lista = [...clientes];
    lista.sort((a, b) => {
      const r = cmp(a, b, sortId, filtros);
      return sortDir === "asc" ? r : -r;
    });
    return lista;
  }, [clientes, filtros, sortId, sortDir]);

  const totalPages = Math.max(1, Math.ceil(ordenados.length / pageSize));
  const paginaActual = Math.min(page, totalPages - 1);
  const slice = ordenados.slice(paginaActual * pageSize, paginaActual * pageSize + pageSize);

  const onSort = (id: string) => {
    const next = id as SortId;
    if (sortId === next) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortId(next); setSortDir("desc"); }
    setPage(0);
  };

  const col = (
    id: SortId, encabezado: string, render: (c: Cliente) => ReactNode, numerica?: boolean,
  ): ColumnaTabla<Cliente> => ({ id, encabezado, numerica, ordenar: () => 0, render });

  const columnas: ColumnaTabla<Cliente>[] = [
    col("nombre", "Cliente", (c) => (<><strong>{c.nombre}</strong><div className={styles.cardMeta}>{c.id}</div></>)),
    col("segmento", "Segmento", (c) => (<><span className={styles.punto} style={{ background: color(c.segmento) }} />{c.segmento}</>)),
    col("ciudad", "Ciudad", (c) => c.ciudad),
    col("nProductos", "Productos", (c) => <span title={c.productos.join(", ")}>{c.nProductos}</span>, true),
    col("saldo", "Saldo total", (c) => formatoMoneda(valorFila(c, filtros).saldo), true),
    col("consumo", "Consumo total", (c) => formatoMoneda(valorFila(c, filtros).cons.consumo), true),
    col("trx", "Transacciones", (c) => formatoEntero(valorFila(c, filtros).cons.transacciones), true),
    col("ticket", "Ticket promedio", (c) => formatoDecimal(valorFila(c, filtros).ticket), true),
    col("util", "Utilización TC", (c) => c.utilizacionTC === null ? "—" : formatoPorcentaje(c.utilizacionTC * 100), true),
    col("recencia", "Recencia", (c) => (c.recenciaDias === null ? "—" : `${c.recenciaDias} d`), true),
  ];

  return (
    <>
      <div className={styles.tablaDesk}>
        <Tabla columnas={columnas} filas={slice} clave={(c) => c.id} sortId={sortId} sortDir={sortDir} onSort={onSort} onFila={onSeleccionar} />
      </div>
      <div className={styles.cards}>
        {slice.map((c) => {
          const v = valorFila(c, filtros);
          return (
            <Tarjeta key={c.id} onClick={() => onSeleccionar(c)} ariaLabel={c.nombre}>
              <strong>{c.nombre}</strong>
              <p className={styles.cardMeta}>{c.id} · {c.ciudad} · {c.segmento}</p>
              <div className={styles.cardNums}>
                <span>Saldo {formatoMoneda(v.saldo)}</span>
                <span>Consumo {formatoMoneda(v.cons.consumo)}</span>
                <span>Trx {formatoEntero(v.cons.transacciones)}</span>
                <span>Ticket {formatoDecimal(v.ticket)}</span>
              </div>
            </Tarjeta>
          );
        })}
      </div>
      <div className={styles.paginacion}>
        <p className={styles.info}>Página {paginaActual + 1} de {totalPages}</p>
        <div className={styles.acciones}>
          <label className={styles.info} htmlFor="pageSize">Filas</label>
          <select id="pageSize" className={styles.select} value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <Boton disabled={paginaActual === 0} onClick={() => setPage((p) => p - 1)}>Anterior</Boton>
          <Boton disabled={paginaActual >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Siguiente</Boton>
        </div>
      </div>
    </>
  );
}
