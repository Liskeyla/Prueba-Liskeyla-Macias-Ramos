import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { Cliente, FiltrosEstado, Meta } from "../types/index.ts";
import { calcularKpis, FILTROS_VACIOS } from "./agregaciones.ts";

const CLAVES_KPI = [
  "clientesUnicos",
  "saldoTotal",
  "saldoPromedio",
  "consumoTotal",
  "consumoPromedio",
  "transacciones",
  "ticketPromedio",
  "clientesMultiproducto",
  "clientesSinConsumo",
  "utilizacionTC",
] as const;

const fixtureClientes: Cliente[] = [
  {
    id: "C1",
    nombre: "Ana",
    segmento: "Food Lovers",
    segmentoComercial: "MASS",
    ciudad: "Quito",
    edad: 30,
    ingreso: 1200,
    productos: ["Cuenta de Ahorros", "Tarjeta de Crédito"],
    nProductos: 2,
    multiproducto: true,
    saldoPorProducto: { "Cuenta de Ahorros": 100, "Tarjeta de Crédito": 50 },
    cupoPorProducto: { "Tarjeta de Crédito": 200 },
    saldoTotal: 150,
    saldoTarjeta: 50,
    cupoTotal: 200,
    utilizacionTC: 0.25,
    consumoTotal: 80,
    transacciones: 4,
    ticketPromedio: 20,
    recenciaDias: 3,
    ultimaTransaccion: "2026-08-28",
    tipoConsumo: "Consumo aplicable",
    consumoPorCategoria: { FOOD: [80, 4] },
    consumoPorCanal: { POS: 80 },
    consumoMensual: [80],
    diasProximoVencimiento: 10,
  },
  {
    id: "C2",
    nombre: "Luis",
    segmento: "Solo Ahorro / Sin consumo",
    segmentoComercial: "MASS",
    ciudad: "Guayaquil",
    edad: 40,
    ingreso: 800,
    productos: ["Cuenta de Ahorros"],
    nProductos: 1,
    multiproducto: false,
    saldoPorProducto: { "Cuenta de Ahorros": 50 },
    cupoPorProducto: {},
    saldoTotal: 50,
    saldoTarjeta: 0,
    cupoTotal: 0,
    utilizacionTC: null,
    consumoTotal: 0,
    transacciones: 0,
    ticketPromedio: 0,
    recenciaDias: null,
    ultimaTransaccion: null,
    tipoConsumo: "NO APLICA",
    consumoPorCategoria: {},
    consumoPorCanal: {},
    consumoMensual: [0],
    diasProximoVencimiento: null,
  },
];

const fixtureMeta: Meta = {
  fechaCorte: "2026-08-31",
  meses: ["2026-08"],
  ciudades: ["Quito", "Guayaquil"],
  productos: ["Cuenta de Ahorros", "Tarjeta de Crédito"],
  categorias: ["FOOD"],
  segmentosComerciales: ["MASS"],
  canales: ["POS"],
  categoriaAGrupoLover: { FOOD: "Food Lovers" },
  tipoDeProducto: {
    "Cuenta de Ahorros": "Captación",
    "Tarjeta de Crédito": "Tarjeta",
  },
  segmentos: [],
  kpisDeControl: {
    clientesUnicos: 2,
    saldoTotal: 200,
    saldoPromedio: 100,
    consumoTotal: 80,
    consumoPromedio: 40,
    transacciones: 4,
    ticketPromedio: 20,
    clientesMultiproducto: 1,
    clientesSinConsumo: 1,
    utilizacionTC: 25,
  },
};

function cargarDatos(): { clientes: Cliente[]; meta: Meta } {
  const candidatos = [
    resolve(process.cwd(), "public/data"),
    resolve(process.cwd(), "../data"),
  ];
  for (const dir of candidatos) {
    const metaRuta = resolve(dir, "meta.json");
    const clientesRuta = resolve(dir, "clientes.json");
    if (existsSync(metaRuta) && existsSync(clientesRuta)) {
      return {
        meta: JSON.parse(readFileSync(metaRuta, "utf8")) as Meta,
        clientes: JSON.parse(readFileSync(clientesRuta, "utf8")) as Cliente[],
      };
    }
  }
  return { clientes: fixtureClientes, meta: fixtureMeta };
}

describe("agregaciones vs kpisDeControl", () => {
  it("sin filtros coincide con las claves de control", () => {
    const { clientes, meta } = cargarDatos();
    const filtros: FiltrosEstado = FILTROS_VACIOS;
    const kpis = calcularKpis(clientes, filtros);

    for (const clave of CLAVES_KPI) {
      expect(meta.kpisDeControl).toHaveProperty(clave);
      expect(kpis[clave]).toBeCloseTo(meta.kpisDeControl[clave], 1);
    }
  });
});
