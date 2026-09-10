export type TipoConsumo = "Consumo aplicable" | "NO APLICA";
export type TipoProducto = "Captación" | "Colocación" | "Tarjeta";

export type SegmentoDef = {
  nombre: string;
  tipo: string;
  categorias: string;
  criterio: string;
  queObservamos: string;
  oportunidad: string;
  accion: string;
  color: string;
};

export type Meta = {
  fechaCorte: string;
  meses: string[];
  ciudades: string[];
  productos: string[];
  categorias: string[];
  segmentosComerciales: string[];
  canales: string[];
  categoriaAGrupoLover: Record<string, string>;
  tipoDeProducto: Record<string, TipoProducto>;
  segmentos: SegmentoDef[];
  kpisDeControl: Record<string, number>;
};

export type Cliente = {
  id: string;
  nombre: string;
  segmento: string;
  segmentoComercial: string;
  ciudad: string;
  edad: number;
  ingreso: number;
  productos: string[];
  nProductos: number;
  multiproducto: boolean;
  saldoPorProducto: Record<string, number>;
  cupoPorProducto: Record<string, number>;
  saldoTotal: number;
  saldoTarjeta: number;
  cupoTotal: number;
  utilizacionTC: number | null;
  consumoTotal: number;
  transacciones: number;
  ticketPromedio: number;
  recenciaDias: number | null;
  ultimaTransaccion: string | null;
  tipoConsumo: TipoConsumo;
  consumoPorCategoria: Record<string, [number, number]>;
  consumoPorCanal: Record<string, number>;
  consumoMensual: number[];
  diasProximoVencimiento: number | null;
};

export type FiltrosEstado = {
  segmento: string[];
  ciudad: string[];
  producto: string[];
  categoria: string[];
};

export type DimensionFiltro = keyof FiltrosEstado;

export type Kpis = {
  clientesUnicos: number;
  saldoTotal: number;
  saldoPromedio: number;
  consumoTotal: number;
  consumoPromedio: number;
  transacciones: number;
  ticketPromedio: number;
  clientesMultiproducto: number;
  clientesSinConsumo: number;
  utilizacionTC: number;
};

export type AgregadoSegmento = {
  nombre: string;
  color: string;
  clientes: number;
  pctClientes: number;
  saldo: number;
  consumo: number;
  pctConsumo: number;
  ticketPromedio: number;
  consumoPromedio: number;
};

export type PuntoMensual = {
  mes: string;
  consumo: number;
};

export type EstadoCarga = "cargando" | "listo" | "error";
