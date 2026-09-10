const LOCALE = "es-EC";

function num(valor: number, decimales: number): string {
  return valor.toLocaleString(LOCALE, {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
}

export function formatoEntero(valor: number): string {
  return num(valor, 0);
}

export function formatoDecimal(valor: number): string {
  return num(valor, 2);
}

export function formatoPorcentaje(valor: number): string {
  return `${num(valor, 1)} %`;
}

export function formatoMoneda(valor: number): string {
  return `USD ${num(valor, 2)}`;
}

export function formatoMonedaCompacta(valor: number): string {
  const signo = valor < 0 ? "-" : "";
  const abs = Math.abs(valor);
  if (abs >= 1_000_000_000) {
    return `${signo}USD ${num(abs / 1_000_000_000, 1)} B`;
  }
  if (abs >= 1_000_000) {
    return `${signo}USD ${num(abs / 1_000_000, 1)} M`;
  }
  if (abs >= 1_000) {
    return `${signo}USD ${num(abs / 1_000, 1)} mil`;
  }
  return `${signo}${formatoMoneda(abs)}`;
}

export function formatoFecha(iso: string): string {
  const [anio, mes, dia] = iso.split("-");
  if (!anio || !mes || !dia) return iso;
  return `${dia}/${mes}/${anio}`;
}

export function formatoMes(ym: string): string {
  const [anio, mes] = ym.split("-");
  const nombres = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic",
  ];
  const idx = Number(mes) - 1;
  const etiqueta = nombres[idx] ?? mes;
  return `${etiqueta} ${anio?.slice(2) ?? ""}`;
}

export function cx(...partes: Array<string | false | undefined>): string {
  return partes.filter(Boolean).join(" ");
}
