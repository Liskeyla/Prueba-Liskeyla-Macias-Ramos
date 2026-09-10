import type {
  AgregadoSegmento,
  Cliente,
  FiltrosEstado,
  Kpis,
  PuntoMensual,
  SegmentoDef,
} from "../types/index.ts";

export const FILTROS_VACIOS: FiltrosEstado = {
  segmento: [],
  ciudad: [],
  producto: [],
  categoria: [],
};

export function hayFiltros(filtros: FiltrosEstado): boolean {
  return (
    filtros.segmento.length +
      filtros.ciudad.length +
      filtros.producto.length +
      filtros.categoria.length >
    0
  );
}

export function clientePasaFiltros(cliente: Cliente, filtros: FiltrosEstado): boolean {
  if (filtros.segmento.length > 0 && !filtros.segmento.includes(cliente.segmento)) {
    return false;
  }
  if (filtros.ciudad.length > 0 && !filtros.ciudad.includes(cliente.ciudad)) {
    return false;
  }
  if (
    filtros.producto.length > 0 &&
    !filtros.producto.some((p) => cliente.productos.includes(p))
  ) {
    return false;
  }
  if (filtros.categoria.length > 0) {
    const tiene = filtros.categoria.some((cat) => {
      if (cat === "NO APLICA") return false;
      const par = cliente.consumoPorCategoria[cat];
      return par !== undefined && par[0] > 0;
    });
    if (!tiene) return false;
  }
  return true;
}

export function filtrarClientes(clientes: Cliente[], filtros: FiltrosEstado): Cliente[] {
  if (!hayFiltros(filtros)) return clientes;
  return clientes.filter((c) => clientePasaFiltros(c, filtros));
}

export function saldoDeCliente(cliente: Cliente, productos: string[]): number {
  if (productos.length === 0) return cliente.saldoTotal;
  return productos.reduce((acc, p) => acc + (cliente.saldoPorProducto[p] ?? 0), 0);
}

export function consumoDeCliente(
  cliente: Cliente,
  categorias: string[],
): { consumo: number; transacciones: number } {
  if (categorias.length === 0) {
    return { consumo: cliente.consumoTotal, transacciones: cliente.transacciones };
  }
  let consumo = 0;
  let transacciones = 0;
  for (const cat of categorias) {
    if (cat === "NO APLICA") continue;
    const par = cliente.consumoPorCategoria[cat];
    if (!par) continue;
    consumo += par[0];
    transacciones += par[1];
  }
  return { consumo, transacciones };
}

export function calcularKpis(clientes: Cliente[], filtros: FiltrosEstado): Kpis {
  const n = clientes.length;
  let saldo = 0;
  let consumo = 0;
  let trx = 0;
  let multi = 0;
  let sin = 0;
  let saldoTc = 0;
  let cupo = 0;

  for (const c of clientes) {
    saldo += saldoDeCliente(c, filtros.producto);
    const cons = consumoDeCliente(c, filtros.categoria);
    consumo += cons.consumo;
    trx += cons.transacciones;
    if (c.multiproducto) multi += 1;
    if (cons.consumo <= 0) sin += 1;
    if (c.cupoTotal > 0) {
      saldoTc += c.saldoTarjeta;
      cupo += c.cupoTotal;
    }
  }

  return {
    clientesUnicos: n,
    saldoTotal: saldo,
    saldoPromedio: n === 0 ? 0 : saldo / n,
    consumoTotal: consumo,
    consumoPromedio: n === 0 ? 0 : consumo / n,
    transacciones: trx,
    ticketPromedio: trx === 0 ? 0 : consumo / trx,
    clientesMultiproducto: multi,
    clientesSinConsumo: sin,
    utilizacionTC: cupo === 0 ? 0 : (100 * saldoTc) / cupo,
  };
}

export function agregarPorSegmento(
  clientes: Cliente[],
  segmentos: SegmentoDef[],
  filtros: FiltrosEstado,
): AgregadoSegmento[] {
  const n = clientes.length;
  const totalConsumo = clientes.reduce(
    (acc, c) => acc + consumoDeCliente(c, filtros.categoria).consumo,
    0,
  );

  return segmentos.map((s) => {
    const grupo = clientes.filter((c) => c.segmento === s.nombre);
    const k = calcularKpis(grupo, filtros);
    return {
      nombre: s.nombre,
      color: s.color,
      clientes: k.clientesUnicos,
      pctClientes: n === 0 ? 0 : (100 * k.clientesUnicos) / n,
      saldo: k.saldoTotal,
      consumo: k.consumoTotal,
      pctConsumo: totalConsumo === 0 ? 0 : (100 * k.consumoTotal) / totalConsumo,
      ticketPromedio: k.ticketPromedio,
      consumoPromedio: k.consumoPromedio,
    };
  });
}

export function consumoMensualAgregado(
  clientes: Cliente[],
  meses: string[],
): PuntoMensual[] {
  return meses.map((mes, i) => ({
    mes,
    consumo: clientes.reduce((acc, c) => acc + (c.consumoMensual[i] ?? 0), 0),
  }));
}

export function colorDeSegmento(segmentos: SegmentoDef[], nombre: string): string {
  return segmentos.find((s) => s.nombre === nombre)?.color ?? "var(--s6)";
}
