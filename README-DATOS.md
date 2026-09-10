# README — Limpieza y Preparación de Datos

## 1. Descripción

Este proyecto corresponde al proceso de limpieza, transformación y preparación de una base de datos de clientes y productos financieros para su posterior análisis en Power BI y en la aplicación React.

La información es **completamente sintética y fue creada únicamente para esta evaluación**.

El objetivo de la preparación de datos fue obtener una base consistente, estructurada y lista para realizar análisis de:

* Clientes.
* Productos financieros.
* Saldos.
* Cupos de crédito.
* Consumos.
* Categorías de consumo.
* Canales.
* Fechas de vencimiento.
* Segmentación de clientes.

El proceso de limpieza fue realizado principalmente mediante **Python y Pandas** en [`analysis/analysis.ipynb`](analysis/analysis.ipynb), antes de cargar la información al modelo de Power BI.

---

## 2. Flujo de preparación

**Archivo original → Lectura con Python → Revisión de estructura → Limpieza → Tratamiento de valores nulos → Estandarización → Validaciones → Archivo limpio → Power BI / app**

La limpieza se realizó procurando **no eliminar información válida del negocio**. Los valores nulos fueron evaluados de acuerdo con el significado de cada variable.

---

## 3. Reglas de limpieza aplicadas

### 3.1 Estandarización de nombres y estructura

Se revisaron las columnas de la base para asegurar una estructura consistente.

Se verificaron:

* Nombres de columnas.
* Tipos de datos.
* Cantidad de registros.
* Valores únicos en variables categóricas.
* Valores nulos.
* Registros duplicados.
* Variables numéricas y monetarias.

### 3.2 Limpieza de espacios

Se eliminaron espacios innecesarios al inicio y al final de los campos de texto.

Esto evita que valores visualmente iguales sean tratados como categorías diferentes.

Por ejemplo:

`"Tarjeta de Crédito"`
`" Tarjeta de Crédito "`

fueron tratados como el mismo valor.

### 3.3 Tratamiento de valores nulos

**No se realizó una imputación automática de todos los nulos**, debido a que un valor vacío puede representar una condición válida del producto.

#### Fecha de nacimiento

Los valores faltantes se conservaron como nulos cuando no existía información disponible.

#### Cupo de crédito

Los valores nulos de `cupo_credito` se conservaron cuando el producto no tenía un cupo de crédito aplicable.

#### Fecha de vencimiento

Los valores nulos de `fecha_vencimiento` se conservaron cuando el producto no requería una fecha de vencimiento.

#### Categoría de consumo

Los valores nulos de `categoria_consumo` fueron revisados considerando si existía un consumo aplicable.

---

## 4. Tratamiento del consumo

* `monto_consumo > 0` → consumo registrado.
* `monto_consumo = 0` → sin consumo.
* `monto_consumo` nulo → sin consumo registrado.

Los registros sin consumo no fueron eliminados: identifican oportunidades comerciales y productos no utilizados.

---

## 5. Tratamiento de productos

Un cliente puede tener uno o varios productos. El `cliente_id` no es identificador de fila única.

* Indicadores de clientes: conteo distinto de `cliente_id`.
* Productos por cliente: productos distintos asociados al cliente (monoproducto / multiproducto).

---

## 6. Saldos y cupos

Campos monetarios convertidos a numérico: `saldo_producto`, `cupo_credito`, `monto_consumo`.

Se evitó reemplazar nulos por cero cuando el nulo podía significar que el producto no aplica (especialmente cupo de tarjeta).

El saldo es un **estado**, no un flujo: no se suman saldos del mismo cliente-producto a lo largo del tiempo.

---

## 7. Fechas

Transformadas a fecha: nacimiento, consumo/movimiento, vencimiento.

La fecha de corte de la aplicación es **2026-08-31**.

---

## 8. Segmentación de clientes

La segmentación transforma comportamiento en grupos interpretables.

Variables: productos contratados, consumo, categorías, afinidad, intensidad de uso.

### 8.1 Lovers

Clientes con afinidad a una categoría o grupo de categorías.

| Segmento | Categorías |
|---|---|
| Food Lovers | FOOD + SUPERMARKET |
| Streaming Lovers | STREAMING + ENTERTAINMENT |
| Travel Lovers | TRAVEL |
| Wellness Lovers | HEALTH + EDUCATION |
| Tech Lovers | TECHNOLOGY |

Un cliente con consumo se asigna al grupo de **mayor monto**. `n_lovers` en el notebook mide cuántas afinidades supera el umbral (share vs portafolio, mínimo de transacciones y monto).

### 8.2 Heavy User

Clientes con utilización o consumo elevado frente al resto. Relevante para fidelización, retención y venta cruzada. En el dashboard ejecutivo se observa como intensidad (consumo, transacciones, ticket), no como sexta etiqueta que reemplace a los Lovers.

### 8.3 Solo ahorro / Sin consumo

Clientes sin consumo aplicable (`monto_consumo` no > 0). Los vacíos de `segmento_cliente` conductual se clasifican como **`Solo Ahorro / Sin consumo`** para no dejar BLANK en el dashboard.

---

## 9. Validaciones realizadas

* Cantidad de registros y clientes únicos (2.200).
* Nulos por columna y únicos categóricos.
* Tipos de datos y valores numéricos.
* Consistencia de productos, existencia de consumos y distribución de segmentos.

---

## 10. Criterios para no eliminar registros

| Campo | Tratamiento |
|---|---|
| `fecha_nacimiento` | Se conserva nulo si no existe información |
| `cupo_credito` | Se conserva nulo cuando no aplica |
| `fecha_vencimiento` | Se conserva nulo cuando no aplica |
| `categoria_consumo` | Se conserva nulo cuando no existe consumo aplicable |
| `segmento_cliente` (conductual vacío) | `Solo Ahorro / Sin consumo` |
| `monto_consumo` | Identifica registros con consumo |

---

## 11. Resultado final

Base limpia en `data/dataset_clean.csv` (22.455 movimientos) y vista por cliente para la app (`data/dataset_clean.json`).

Indicadores habilitados: clientes únicos, saldo total y promedio, consumo total y promedio, transacciones, ticket, multiproducto, utilización TC, consumo por canal/categoría, próximos vencimientos, segmentos.

---

## 12. Consideraciones

La información es sintética. Las decisiones buscan mantener información y evitar imputaciones que alteren el comportamiento.

Modelo: **entender la cartera → analizar el comportamiento → identificar oportunidades.**
