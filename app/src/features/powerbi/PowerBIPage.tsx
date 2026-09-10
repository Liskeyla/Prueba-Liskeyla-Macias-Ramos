import { useState } from "react";
import { Tarjeta } from "../../components/ui/Tarjeta.tsx";
import { PowerBIEmbed } from "./PowerBIEmbed.tsx";
import { estaConfigurado } from "./powerbi.config.ts";
import styles from "./PowerBIPage.module.css";

const CAPTURAS = [
  { src: "/img/powerbi-01.png", alt: "Resumen ejecutivo 2025 — cartera de clientes" },
  { src: "/img/powerbi-02.png", alt: "Resumen ejecutivo 2026 — cartera de clientes" },
  { src: "/img/powerbi-03.png", alt: "Comportamiento de consumo por segmento" },
];

export function PowerBIPage() {
  const [ocultas, setOcultas] = useState<Record<string, boolean>>({});

  if (estaConfigurado()) {
    return (
      <div className={styles.pagina}>
        <PowerBIEmbed />
      </div>
    );
  }

  const visibles = CAPTURAS.filter((item) => !ocultas[item.src]);

  return (
    <div className={styles.pagina}>
      <Tarjeta>
        <h2>Integración lista, pendiente de configuración</h2>
        <p>
          El componente de embed ya está implementado con powerbi-client-react.
          Falta publicar el reporte y completar las variables de entorno:
        </p>
        <ul className={styles.lista}>
          <li>VITE_POWERBI_EMBED_URL</li>
          <li>VITE_POWERBI_REPORT_ID</li>
          <li>VITE_POWERBI_EMBED_TOKEN</li>
          <li>VITE_POWERBI_WORKSPACE_ID</li>
        </ul>
        <p>
          En producción el token lo emite un backend; no se coloca en el
          frontend. Copia <code>.env.example</code> a <code>.env</code> y
          reinicia Vite cuando las tengas.
        </p>
      </Tarjeta>
      {visibles.length > 0 && (
        <section className={styles.capturas} aria-label="Capturas del dashboard">
          {visibles.map((item) => (
            <figure className={styles.captura} key={item.src}>
              <img
                src={item.src}
                alt={item.alt}
                onError={() => setOcultas((prev) => ({ ...prev, [item.src]: true }))}
              />
            </figure>
          ))}
        </section>
      )}
    </div>
  );
}
