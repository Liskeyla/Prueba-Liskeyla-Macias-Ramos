import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Boton } from "../../components/ui/Boton.tsx";
import { useAuth } from "../../providers/AuthProvider.tsx";
import styles from "./LoginPage.module.css";

export function LoginPage() {
  const { autenticado, login } = useAuth();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  if (autenticado) return <Navigate to="/" replace />;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!usuario.trim() || !clave.trim()) {
      setError("Completa usuario y contraseña.");
      return;
    }
    setCargando(true);
    setError(null);
    window.setTimeout(() => {
      const ok = login(usuario.trim(), clave);
      if (ok) {
        navigate("/", { replace: true });
      } else {
        setError("Credenciales incorrectas.");
        setCargando(false);
      }
    }, 400);
  };

  return (
    <div className={styles.fondo}>
      <form className={styles.tarjeta} onSubmit={onSubmit} noValidate>
        <h1>Cartera de clientes</h1>
        <p className={styles.aviso}>
          Acceso de demostración — usuario: demo · contraseña: demo123
        </p>
        <div className={styles.campo}>
          <label htmlFor="usuario">Usuario</label>
          <input
            id="usuario"
            name="usuario"
            autoComplete="username"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>
        <div className={styles.campo}>
          <label htmlFor="clave">Contraseña</label>
          <input
            id="clave"
            name="clave"
            type="password"
            autoComplete="current-password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
          />
        </div>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <Boton variante="primario" type="submit" disabled={cargando}>
          {cargando ? "Ingresando…" : "Ingresar"}
        </Boton>
      </form>
    </div>
  );
}
