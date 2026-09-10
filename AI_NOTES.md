# AI_NOTES

Herramientas de IA usadas en este entregable y para qué.

## Cursor (Agent)

- **Aplicación React + TypeScript:** se construyó la app web (Vite, rutas, filtros, KPIs, gráficos, explorador de clientes, segmentos e integración Power BI) a partir del prompt técnico y de las capturas del dashboard.
- **Documentación:** se redactaron los README de ejecución, Power BI, integración Microsoft 365 / SPFx y estas notas.
- **Publicación:** se preparó la estructura del repositorio GitHub y la configuración para desplegar en Vercel.

## Python / Pandas (notebook propio)

- La **limpieza y segmentación** no se reescribieron con IA como script nuevo.
- El análisis original está en `analysis/analysis.ipynb` (notebook enviado: *Prueba_Liskeyla_Macias*).
- La app web consume una vista agregada por cliente (`app/public/data/clientes.json` y `meta.json`) derivada de `data/dataset_clean.csv` para no cargar 22.455 filas transaccionales en el navegador.

## Power BI

- El archivo `powerbi/dashboard.pbix` es el reporte original (*Resumen ejecutivo*).
- Las capturas en `app/public/img/powerbi-*.png` se usaron como referencia visual y como fallback cuando el embed no está licenciado.

## Qué no hizo la IA

- No inventó clientes ni columnas: los indicadores salen del dataset sintético de la prueba.
- No publicó el reporte en el servicio Power BI (licencia / permisos restringidos).
- El login `demo` / `demo123` es solo de demostración, no un IdP corporativo.
