# README — Integración Power BI

El reporte original está en [`powerbi/dashboard.pbix`](powerbi/dashboard.pbix).
Enlace del servicio (restringido por licencia):
[Reporte en Power BI Service](https://app.powerbi.com/groups/me/reports/4cc39541-69a0-44cc-b38d-f24afe67e162?ctid=b7af8caf-83d8-4644-85ae-317c545223c1&pbi_source=linkShare)

La pantalla `/powerbi` de la app React **ya tiene el componente de embed**.
Si no hay variables de entorno, muestra un estado de configuración pendiente y las capturas del dashboard.

## Qué hay implementado

| Artefacto | Ubicación |
|---|---|
| Componente embed | `app/src/features/powerbi/PowerBIEmbed.tsx` |
| Configuración | `app/src/features/powerbi/powerbi.config.ts` |
| Pantalla | `app/src/features/powerbi/PowerBIPage.tsx` |
| Variables | `app/.env.example` |
| Capturas | `app/public/img/powerbi-01.png` … `powerbi-03.png` |
| PBIX | `powerbi/dashboard.pbix` |

`estaConfigurado()` es `true` solo si existen las cuatro variables:

```
VITE_POWERBI_EMBED_URL=
VITE_POWERBI_REPORT_ID=
VITE_POWERBI_EMBED_TOKEN=
VITE_POWERBI_WORKSPACE_ID=
```

## Tres vías de integración

### 1. Publicar en la web (*Publish to web*)

- La más simple para una **demo pública**.
- Genera una URL de iframe sin autenticación.
- **No es apta para datos reales:** el reporte queda accesible para cualquiera que tenga el enlace.
- En esta prueba el servicio está restringido por licenciamiento, por eso no se usó.

### 2. Embed for your organization

- Requiere **Power BI Pro** (o Premium por usuario) tanto para quien publica como para quien ve.
- Autenticación con **Microsoft Entra ID**.
- Adecuada si el visor ya está en el tenant (SharePoint, Teams, intranet).
- Credenciales / IDs necesarios:
  - `reportId`
  - `workspaceId` (grupo)
  - Tenant ID
  - El usuario debe tener permiso de lectura sobre el workspace

### 3. Embed for your customers (*app owns data*) — vía de producción

- Un **service principal** (aplicación Entra ID) obtiene el *embed token* en un **backend**.
- Requiere capacidad reservada (Embedded o Fabric/Premium).
- El frontend **nunca** ve el secret ni las credenciales del service principal.
- Flujo:
  1. El backend autentica el service principal (`client_id` + `client_secret` + `tenant_id`).
  2. Llama a la API de Power BI: `GenerateToken` sobre el `reportId`.
  3. Devuelve al frontend solo `{ embedUrl, embedToken, reportId }` con TTL corto.
  4. React usa `powerbi-client-react` con `tokenType: models.TokenType.Embed`.

## Qué faltaría para completar el embed en esta demo

1. Licencia Power BI Pro (o capacidad Embedded) y permiso de **publicar** el `.pbix`.
2. Workspace ID y Report ID del reporte publicado.
3. En demo de evaluación: un *embed token* temporal (solo por variable de entorno).
4. En producción: un backend (Azure Function / API) que emita el token. **El embed token jamás se coloca en el frontend en producción**; aquí se admite en `.env` únicamente para la evaluación.

IDs de referencia del enlace compartido (no bastan sin permisos):

- Report ID: `4cc39541-69a0-44cc-b38d-f24afe67e162`
- Tenant ID: `b7af8caf-83d8-4644-85ae-317c545223c1`
