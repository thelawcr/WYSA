# WYSA

**W**hat **Y**ou **S**pent **A**t — una billetera virtual para llevar el control de tus gastos del día a día y saber *en qué estás gastando*.

Es una aplicación web progresiva (PWA) pensada para el celular, con un diseño de vidrio esmerilado (*glassmorphism*) de estilo Apple, animaciones suaves y modo oscuro y claro.

**Pruébala:** <https://thelawcr.github.io/WYSA/>

---

## Características

### Control de dinero
- **Gastos, ingresos y transferencias** con categorías, nota y fecha (Hoy, Ayer u otra fecha).
- **Varias cuentas:** Efectivo, Tarjeta y Ahorros por defecto, con saldo inicial. Puedes crear, editar y eliminar las tuyas.
- **Transferencias entre cuentas** que no cuentan como gasto ni ingreso: el total no cambia.
- **Editar o eliminar** cualquier movimiento tocándolo.
- **Moneda configurable:** ₡ colón, $ dólar, € euro, peso mexicano, peso colombiano y Q quetzal.

### Planificación
- **Gastos fijos mensuales** (luz, agua, cable, internet, teléfono, Spotify, Netflix, alquiler…) con día de vencimiento y estado: pagado, pronto, vencido. Se pagan con un toque y recuerdan el último monto.
- **Presupuesto mensual** con barra de avance que cambia de color al acercarte o pasarte del límite.
- **Presupuesto por categoría** (por ejemplo, Comida y Ocio).
- **Metas de ahorro** con aportes y retiros, y aviso de "Meta lograda".

### Análisis
- **Dona interactiva** de gastos por categoría (Hoy, Semana o Mes): toca un segmento para ver su monto.
- **Tendencia** de gasto diario de los últimos 7 días, con promedio.
- **Buscador y filtros** en el historial: por nota, categoría, cuenta o monto, y por tipo, periodo, cuenta y categoría.

### Privacidad y comodidad
- **Funciona sin internet** una vez instalada.
- **Todo se guarda en tu dispositivo.** No hay servidor, cuenta ni seguimiento.
- **PIN de 4 dígitos** para bloquear la app al abrirla y al volver tras 30 segundos.
- **Respaldo:** exporta e importa tus datos en un archivo `.json`.
- **Tema** Oscuro, Claro o Automático.

---

## Instalar en el celular

Abre <https://thelawcr.github.io/WYSA/> y:

- **Android (Chrome):** menú ⋮ → **Instalar app**.
- **iPhone (Safari):** botón Compartir → **Añadir a pantalla de inicio**.

## Cómo se usa

| Pestaña | Qué hay |
|---|---|
| **Inicio** | Saldo, cuentas, presupuesto, gastos fijos, metas y movimientos recientes |
| **Movimientos** | Historial completo con buscador y filtros |
| **+** (centro) | Agregar un gasto, ingreso o transferencia |
| **Resumen** | Dona por categoría, tendencia de 7 días y límites por categoría |
| **Ajustes** | Moneda, presupuesto, apariencia, PIN, respaldo y borrar datos |

**Consejos**
- Toca una tarjeta de cuenta para ver solo esa cuenta; tócala otra vez para editarla.
- Los gastos fijos **no se registran solos**: tú confirmas cada pago con **Pagar**, así el saldo no se descuadra si un recibo llega distinto.
- Si desactivas o reinstalas la app, tus datos pueden perderse. **Exporta un respaldo** de vez en cuando desde Ajustes.

---

## Tus datos

WYSA guarda todo en el almacenamiento local (`localStorage`) del navegador de tu dispositivo.

- Los datos **no se sincronizan** entre dispositivos. Para moverlos, exporta un respaldo y impórtalo en el otro.
- Borrar los datos del sitio o desinstalar el navegador **elimina** la información.
- El **PIN** es un bloqueo de privacidad casual: protege la app al abrirla, pero no cifra los datos guardados. Si lo olvidas, la única forma de entrar es borrar los datos de WYSA en ese dispositivo (puedes restaurarlos con un respaldo).

---

## Tecnología

Sin frameworks ni dependencias: HTML, CSS y JavaScript puros.

```
WYSA/
├── index.html      Estructura, páginas, hojas y barra de navegación
├── styles.css      Estilos, temas oscuro y claro, animaciones
├── app.js          Toda la lógica de la aplicación
├── sw.js           Service worker (modo sin internet y actualizaciones)
├── manifest.json   Configuración de la PWA
├── icon.svg        Logo
└── icon-*.png      Íconos para iPhone y Android (180, 192 y 512 px)
```

## Ejecutar en tu computadora

Necesita un servidor estático cualquiera (el service worker no funciona abriendo el archivo con `file://`).

```bash
# con Node.js
npx serve .

# o con Python
python -m http.server 5173
```

Luego abre `http://localhost:5173`.

## Publicar

El sitio se sirve con **GitHub Pages** desde la rama `main`, carpeta raíz. Cada `git push` lo actualiza en uno o dos minutos.

Al cambiar archivos, sube el número de versión de la caché en `sw.js` (`const C = 'wysa-vN'`) para que los dispositivos reciban la actualización.

---

Hecho con cariño para saber en qué se va el dinero.
