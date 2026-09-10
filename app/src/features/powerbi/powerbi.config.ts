/* El embed token jamás debe colocarse en el frontend en producción.
   En un entorno real el backend obtiene el token con un service principal
   y el cliente solo recibe un token de corta duración. En esta demo se
   admite por variable de entorno únicamente para evaluación. */

export type PowerBIConfig = {
  embedUrl: string;
  reportId: string;
  embedToken: string;
  workspaceId: string;
};

function leer(clave: keyof ImportMetaEnv): string {
  return (import.meta.env[clave] ?? "").trim();
}

export function leerConfig(): PowerBIConfig {
  return {
    embedUrl: leer("VITE_POWERBI_EMBED_URL"),
    reportId: leer("VITE_POWERBI_REPORT_ID"),
    embedToken: leer("VITE_POWERBI_EMBED_TOKEN"),
    workspaceId: leer("VITE_POWERBI_WORKSPACE_ID"),
  };
}

export function estaConfigurado(): boolean {
  const cfg = leerConfig();
  return (
    cfg.embedUrl.length > 0 &&
    cfg.reportId.length > 0 &&
    cfg.embedToken.length > 0 &&
    cfg.workspaceId.length > 0
  );
}
