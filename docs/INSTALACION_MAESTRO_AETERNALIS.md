# JavaScript maestro único de Aeternalis

## Qué instalar en Foroactivo

Un solo código JavaScript, a ejecutar en **todas las páginas**, con el contenido de [`foroactivo/JS_UNICO_MAESTRO_PEGAR.js`](../foroactivo/JS_UNICO_MAESTRO_PEGAR.js).

**No pegar directamente el archivo `js/aeternalis-maestro.js` completo en Foroactivo.** El fragmento de instalación (aprox. 660 bytes) lo descarga automáticamente desde GitHub Pages. Sus modificaciones futuras se aplicarán en el repositorio, sin editar el panel de Foroactivo.

## Arquitectura

El maestro detecta los contenedores de cada publicación, carga únicamente lo necesario y preserva los motores especializados como módulos separados en GitHub. Ninguna página sin el contenedor correspondiente descarga ese módulo.

| Sistema | Contenedor | Recursos |
| --- | --- | --- |
| Prólogo del Bardo (Ambientación) | `#ae-prologo-ozma` | `js/prologo-ozma/visor.js`, `css/prologo-ozma.css` y `data/prologo-ozma/relato.json` |\n| Supermapa | `#aeternalis-atlas` | Cargador de datos del Atlas + `js/supermapa-core.js` + CSS GitHub + Leaflet |
| Carta marítima del Atlas | `#aeternalis-atlas` | Se inicia después de Leaflet y añade `js/supermapa-naval.js` + CSS |
| Herramientas de caminos | `#aeternalis-atlas` | Solo con `?cartografo=1`, `?dibujar=1` o `?caminos=1` |
| Bestiario | `#aeb-bestiary` | Cargador de tomos + `js/bestiario/motor.js` + CSS GitHub |
| Cronología | `#aec-cronologia` | `js/cronologia/visor.js` y `css/cronologia-v3.css` |
| Razas | `#ae-races-codex` | `js/razas/visor.js` y `css/razas-modal.css` |
| Astillero / Almirantazgo | `#ae-astillero` | `js/astillero/visor.js` y `css/astillero.css` |
| Carta náutica independiente | `#ae-carta-naval` | `js/astillero/carta-naval.js` y `css/carta-naval.css` |
| Calculadora de estadísticas | `#aes-stats` | `js/stats/calculadora.js` (carga su propio CSS) |
| Libro de Monturas | `#am-app` | `js/monturas/libro.js` (carga su propio CSS) |
| Grimorio de estadísticas | `#aeg-stats-grimoire` | CSS GitHub; HTML conservado en el tema |
| Códice de Magia | `#aem-magic-codex` | CSS GitHub; HTML conservado en el tema |
| Progresión de niveles | `#aep-progress-book` | CSS GitHub; falta recuperar el HTML completo |

## Activar / desactivar sistemas

Editar [`data/sistemas/maestro.json`](../data/sistemas/maestro.json): asignar `false` a cualquier clave de `modules` para que no vuelva a cargarse en páginas nuevas. La función `window.AeternalisMaestro.getModules()` lista el estado de cada módulo en la consola; `getStatus()` expone errores de carga. La habilitación/deshabilitación surte efecto al recargar la página, no desinstala módulos ya inicializados.

## Sustituir los scripts anteriores

1. **Hacer copia de los códigos anteriores de Foroactivo** y de las páginas auxiliares h4/h5. No borrar su contenido en esta etapa.
2. **Desactivar** todos los JavaScript de instalación anteriores de Aeternalis (Supermapa v1.7, cargador Atlas GitHub, Bestiario anterior, Cronología, Razas, Astillero, Carta Náutica, Monturas, Brújula, Magia, Progresión y los instaladores separados). No desactivar scripts que correspondan a otras funcionalidades de la skin.
3. Crear/activar un solo JS nuevo con el contenido de `foroactivo/JS_UNICO_MAESTRO_PEGAR.js`, en **todas las páginas**.
4. Comprobar Supermapa, Bestiario y después los demás módulos desde sus publicaciones originales; revisar consola de errores y visualización en móvil.
5. **Solo tras esa verificación** retirar estilos obsoletos de h4/h5 que no use ningún otro componente. No borrar CSS global ni toda la página auxiliar si contiene elementos ajenos.

## Recuperación ante fallo

Desactivar el maestro y reactivar los instaladores anteriores desde su copia de seguridad. Las páginas auxiliares antiguas siguen preservadas en GitHub y el foro mientras completes las pruebas.

La carga de configuración desde GitHub utiliza un valor predeterminado seguro si falla el JSON, y un módulo con error no interrumpe las demás páginas del foro.

## Qué no hace

El maestro no inventa ni completa las tablas de experiencia, no integra automáticamente un HTML inexistente de progresión, no cambia contenido narrativo, ni escribe datos del rol en la cuenta del usuario. Solo arranca los módulos existentes.

## Prólogo de Ozma: nueva entrada de Ambientación

El maestro incluye `prologoOzma`, habilitado en `data/sistemas/maestro.json`. Al encontrar `#ae-prologo-ozma`, carga la lámina teatral de Ozma en su propia hoja de estilos; los demás módulos y la página principal del foro no se alteran.

La publicación antigua de Ambientación **no se edita por actualizar GitHub**: para que la nueva lámina aparezca en el tema original, reemplazar manualmente su contenido por el bloque de `foroactivo/HTML_PROLOGO_OZMA.html`. Ver [manual del prólogo](PROLOGO_OZMA.md) y [vista independiente](https://morpheus-eko.github.io/aeternalis/prologo-ozma/).
