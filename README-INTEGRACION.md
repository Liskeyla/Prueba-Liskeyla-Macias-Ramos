# README — Integración / automatización (Microsoft 365 y SPFx)

Criterio técnico de la prueba: no se construyó un flujo complejo de Power Automate.
Esta nota explica cómo llevar la solución a un ecosistema corporativo.

## 1. Cómo llevar la app a SharePoint Framework (SPFx)

La app se diseñó para que los componentes visuales sean **portables** a un web part React de SPFx:

1. **Sin estilos globales que contaminen la página.** Tokens en CSS y estilos con CSS Modules. En SPFx un `* { }` o un framework de UI global rompe el chrome de SharePoint.
2. **Componentes de presentación puros.** Reciben datos por props. El `fetch` vive en `DatosProvider`; no dentro de `Tarjeta`, `Tabla` o los gráficos.
3. **Sin React Router dentro de los visuales.** La navegación se inyecta por callbacks (`onNavigate`). En SPFx se reemplaza el router por el propio host o por pestañas del web part.
4. **Sin APIs exclusivas de Vite/Next.** Solo React + TypeScript estándar.

### Adaptación concreta

| Hoy (Vite) | En SPFx |
|---|---|
| `AppLayout` + React Router | Un web part con property pane (página inicial, workspace, reportId) |
| `fetch('/data/clientes.json')` | `SPHttpClient` o MS Graph contra una lista / biblioteca |
| `sessionStorage` demo | Contexto de `PageContext.user` (Azure AD ya autenticado) |
| `BarraFiltros` + Context | El mismo Context; el state puede persistirse en `sessionStorage` o query de la página |
| `/powerbi` | Web part nativo de Power BI **o** el `PowerBIEmbed` ya implementado |

Pasos sugeridos:

1. `yo @microsoft/sharepoint` → web part React.
2. Copiar `src/components`, `src/lib`, `src/features/*` (sin `LoginPage` si SharePoint ya autentica).
3. Empaquetar `clientes.json` / `meta.json` como assets del solution **o** leerlos de una biblioteca.
4. Configurar `reportId` y `workspaceId` en el *property pane*.
5. Desplegar el `.sppkg` al App Catalog y añadir el web part a una página de sitio.

## 2. Dónde guardar datos, permisos y parámetros

Escenario corporativo (no esta demo estática):

| Qué | Dónde | Permisos |
|---|---|---|
| Dataset maestro | Lista de SharePoint, Dataverse o lakehouse de Fabric | Sitio / entorno con RLS o grupos Entra |
| Vista agregada para la app | Biblioteca `Site Assets` o Azure Blob + CDN | Lectura para el grupo de analistas |
| Parámetros (fecha de corte, umbrales de *lover*, ventana de vencimiento) | Property pane del web part + lista de configuración | Owners del sitio |
| Reporte Power BI | Workspace de Fabric / Power BI | Viewer / Contributor según rol |
| Secretos (client secret del embed) | Azure Key Vault; **nunca** en el frontend ni en el `.sppkg` | Managed Identity de la Function |
| Auditoría de exportación CSV | Application Insights o lista de log | Compliance / auditoría |

Grupos Entra recomendados: `Analitica-Lectura`, `Analitica-Edicion`, `Analitica-Admin`.

## 3. Automatización simple de valor: alerta de vencimiento

**Objetivo:** avisar 30 días antes del vencimiento de productos aplicables (créditos / tarjeta), no de cuentas sin fecha.

**Disparador:** Power Automate — *Recurrence* diaria (o *When an item is created or modified* si el origen es una lista).

**Pasos:**

1. Leer productos con `fecha_vencimiento` no nula y `aplica_vencimiento = SI`.
2. Filtrar `fecha_vencimiento` entre hoy y hoy + 30.
3. Agrupar por ejecutivo / ciudad / segmento.
4. Si el conteo > 0:
   - Publicar un mensaje en un canal de **Teams** (*Cartera — vencimientos*).
   - Enviar un correo al dueño de cartera con la tabla (cliente, producto, días, saldo).
   - Opcional: crear un ítem en una lista `Alertas_Vencimiento` para seguimiento.

**Valor:** el dashboard muestra el stock; el flujo empuja la acción el día en que el vencimiento entra en ventana. No requiere orquestación compleja.

Otras automatizaciones de bajo costo, si se priorizan después:

- Alerta de **cupo ocioso** (utilización TC < 20 % y cupo > umbral).
- Recordatorio de **clientes Solo ahorro / Sin consumo** para campaña de activación.
