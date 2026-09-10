# Prueba Liskeyla Macías Ramos

Aplicación web de analítica de cartera de clientes (datos **sintéticos** de evaluación) + notebook de limpieza + modelo Power BI.

**URL única de todos los entregables:** [https://github.com/Liskeyla/Prueba-Liskeyla-Macias-Ramos](https://github.com/Liskeyla/Prueba-Liskeyla-Macias-Ramos)
**URL Publica del desarrollo web de vercel:** https://prueba-liskeyla-macias-ramos.vercel.app/ 
La app React se publica en Vercel importando ese repositorio (ver *Despliegue*).

| Entregable | Ruta |
|---|---|
| Dataset limpio | [`data/dataset_clean.xlsx`](data/dataset_clean.xlsx) |
| Vista por cliente (app) | [`data/dataset_clean.json`](data/dataset_clean.json), [`data/meta.json`](data/meta.json) |
| Notebook de limpieza y análisis | [`analysis/analysis.ipynb`](analysis/analysis.ipynb) |
| Dashboard Power BI | [`powerbi/dashboard.pbix`](powerbi/dashboard.pbix) |
| Aplicación React | [(https://prueba-liskeyla-macias-ramos.vercel.app/) |
| Limpieza: supuestos y segmentos | [`README-DATOS.md`](README-DATOS.md) |
| Dashboard: indicadores y storytelling | [`README-DASHBOARD.md`](README-DASHBOARD.md) |
| Power BI embed | [`README-POWERBI.md`](README-POWERBI.md) |
| SPFx / Microsoft 365 | [`README-INTEGRACION.md`](README-INTEGRACION.md) |
| Uso de IA | [`AI_NOTES.md`](AI_NOTES.md) |

---

## Cómo ejecutar la aplicación

Requisitos: **Node.js 20+**.

```bash
cd app
npm install
npm run dev
```

Abre `http://localhost:5173`.

**Credenciales de demostración:** usuario `demo` · contraseña `demo123`

Scripts:

```bash
npm test      # agregados vs kpisDeControl
npm run build # producción
npm run preview
```

No hay backend. Los datos se cargan con `fetch` desde `app/public/data/` (`clientes.json` ~2 MB, no entra al bundle).

---

## Decisiones técnicas

- **Vite + React + TypeScript** (no Next.js): JSON estático, build portable, componentes desacoplados para SPFx.
- **Sin librería de UI ni Tailwind:** CSS Modules + tokens. En SharePoint un estilo global contamina la página anfitriona.
- **Sin Redux/Zustand:** Context (`Datos`, `Filtros`, `Auth`) + hooks.
- **Recharts** para gráficos; **lucide-react** para iconos.

### Reglas de agregación (alineadas al dashboard)

1. El **saldo es un estado**: se suma `saldoTotal` una vez por cliente. Con filtro de producto se usa `saldoPorProducto`.
2. El **ticket** es consumo / transacciones del conjunto filtrado, no el promedio de promedios.
3. **NO APLICA** no es categoría ni segmento.
4. El **consumo promedio** divide entre **todos** los clientes filtrados (incluidos los 545 sin consumo).
5. **Hoy** es `meta.fechaCorte` (`2026-08-31`), nunca `new Date()`.

Portabilidad SPFx: ver [README-INTEGRACION.md](README-INTEGRACION.md).

---

## Despliegue en Vercel

1. Entra a [vercel.com/new](https://vercel.com/new) e inicia sesión (GitHub).
2. Importa **Liskeyla/Prueba-Liskeyla-Macias-Ramos**.
3. **Root Directory:** `app` (preset Vite).  
   Si dejas la raíz del repo, el `vercel.json` de la raíz instala y construye `app/`.
4. Deploy. Queda una URL permanente tipo `https://prueba-liskeyla-macias-ramos.vercel.app`.
5. Variables Power BI (opcionales): `VITE_POWERBI_*` — ver [README-POWERBI.md](README-POWERBI.md).

Sin esas variables la ruta `/powerbi` muestra el estado de configuración pendiente y las capturas del reporte.

En esta máquina no había sesión de Vercel CLI; el bonus de URL pública se completa al importar el repo (un clic). El repositorio GitHub ya contiene código, notebook, PBIX y READMEs.

---

## Estructura

```
/
  data/          dataset_clean.xlsx | dataset_clean.json | meta.json
  analysis/      analysis.ipynb
  powerbi/       dashboard.pbix
  app/           proyecto React (Vite)
  README.md
  README-DATOS.md
  README-DASHBOARD.md
  README-POWERBI.md
  README-INTEGRACION.md
  AI_NOTES.md
```
