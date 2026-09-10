import { BarChart3, Layers, LayoutDashboard, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useClientesFiltrados } from "../../hooks/useClientesFiltrados.ts";
import { useAuth } from "../../providers/AuthProvider.tsx";
import { EstadoError } from "../ui/EstadoError.tsx";
import { SkeletonPagina } from "../ui/Skeleton.tsx";
import { BarraFiltros } from "./BarraFiltros.tsx";
import { Header } from "./Header.tsx";
import { Sidebar, type ItemNav } from "./Sidebar.tsx";
import styles from "./AppLayout.module.css";

const ITEMS: ItemNav[] = [
  { to: "/", label: "Resumen", icon: LayoutDashboard },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/segmentos", label: "Segmentos", icon: Layers },
  { to: "/powerbi", label: "Power BI", icon: BarChart3 },
];

const TITULOS: Record<string, string> = {
  "/": "Resumen de cartera",
  "/clientes": "Explorador de clientes",
  "/segmentos": "Segmentos y oportunidades",
  "/powerbi": "Dashboard Power BI",
};

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useAuth();
  const {
    clientes,
    filtrados,
    meta,
    filtros,
    setDimension,
    quitar,
    limpiar,
    estado,
    error,
    recargar,
  } = useClientesFiltrados();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const titulo = useMemo(
    () => TITULOS[location.pathname] ?? "Cartera de clientes",
    [location.pathname],
  );
  const mostrarFiltros = location.pathname !== "/powerbi" && meta !== null;

  return (
    <div className={styles.shell}>
      {menuAbierto && (
        <div className={styles.backdrop} onClick={() => setMenuAbierto(false)} />
      )}
      <Sidebar
        items={ITEMS}
        activo={location.pathname}
        abierto={menuAbierto}
        onNavigate={(to) => {
          navigate(to);
          setMenuAbierto(false);
        }}
      />
      <div className={styles.col}>
        <Header
          titulo={titulo}
          fechaCorte={meta?.fechaCorte ?? null}
          usuario={usuario ?? "demo"}
          onLogout={() => {
            logout();
            navigate("/login");
          }}
          onMenu={() => setMenuAbierto(true)}
        />
        {mostrarFiltros && (
          <BarraFiltros
            meta={meta}
            filtros={filtros}
            mostrados={filtrados.length}
            total={clientes.length}
            onChange={setDimension}
            onQuitar={quitar}
            onLimpiar={limpiar}
          />
        )}
        <main className={styles.contenido}>
          {estado === "cargando" && <SkeletonPagina />}
          {estado === "error" && (
            <EstadoError mensaje={error ?? undefined} onReintentar={recargar} />
          )}
          {estado === "listo" && <Outlet />}
        </main>
      </div>
    </div>
  );
}
