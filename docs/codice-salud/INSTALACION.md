# Códice de la Salud · instalación v1.0.0

**Vista de pruebas:** https://morpheus-eko.github.io/aeternalis/codice-salud/

## Foroactivo

1. Conservar el cargador maestro actual que ejecuta `js/aeternalis-maestro.js`; el módulo `salud` se inicia únicamente ante el contenedor `#ae-codice-salud`.
2. Crear una publicación nueva y pegar **solo** `foroactivo/HTML_CODICE_SALUD_PEGAR.txt` (incluye `.hidethisprofile`).
3. No pegar el Códice anterior (`#ae-pestilencias`) en la misma publicación ni introducir CSS dentro del HTML o JavaScript.
4. Revisar la demostración en GitHub Pages y contrastar el funcionamiento dentro de un tema real antes de reemplazar enlaces públicos.

## Arquitectura

- `css/codice-salud.css`: estilos independientes y encapsulados en `#ae-codice-salud`, libro con soporte de contenedores y folios de papel CSS, sin background JPG de dimensiones fijas.
- `js/codice-salud/visor.js`: motor de lectura de páginas discretas, Brújula Arcana con búsqueda, apuntes, atlas, navegación por teclado y calculadora 1d100.
- `data/codice-salud/compendio.json`: contenido editorial propuesto de las ocho razas, mestizaje, territorios, hierbas y archivo gráfico.
- `data/pestilencias/enfermedades.json`: **única fuente de reglas, modificadores y secuelas** de las tres enfermedades; no alterado.
- `codice-salud/index.html`: demostración GitHub Pages sin Foroactivo.
- `foroactivo/HTML_CODICE_SALUD_PEGAR.txt`: marcador HTML mínimo.

## Lectura y accesibilidad

En escritorio se presentan dos folios, en contenedores de Foroactivo estrechos uno solo. Las páginas no se extienden más allá del pergamino: el área de papel incorpora scroll propio si el texto sobrepasa el espacio disponible, pero la navegación principal avanza de folio en folio. La navegación gráfica usa assets góticos ya publicados. La brújula despliega índice y bustos a petición, sin panel fijo junto al texto.

Todas las ilustraciones se cargan solo al abrir sus folios y usan `loading="lazy"`. Al pulsar una imagen se abre su lámina a mayor resolución. El Códice no almacena datos personales ni modifica personajes. Las reglas de pestilencias son reales dentro de la ficción; las hipótesis, riesgos ambientales, anatomías preliminares y plantas inventadas **no representan habilidades mecánicas aprobadas**.

## Estado

`v1.0.0`: primera implementación separada del antiguo sistema de Pestilencias. Se preserva expresamente el carácter provisional de las ilustraciones de Montaraces, Enanos, Amarant y Sin’hair, para reemplazarlas con láminas propias cuando estén validadas. La regla de mestizaje se transcribe tal como fue comunicada (sexo determinado por la raza de la madre); no se derivan tablas ni reglas adicionales sobre la raza del descendiente.