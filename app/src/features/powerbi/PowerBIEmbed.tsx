import { models } from "powerbi-client";
import { PowerBIEmbed as EmbedReact } from "powerbi-client-react";
import { useMemo, useState } from "react";
import { EstadoError } from "../../components/ui/EstadoError.tsx";
import { leerConfig } from "./powerbi.config.ts";
import styles from "./PowerBIEmbed.module.css";

export function PowerBIEmbed() {
  const cfg = leerConfig();
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const embedConfig = useMemo(
    () => ({
      type: "report" as const,
      id: cfg.reportId,
      embedUrl: cfg.embedUrl,
      accessToken: cfg.embedToken,
      tokenType: models.TokenType.Embed,
      groupId: cfg.workspaceId,
      settings: {
        panes: {
          filters: { visible: false },
          pageNavigation: { visible: true },
        },
      },
    }),
    [cfg.embedUrl, cfg.embedToken, cfg.reportId, cfg.workspaceId, tick],
  );

  const handlers = useMemo(
    () =>
      new Map<string, () => void>([
        ["loaded", () => setError(null)],
        ["rendered", () => setError(null)],
        ["error", () => setError("El reporte no pudo renderizarse.")],
      ]),
    [],
  );

  if (error) {
    return (
      <div className={styles.error}>
        <EstadoError
          mensaje={error}
          onReintentar={() => {
            setError(null);
            setTick((n) => n + 1);
          }}
        />
      </div>
    );
  }

  return (
    <div className={styles.caja}>
      <EmbedReact
        embedConfig={embedConfig}
        eventHandlers={handlers}
        cssClassName={styles.embed}
      />
    </div>
  );
}
