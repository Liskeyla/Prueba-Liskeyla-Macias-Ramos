import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout.tsx";
import { SkeletonPagina } from "../components/ui/Skeleton.tsx";
import { AuthProvider } from "../providers/AuthProvider.tsx";
import { DatosProvider } from "../providers/DatosProvider.tsx";
import { FiltrosProvider } from "../providers/FiltrosProvider.tsx";
import { ProtectedRoute } from "./ProtectedRoute.tsx";

const LoginPage = lazy(async () => {
  const m = await import("../features/auth/LoginPage.tsx");
  return { default: m.LoginPage };
});
const ResumenPage = lazy(async () => {
  const m = await import("../features/resumen/ResumenPage.tsx");
  return { default: m.ResumenPage };
});
const ClientesPage = lazy(async () => {
  const m = await import("../features/clientes/ClientesPage.tsx");
  return { default: m.ClientesPage };
});
const SegmentosPage = lazy(async () => {
  const m = await import("../features/segmentos/SegmentosPage.tsx");
  return { default: m.SegmentosPage };
});
const PowerBIPage = lazy(async () => {
  const m = await import("../features/powerbi/PowerBIPage.tsx");
  return { default: m.PowerBIPage };
});

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<SkeletonPagina />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route
                element={
                  <DatosProvider>
                    <FiltrosProvider>
                      <AppLayout />
                    </FiltrosProvider>
                  </DatosProvider>
                }
              >
                <Route path="/" element={<ResumenPage />} />
                <Route path="/clientes" element={<ClientesPage />} />
                <Route path="/segmentos" element={<SegmentosPage />} />
                <Route path="/powerbi" element={<PowerBIPage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
