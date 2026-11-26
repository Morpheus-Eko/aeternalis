# Aeternalis · Almirantazgo (Astillero v1.1 + Carta Náutica v1.0)

> **DOCUMENTO HISTÓRICO (26 de noviembre de 2026).** La integración Astillero + Carta Náutica en una misma página fue reemplazada. El **Astillero es independiente**; la Carta Náutica está dentro del **Supermapa Leaflet v2**. Para instalar la versión vigente sigue [CARTA_NAUTICA_SUPERMAPA_V2.md](CARTA_NAUTICA_SUPERMAPA_V2.md). Los pasos antiguos de instalación conjunta de este documento **no deben aplicarse**.

**Estado:** Código publicado en GitHub, listo para instalar en Foroactivo. **No está instalado por esta publicación en el panel de administración del foro.** Se requiere pegar el HTML y el instalador únicos y comprobarlos visualmente dentro de Foroactivo.

## Actualización editorial: Astillero v1.2 y Carta Náutica v1.1

Desde el 26 de noviembre de 2026, las interfaces públicas mantienen una presentación editorial sin rótulos de «prueba», «simulación» ni avisos repetitivos de acreditación. Los controles utilizan «Actualizar configuración», «Tarifa reducida», «Trazar recorrido», «Hexágonos» y «Bitácora».

**No se alteró el motor de requisitos, precios, rutas, datos de personajes ni se creó persistencia o transacción real.** Los aspectos técnicos (revisión de rutas marítimas y carácter temporal de los ajustes de pantalla) permanecen documentados aquí para mantenedores.

**Versiones de caché:** `JS_CARGADOR_ASTILLERO.js?v=1.2.0` y `JS_CARGADOR_CARTA_NAVAL.js?v=1.1.0`. Si se está utilizando la línea breve de instalación en Foroactivo, su parámetro puede actualizarse a `JS_INSTALAR_ALMIRANTAZGO.js?v=1.0.1` para obtener el instalador nuevo.


## Vistas

- **Vista conjunta:** https://morpheus-eko.github.io/aeternalis/almirantazgo-preview.html
- **Solo Astillero:** https://morpheus-eko.github.io/aeternalis/astillero-preview.html
- **Solo Carta Náutica:** https://morpheus-eko.github.io/aeternalis/carta-naval-preview.html

## Instalar ambos módulos en UNA página de Foroactivo (recomendado)

1. Crear una página HTML o publicación con permiso de código HTML que contenga exactamente el HTML de **foroactivo/HTML_ALMIRANTAZGO.html**, manteniendo los IDs `ae-astillero` y `ae-carta-naval`.
2. Abrir **Panel de Administración → Módulos → Gestión de los códigos JavaScript**.
3. Crear un único código, por ejemplo «Aeternalis — Almirantazgo», y pegar el contenido íntegro de **foroactivo/JS_INSTALAR_ALMIRANTAZGO.js** sin etiquetas `<script>`. Elegir ejecución «En los temas» si está en una publicación o «En todas las páginas» si está en página HTML; el instalador solo carga los módulos donde encuentra los IDs.
4. Si ya se instaló otro código de **Astillero** o **Carta Náutica** en Foroactivo, desactivarlo antes para evitar dos cargadores de estos mismos módulos. **No tocar** los JS del Supermapa, Cronología, Razas, Bestiario u otros.
5. No modificar el CSS general ni las páginas auxiliares h4/h5. Los nuevos estilos se descargan de **css/astillero.css** y **css/carta-naval.css** en GitHub.
6. Verificar en ordenador y móvil: ocho familias de navíos; las cuatro mejoras; incompatibilidad Velas III/Resistencia III; descuentos y eventos hipotéticos; selecciones de puerto; puntos de paso; sincronización de Velas; cartografía visible y desplazamiento horizontal de mapa en móvil.
7. Si el foro muestra código viejo por caché, actualizar el parámetro de versión del instalador y el de los cargadores, no modificar los textos narrativos.

**Instalación de un solo módulo:** HTML_ASTILLERO.html + JS_INSTALAR_ASTILLERO.js para Astillero; HTML_CARTA_NAVAL.html + JS_INSTALAR_CARTA_NAVAL.js para Carta sola.

## Astillero v1.1

Ocho familias de **presentación** sin diferencia mecánica:

| Familia | Imagen principal |
| --- | --- |
| Nórdicos | drakkar rúnico, biblioteca original |
| Piratas | galeón pirata original |
| Yūgen | navío japonés de cubierta abierta: **sin casas ni pagodas encima** |
| Humanos | galeón heráldico humano |
| Élficos | navío lunar de cisne |
| Nórin | mercante de alta ingeniería e inversión |
| Sinhair | embarcación de madera viva, raíces y musgo |
| Amarant | barco de asalto selvático, ferocidad amazónica |

La apariencia se configura en **data/astillero/navios.json**, sin duplicar la lógica de mejoras. Los seis navíos nuevos del paquete cultural son escenas con fondo pictórico, no sprites transparentes; CSS adapta su presentación para que aparezcan como escenas y no como imágenes con un alfa inexistente.

El motor sigue exactamente el reglamento **Sistema de navegación.docx**: Velas, Resistencia, Tripulación y Poder de Ataque con cuatro niveles. La simulación no transfiere monedas ni verifica temas o eventos. La obtención legendaria es solo hipotética. El Astillero expone un evento local `aeternalis:astillero-change` para comunicar nivel de Velas a la Carta.

## Carta Náutica v1.0

Los datos son **referencias públicas reales del Atlas**:

- **Imagen cartográfica:** `data/atlas/catalogo.json` (URL original del Supermapa).
- **Registro de 17 puntos náuticos:** `data/astillero/carta-naval.json`, apuntando a los IDs de localidades de `data/atlas/localidades/*.json`. De ellos, **14** se habilitan como posibles salidas/destinos de simulación; dos faros y un marcador costero son referencias y no terminales.
- **Coordenadas:** se recuperan del Atlas al abrir la Carta. No se duplican inventando valores ni se editan los datos del Supermapa.
- **Rutas oficiales:** `data/astillero/rutas-navales.json`, iniciado con **cero rutas aprobadas** y sin escala hexagonal fijada. Este esquema es preparatorio y aún no alimenta el visor de rutas.
- **Interfaz:** selección por listas o marcadores, boceto visual de línea discontinua, puntos de paso sobre el mapa, borrador reiniciable, retícula hexagonal **solo orientativa**, entrada manual de número de hexágonos y cálculo de Velas I (24 h), II (18 h), III (12 h) y legendarias (8 h) por hexágono.

**Límite principal:** la red vial del Atlas no constituye red marítima; no se ha verificado geográficamente la navegabilidad ni la longitud de cada recorrido. La línea discontinua trazada por el usuario **no** valida la navegación y puede cruzar tierra. Por ello, el sistema **no calcula automáticamente los hexágonos de un itinerario**: exige que el usuario introduzca un número y lo etiqueta como hipótesis. La geometría hexagonal visible es una retícula ilustrativa, no un dato canónico.

**Precisión cartográfica:** el Atlas advierte que sus coordenadas aún requieren calibración final sobre el mapa de alta resolución. Algunos puntos náuticos tienen posición explícitamente provisional. El sitio conserva esas advertencias. No se han incluido locales archivados ni marcadores fuera de los datos reales del Atlas.

## Arquitectura del repositorio

- `data/astillero/reglas.json`: mecánicas originales.
- `data/astillero/navios.json`: ocho estilos culturales.
- `data/astillero/carta-naval.json`: índice de puntos del Atlas.
- `data/astillero/rutas-navales.json`: esquema de rutas canónicas todavía vacío.
- `js/astillero/visor.js`: Astillero v1.1.
- `js/astillero/carta-naval.js`: visor de Carta Náutica v1.0.
- `css/astillero.css` y `css/carta-naval.css`: CSS totalmente separado.
- `foroactivo/HTML_ALMIRANTAZGO.html`: dos contenedores, sin CSS ni JS embebidos.
- `foroactivo/JS_INSTALAR_ALMIRANTAZGO.js`: instalador común.
- `foroactivo/JS_CARGADOR_ASTILLERO.js` y `foroactivo/JS_CARGADOR_CARTA_NAVAL.js`: cargadores propios.
- `almirantazgo-preview.html` y `carta-naval-preview.html`: pruebas públicas.
- `assets/naval/`: 156 WebP, según catálogo global.

## QA realizado en código

- Sintaxis de JavaScript de ambos motores y de los tres cargadores: válida.
- CSS de ambos módulos: llaves equilibradas.
- Registro de 17 puntos verificado contra 118 localidades del Atlas, excluidos marcadores archivados.
- Simulación de DOM del Astillero: ocho opciones renderizadas, imagen por cultura, cambio de Velas y enlace a la Carta.
- Simulación de DOM de Carta: 17 marcadores, 14 terminales, selección de puertos, bocetos, introducción manual de hexágonos y sincronización de Velas.

**Aún pendiente:** prueba visual real en el navegador de Foroactivo y carga pública tras desplegar GitHub Pages; los tests realizados no sustituyen esa revisión.

## Próximas fases

1. Calibrar retícula marítima con el raster original y validar cuáles hexágonos son agua.
2. Crear rutas marítimas autorizadas entre puertos y reglas de mares peligrosos según Resistencia.
3. Integrar expediciones, bitácora, flotas y registro de barcos aprobados por staff.
4. Diseñar combate naval narrativo; no automatizar resultados sin un reglamento específico.

El código no requiere credenciales ni modifica perfiles de usuarios, cuentas del foro o publicaciones existentes.
