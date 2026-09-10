import type { Cliente } from "../types/index.ts";
import { consumoDeCliente, saldoDeCliente } from "./agregaciones.ts";
import type { FiltrosEstado } from "../types/index.ts";

function escapar(valor: string): string {
  if (/[",\n]/.test(valor)) {
    return `"${valor.replaceAll('"', '""')}"`;
  }
  return valor;
}

const ENCABEZADOS = [
  "id",
  "nombre",
  "segmento",
  "segmentoComercial",
  "ciudad",
  "productos",
  "saldoTotal",
  "consumoTotal",
  "transacciones",
  "ticketPromedio",
  "utilizacionTC",
  "recenciaDias",
];

export function clientesACsv(clientes: Cliente[], filtros: FiltrosEstado): string {
  const lineas = [ENCABEZADOS.join(",")];
  for (const c of clientes) {
    const cons = consumoDeCliente(c, filtros.categoria);
    const saldo = saldoDeCliente(c, filtros.producto);
    const ticket = cons.transacciones === 0 ? 0 : cons.consumo / cons.transacciones;
    const fila = [
      c.id,
      c.nombre,
      c.segmento,
      c.segmentoComercial,
      c.ciudad,
      c.productos.join("; "),
      saldo.toFixed(2),
      cons.consumo.toFixed(2),
      String(cons.transacciones),
      ticket.toFixed(2),
      c.utilizacionTC === null ? "" : (c.utilizacionTC * 100).toFixed(2),
      c.recenciaDias === null ? "" : String(c.recenciaDias),
    ];
    lineas.push(fila.map(escapar).join(","));
  }
  return lineas.join("\n");
}

export function descargarCsv(nombre: string, contenido: string): void {
  const blob = new Blob(["\uFEFF" + contenido], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}
