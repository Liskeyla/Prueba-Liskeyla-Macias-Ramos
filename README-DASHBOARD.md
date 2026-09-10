# README — Dashboard de Clientes y Consumo

## 1. Descripción del proyecto

Dashboard ejecutivo para analizar la cartera de clientes, comportamiento de consumo, utilización de productos y oportunidades comerciales.

Tres preguntas:

1. **¿Qué tenemos?** Composición de la cartera, clientes, productos y saldos.
2. **¿Cómo se comportan nuestros clientes?** Consumo, canales, categorías, frecuencia y relación con productos.
3. **¿Dónde existen oportunidades?** Segmentos, bajo o nulo consumo, concentración de productos, activación.

La información es **sintética** y no representa información financiera real.

El modelo Power BI está en [`powerbi/dashboard.pbix`](powerbi/dashboard.pbix). La app React replica la lectura ejecutiva con los mismos supuestos.

---

## 2. Estructura de la información

### `Base_Limpia` (`data/dataset_clean.csv`)

Clientes, productos, saldos, cupos, vencimientos y consumos: `cliente_id`, `producto`, `saldo_producto`, `cupo_credito`, `monto_consumo`, `categoria_consumo`, `canal`, `fecha_movimiento` / `fecha_consumo`, `fecha_vencimiento`, `estado_producto`.

### Segmento del cliente

Clasificación conductual y comercial: `segmento_cliente` (MASS, PREMIUM, AFFLUENT, JOVEN, PYME) y el segmento conductual (Food Lovers, Solo ahorro / Sin consumo, etc.).

### Criterios

Umbrales de *lover* (share vs portafolio, mínimo de transacciones y monto) documentados en el notebook.

---

## 3. Supuestos del análisis

### 3.1 Cliente

Identificador único: `cliente_id`. Conteo distinto para no duplicar por producto o transacción.

### 3.2 Producto

Un cliente puede tener uno o varios productos. Se cuentan productos distintos.

### 3.3 Consumo

Consumo aplicable: `monto_consumo` válido y mayor que cero. Sin consumo no implica automáticamente inactivo: el consumo puede no aplicar al producto.

### 3.4 Saldo

Estado del producto. No interpretar la suma de todos los movimientos como saldo vigente si representan distintos momentos.

### 3.5 Cupo de crédito

Aplicable solo a productos con cupo. Nulos no se imputan.

### 3.6 Fecha de vencimiento

Nulos no son error si el producto no requiere vencimiento. Próximos vencimientos: solo productos con fecha aplicable.

### 3.7 Información sintética

Indicadores y conclusiones son analíticos sobre la base de evaluación.

---

## 4. Reglas de limpieza de datos

Ver [README-DATOS.md](README-DATOS.md). Resumen:

* Nulos revisados por significado (cupo, vencimiento, categoría).
* Segmento conductual vacío → `Solo Ahorro / Sin consumo`.
* Texto recortado; fechas y montos tipados.
* Consumo: `> 0` cuenta; `0` o nulo no es transacción.

---

## 5. Definición de segmentos

### 5.1 Lovers

Relación activa con categorías de afinidad. `n_lovers` cuenta en cuántos grupos el cliente supera el umbral. En el visual ejecutivo cada cliente con consumo se asigna a su **grupo dominante**.

### 5.2 Heavy User

Utilización o consumo elevado. Sirve para fidelización y venta cruzada.

### 5.3 Solo ahorro / Sin consumo

Productos de ahorro (u otros) sin consumo aplicable. También absorbe segmentos conductuales vacíos. Oportunidad de activación.

---

## 6. Reglas de consumo

* Consumo total = `SUM(monto_consumo)` con monto > 0.
* Consumo promedio = Consumo total / Clientes únicos (incluye sin consumo).
* Transacciones = registros con `monto_consumo > 0`.
* Ticket promedio = Consumo total / Transacciones.
* % por canal: respeta filtros del tablero y quita solo el filtro de canal.

---

## 7. Indicadores principales

| Indicador | Definición |
|---|---|
| Clientes únicos | Número distinto de clientes |
| Saldo total | Suma de saldos (una vez por cliente / producto vigente) |
| Saldo promedio | Saldo total / clientes únicos |
| Consumo total | Suma de consumos > 0 |
| Consumo promedio | Consumo total / clientes únicos |
| Transacciones | Registros con consumo > 0 |
| Ticket promedio | Consumo / transacciones |
| Clientes multiproducto | Dos o más productos (81,2 %) |
| Utilización TC | Saldo de tarjeta / cupo (32,83 %) |
| Próximos vencimientos | Productos con vencimiento en la ventana |

Valores de control (universo sin filtros): 2.200 clientes · USD 77.356.909,02 de saldo · USD 35.162,23 de saldo promedio · 545 clientes sin consumo (24,8 %).

---

## 8. Criterios para interpretar

Combinar número de clientes, productos, saldos, consumo, canales, segmentos y utilización. Un mayor número de clientes no implica mayor valor de cartera.

---

## 9. Storytelling del dashboard

### 01 — ¿Qué tenemos?

Clientes, saldos, productos, composición y segmentos.

### 02 — ¿Cómo se comportan?

Consumo, categorías, canales, transacciones, ticket, productos usados.

### 03 — ¿Dónde debemos actuar?

Sin consumo, multiproducto, segmentos de valor, concentraciones, activación y venta cruzada.

En Power BI las páginas visibles en las capturas son:

* Resumen ejecutivo 2025
* Resumen ejecutivo 2026
* Comportamiento de consumo por segmento

---

## 10. Consideraciones finales

Separación: **Datos → Limpieza → Segmentación → Medidas → Visualización → Insight**.

Las reglas deben mantenerse documentadas al incorporar nuevos registros.
