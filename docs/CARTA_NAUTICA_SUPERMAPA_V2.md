# Aeternalis · Carta Náutica integrada al Supermapa v2

**Fecha:** 26 de noviembre de 2026. **Rama:** main.

## Arquitectura
La **Carta Náutica vive únicamente en el Supermapa Leaflet**. El Astillero conserva el catálogo de ocho navíos y sus reglas de mejoras, pero ya no incorpora el contenedor de Carta ni carga automáticamente su JS.

La capa añade el botón **⚓ Carta Náutica** al panel existente del Supermapa. Al abrirlo, muestra los puertos, rutas marítimas, hexágonos identificados como agua y polígonos de regiones con fichas ambientales. Conserva las 118 localidades, 24 regiones terrestres y 165 caminos existentes: **ninguna ruta marítima se introduce en data/atlas/caminos.json**.

## Instalar en Foroactivo

Si el **Supermapa Leaflet v1.7 está funcionando** en el foro:

1. Mantener su código actual y la página auxiliar de CSS h5, sin cambios.
2. En **Panel de Administración → Módulos → Gestión de los códigos JavaScript**, crear un módulo llamado «Aeternalis — Carta Náutica del Supermapa».
3. Pegar el contenido completo de `foroactivo/JS_INSTALAR_CARTA_SUPERMAPA.js`, sin etiquetas HTML script.
4. Ejecutar el módulo en las páginas del Supermapa o en todas las páginas; **solo actúa donde existe #aeternalis-atlas**.
5. Si sigue instalado un cargador anterior de Carta Náutica independiente (en el Astillero), retirarlo. El HTML del Astillero debe contener únicamente `<div class="hidethisprofile"></div><section id="ae-astillero">...</section>`.
6. Abrir el Supermapa, pulsar **Carta Náutica**; comprobar navegación, puertos, itinerarios y la descripción de cada región.

**La Carta NO exige un segundo HTML ni un segundo mapa.** Su CSS está en `css/supermapa-naval.css` en GitHub; no se pega en el CSS base ni en las páginas auxiliares h4/h5.

Si el Supermapa anterior no expone el identificador `window.__AE_ATLAS_LEAFLET_DEBUG__.map`, es necesario usar la versión Leaflet v1.7 del repositorio, que sí lo expone. El cargador de datos `foroactivo/SUPERMAPA_CARGADOR_PARA_FOROACTIVO.js` está disponible para una migración independiente y no debe ejecutarse simultáneamente con otra versión íntegra del mapa.

### Enlace de vista previa

https://morpheus-eko.github.io/aeternalis/supermapa-naval-preview.html?naval=1

La vista previa usa la fuente CSS del Supermapa incluida en el repositorio, mientras que Foroactivo sigue usando su h5. El código se revisó sintácticamente y el grafo se probó por programa; no se afirma haber inspeccionado visualmente la ejecución dentro del panel de Foroactivo.

## Datos versionados

| Archivo | Función |
| --- | --- |
| `data/atlas/naval/hexagonos-navegables.json` | 5.965 hexágonos con datos de tipo y conexiones verificadas |
| `data/atlas/naval/rutas-por-agua.json` | 14 corredores marítimos curvados, con secuencias de hexágonos |
| `data/atlas/naval/zonas-maritimas.json` | 6 polígonos de mar; descripción, vientos, oleaje, corrientes, visibilidad y peligros |
| `data/atlas/naval/puertos.json` | 17 puntos náuticos referidos por ID a las localidades, 14 de ellos terminales |
| `js/supermapa-naval.js` | Leaflet: capas, planificador A* y panel de regiones |
| `css/supermapa-naval.css` | CSS independiente y adaptativo |
| `foroactivo/JS_CARGADOR_SUPERMAPA_NAVAL.js` | Cargador CSS+JS para foro |
| `foroactivo/JS_INSTALAR_CARTA_SUPERMAPA.js` | Fragmento mínimo de instalación |
| `supermapa-naval-preview.html` | Vista completa del Atlas con la Carta Náutica |

## Extracción geográfica

**Fuente raster:** archivo exacto `Mapa_3.21(2).png`, guardado por el autor (2048×1571, SHA-256 `79d8d66d34951f531ddc98bdb04f2e8d9efbfdffb395da86dee4fd5bb0cbc71d`). La cuadrícula es la existente del Supermapa: hexágonos de radio lógico **9,3333**, fase 0, coordenadas axiales q/r y centro `x=1.5R*q; y=√3 R (r+q/2)`.

1. Clasificación de píxeles azul/celeste mediante HSV, filtrando tierra verde, rocas grises e islotes ocres.
2. Cierre morfológico pequeño para atravesar inscripciones cartográficas sin fundir costas grandes.
3. Muestreo de pigmento por centro y por interior de hexágono.
4. Verificación de adyacencias por continuidad de pigmento entre hexágonos; para ríos finos se verifica que el mismo cauce azul cruce la frontera de dos hexágonos vecinos.
5. Búsqueda A* con preferencia por aguas abiertas. Cada ruta recorre hexágonos adyacentes; no se usa una línea geográfica directa que atraviese tierra.
6. Cómputo de viaje por nivel de Velas: I 24 h, II 18 h, III 12 h, Legendario 8 h **por hexágono**.

**Resultados:** 5.965 hexágonos enlazados por aristas; 14 corredores precalculados; 14 puertos terminales anclados a agua con separaciones de 3–19 píxeles lógicos; **91/91 parejas de puertos con trayectoria por el grafo**. Las 14 líneas del mapa derivan del grafo, no de atajos en línea recta entre posiciones urbanas.

### Limitaciones pendientes de calibración

La máscara se infiere de la representación artística en azul/celeste. **Los ríos de menos de un hexágono, lagunas y riachuelos necesitan supervisión visual para distinguir cursos reales de marcas decorativas**. El sistema contiene cauces fluviales detectados, pero **no puede prometer que todos los ríos del lore están completamente recorribles**; en futuros ajustes podrán añadirse conexiones verificadas.

Las coordenadas del Atlas tienen segmentos provisionales, y el acoplamiento de algunos puntos portuarios usa el hexágono de agua próximo. Los trazados resultantes son aptos como **base cartográfica calculada** y susceptibles de corrección por los administradores. El usuario puede editarlos actualizando los JSON; no se realizan escrituras automáticas a GitHub.

El **peligro, el viento, la corriente y el oleaje no alteran todavía los tiempos de viaje**: sus textos son descripciones narrativas editables y los modificadores se definirán después con aprobación del reglamento.

## Regiones marítimas

Se incluyeron los rótulos visibles **Mar del Invierno, Mar de Ithar’iamil, Mar Sombrío, Golfo de Kider y Estrecho Brumoso** y el nombre descriptivo **Aguas del Archipiélago de los Esclavos**.

Sus polígonos están trazados principalmente en agua, con cobertura azul/celeste (análisis de píxel) de aproximadamente 88 %, 93 %, 82 %, 67 %, 89 % y 81 %, respectivamente. No reemplazan fronteras políticas. Sus fichas tienen los campos `description` y `weather.wind`, `weather.waves`, `weather.currents`, `weather.visibility`, `weather.dangers`.

Las descripciones atmosféricas iniciales son **propuestas editoriales**. Pueden sustituirse desde `zonas-maritimas.json` sin tocar JS ni CSS.

## Vista del Astillero después de la separación

El HTML de `foroactivo/HTML_ALMIRANTAZGO.html` contiene solo `#ae-astillero` y el marcador `hidethisprofile`. El instalador anterior `foroactivo/JS_INSTALAR_ALMIRANTAZGO.js` permanece como compatibilidad para cargar **únicamente Astillero**. La Carta se instala por separado junto al Supermapa.

## Próximos hitos

- Conectar y revisar manualmente cada río con puntos de ingreso y salida a mar; cerrar posibles falsos positivos por tinta decorativa.
- Ajustar los polígonos y sus fichas según el canon definitivo (vientos, estaciones, monstruos, zonas prohibidas).
- Añadir profundidad, corrientes y requisitos por nivel de Resistencia.
- Registro de embarcaciones y flotas vinculado a personajes; requerirá persistencia segura fuera de GitHub Pages.
