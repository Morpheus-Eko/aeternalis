# El Códice de las Pestilencias · Interfaz v1.0

## Una experiencia propia, no una variante del Astillero

Se presenta como **Gabinete de Cuarentena**, con un armario de tres sellos patológicos, un dossier central en pergamino y un panel de protocolo. No utiliza grids de mejoras ni libros de navegación. Las pestañas visuales aprovechan los assets individuales del catálogo de Pestilencias.

## Arquitectura

- `pestilencias/index.html`: demostración pública independiente en GitHub Pages
- `css/pestilencias.css`: CSS exclusivo bajo `#ae-pestilencias`
- `js/pestilencias/visor.js`: motor de selección y cálculo sin dependencias externas
- `data/pestilencias/enfermedades.json`: normativa y relatos basados en el documento original del usuario
- `assets/pestilencias/`: nueve assets WebP publicados
- `foroactivo/HTML_CODICE_PESTILENCIAS_PEGAR.txt`: único contenedor HTML que requiere Foroactivo

## Vistas

**Síntomas:** descripción, teoría conocida frente a hipótesis, escala de secuelas y muerte.

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

En una publicación del foro, pegar el contenido del archivo `foroactivo/HTML_CODICE_PESTILENCIAS_PEGAR.txt`. El JS maestro de Aeternalis ya incluye el módulo `pestilencias` y no lo descarga si el contenedor está ausente. No modificar el JS global ni el CSS base.

Vista independiente: https://morpheus-eko.github.io/aeternalis/pestilencias/

Próximas iteraciones propuestas: relación visual con el Supermapa, imágenes específicas para tratamientos, registro de personajes validado por staff y reglas de inmunidad tras aprobación.
