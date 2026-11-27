# El Códice de las Pestilencias · Interfaz v1.1

## Una experiencia propia, no una variante del Astillero

La experiencia se organiza como un **libro de expedientes clínicos**. Se abre en un índice de tres folios. Cada nombre conduce a una **página de lectura ancha**, sin columnas laterales, con observaciones del médico a tamaño de texto cómodo, notas desplegables y el registro de cada secuela. La navegación por pliegos (síntomas, exposición y expediente) es progresiva y cuenta con retorno al índice. A diferencia del Astillero, aquí la protagonista es la lectura y no una cuadrícula de opciones.

## Arquitectura

- `pestilencias/index.html`: demostración pública independiente en GitHub Pages
- `css/pestilencias.css`: CSS exclusivo bajo `#ae-pestilencias`
- `js/pestilencias/visor.js`: motor de selección y cálculo sin dependencias externas
- `data/pestilencias/enfermedades.json`: normativa y relatos basados en el documento original del usuario
- `assets/pestilencias/`: nueve assets WebP publicados
- `foroactivo/HTML_CODICE_PESTILENCIAS_PEGAR.txt`: único contenedor HTML que requiere Foroactivo

## Vistas

**Síntomas:** hoja clínica de lectura amplia con descripción inicial y notas médicas que se abren una a una. Procedencia, exposición y secuelas aparecen como anotaciones desplegables, manteniendo la distinción entre hipótesis y hechos del lore.

**Exposición:** entrada manual de VIT, raza, exposiciones anteriores y protecciones (Ouriler / Velo de Astarax). Calcula 1d100 + modificadores y la probabilidad matemática exacta de superar el umbral. No tira dados oficiales ni altera fichas.

**Expediente:** consulta de secuelas y copia de ficha orientativa, sin persistencia.

## Regla y cautelas

- Umbrales: FD >75, COM >85, SN >60.
- Modificador VIT y +5 por exposición previa, más modificadores específicos por raza y protección.
- Al no superar el umbral se añade una secuela; umbrales mortales FD 4, COM 3, SN 5.
- Inmunidad nominal después de al menos cinco exposiciones. El texto original no explicita la relación temporal entre quinta exposición, última tirada e inmunidad: esta interfaz no resuelve ese vacío.
- Sangrenegra tiene evolución especial en temas posteriores.
- Las penalizaciones por atributos se aplican a stats efectivos, incluso cuando aumentan posteriormente. La implementación v1 no modifica los stats de otros sistemas.
- No hay datos privados persistidos en el servidor; la copia de expediente es voluntaria.

## Integración

En una publicación del foro, pegar el contenido del archivo `foroactivo/HTML_CODICE_PESTILENCIAS_PEGAR.txt`, que incluye **`<div class="hidethisprofile"></div>`** para ocultar la ficha lateral del autor y **`<div id="ae-pestilencias"></div>`** para activar el módulo. El marcador usa el mecanismo existente de Foroactivo y solo afecta la publicación en la que se inserta. El JS maestro de Aeternalis ya incluye el módulo `pestilencias` y no lo descarga si el contenedor está ausente. No modificar el JS global ni el CSS base.

Vista independiente: https://morpheus-eko.github.io/aeternalis/pestilencias/

Próximas iteraciones propuestas: relación visual con el Supermapa, imágenes específicas para tratamientos, registro de personajes validado por staff y reglas de inmunidad tras aprobación.

## Cambio de arquitectura · 27 de noviembre de 2026

- Índice del libro como estado inicial; cada afección abre un legajo.
- Eliminadas las columnas laterales y el panel de cuarentena que comprimían el texto.
- Pliego principal de hasta 1100 px, texto de lectura de 18–20 px en pantallas amplias, interlineado ~1.8.
- Notas y secuelas mediante elementos `details`/`summary`, compatibles con teclado y sin añadir dependencias externas.
- Compatibilidad con calculadora 1d100, libro de secuelas y enlace al JS maestro; el contenido normativo en JSON no se modifica.
- Versión de CSS/JS 1.1.0 para invalidar la caché de GitHub Pages / Foroactivo.
