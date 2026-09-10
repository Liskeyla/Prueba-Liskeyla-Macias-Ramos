import { useEffect, useMemo, useState } from "react";
import { Boton } from "../../components/ui/Boton.tsx";
import { EstadoVacio } from "../../components/ui/EstadoVacio.tsx";
import { Tarjeta } from "../../components/ui/Tarjeta.tsx";
import { useClientesFiltrados } from "../../hooks/useClientesFiltrados.ts";
import { clientesACsv, descargarCsv } from "../../lib/csv.ts";
import type { Cliente } from "../../types/index.ts";
import { DrawerCliente } from "./DrawerCliente.tsx";
import { TablaClientes } from "./TablaClientes.tsx";
import styles from "./ClientesPage.module.css";

export function ClientesPage() {
  const { filtrados, meta, filtros, limpiar } = useClientesFiltrados();
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [seleccionado, setSeleccionado] = useState<Cliente | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setQDebounced(q.trim().toLowerCase()), 250);
    return () => window.clearTimeout(t);
  }, [q]);

  const visibles = useMemo(() => {
    if (!qDebounced) return filtrados;
    return filtrados.filter(
      (c) =>
        c.nombre.toLowerCase().includes(qDebounced) ||
        c.id.toLowerCase().includes(qDebounced),
    );
  }, [filtrados, qDebounced]);

  if (!meta) return null;

  return (
    <div className={styles.pagina}>
      <div className={styles.toolbar}>
        <input
          className={styles.busqueda}
          type="search"
          placeholder="Buscar por nombre o id"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Buscar clientes"
        />
        <Boton
          variante="secundario"
          onClick={() =>
            descargarCsv("clientes-filtrados.csv", clientesACsv(visibles, filtros))
          }
        >
          Exportar CSV
        </Boton>
      </div>
      {filtros.categoria.length > 0 && (
        <p className={styles.nota}>
          El consumo refleja únicamente las categorías seleccionadas.
        </p>
      )}
      {visibles.length === 0 ? (
        <Tarjeta>
          <EstadoVacio
            titulo="Sin clientes para este recorte"
            mensaje="Prueba a limpiar los filtros o ajustar la búsqueda."
            accion={
              <Boton variante="primario" onClick={limpiar}>
                Limpiar filtros
              </Boton>
            }
          />
        </Tarjeta>
      ) : (
        <Tarjeta>
          <TablaClientes
            clientes={visibles}
            filtros={filtros}
            segmentos={meta.segmentos}
            onSeleccionar={setSeleccionado}
          />
        </Tarjeta>
      )}
      <DrawerCliente
        cliente={seleccionado}
        meses={meta.meses}
        onCerrar={() => setSeleccionado(null)}
      />
    </div>
  );
}
