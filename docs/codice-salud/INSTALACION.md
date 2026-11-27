# Códice de la Salud · instalación v3.3.0

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
- `assets/medicina/atlas-recortes-v01/indice-visor-racial.json`: selección de 15 grupos raza/sexo con imágenes del atlas separadas por figura, detalle y retrato, sin duplicar imágenes.
- `data/codice-salud/iconografia-clinica-v01.json`: láminas de plantas, anatomía para los expedientes y utensilios de tratamientos. Sin reglas ni cálculos nuevos.
- `data/pestilencias/enfermedades.json`: **única fuente de reglas, modificadores y secuelas** de las tres enfermedades; no alterado.
- `codice-salud/index.html`: demostración GitHub Pages sin Foroactivo.
- `foroactivo/HTML_CODICE_SALUD_PEGAR.txt`: marcador HTML mínimo.

## Lectura y accesibilidad

En escritorio ancho se presentan dos folios; con menos de 1.070 px de ancho del visor aparece uno solo. El texto no tiene desplazamiento interior: el folio aumenta de altura si el contenido lo requiere. Las flechas están a los costados y las cintas de capítulo a la derecha. No hay paginación automática de bloques largos. La brújula y las notas se despliegan a petición, sin panel fijo junto al texto.

Las imágenes del índice anatómico se descargan de manera diferida; las ilustraciones de los folios usan `loading="lazy"`. Al pulsar una imagen se abre su lámina a mayor resolución. El Códice no almacena datos personales ni modifica personajes. Las reglas de pestilencias son reales dentro de la ficción; las hipótesis, riesgos ambientales, anatomías preliminares y plantas inventadas **no representan habilidades mecánicas aprobadas**.

## Estado

`v2.4.0`: integración de atlas anatómico comparado, con 329 recortes y variantes transparentes disponibles en el repositorio; 15 grupos seleccionados para el visor y laboratorio actualizado. Sintaxis JS y rutas de los recursos seleccionados verificadas en GitHub. Pendiente prueba visual en Foroactivo.

`v1.0.0`: primera implementación separada del antiguo sistema de Pestilencias. Se preserva expresamente el carácter provisional de las ilustraciones de Montaraces, Enanos, Amarant y Sin’hair, para reemplazarlas con láminas propias cuando estén validadas. La regla de mestizaje se transcribe tal como fue comunicada (sexo determinado por la raza de la madre); no se derivan tablas ni reglas adicionales sobre la raza del descendiente.

## Comprobación editorial v2.5.0

Gabinete de control visual: https://morpheus-eko.github.io/aeternalis/codice-salud/iconografia.html. Verificar allí la correspondencia entre cada dibujo y su leyenda antes de aprobarlo como representación definitiva. Son estudios de referencia, no un atlas clínico oficial del universo. La publicación de Foroactivo sigue usando solo los dos elementos HTML existentes; el nuevo gabinete es opcional y no debe instalarse en el foro.

## Grabados de enfermedades v2.6.1

Las doce figuras originales de `assets/medicina/patologias-v01/` están disponibles en dos versiones cada una (archivística con papel y tinta transparente). El libro las carga desde el catálogo `iconografia-clinica-v01.json?v=1.2.0` mediante el motor `visor.js?v=3.0.0`. El maestro usa los identificadores `ae-codice-salud-css-v30` y `ae-codice-salud-js-v30` para evitar reutilizar revisiones antiguas.

Para que aparezca **dentro del foro**, confirmar ambos extremos: (a) JS maestro instalado globalmente a partir de `foroactivo/JS_UNICO_MAESTRO_PEGAR.js`; (b) un mensaje HTML con `<div class="hidethisprofile"></div><div id="ae-codice-salud"></div>`. No hace falta añadir los SVG uno a uno ni tocar el CSS base del foro. No se ha comprobado la configuración administrativa de Foroactivo durante esta edición.

## Instalación v3.0.0: arquitectura

En el JS maestro publicado se carga automáticamente `css/codice-salud.css?v=3.3.0` antes de `js/codice-salud/visor.js?v=3.3.0` cuando un tema contiene `#ae-codice-salud`. No hace falta reescribir el HTML de las publicaciones antiguas ni copiar los CSS manualmente.

El libro intenta usar hasta 1.800 px de la ventana y centrarse respecto del viewport aun cuando el tema de Foroactivo tenga una columna principal más estrecha. **Si algún ancestro del mensaje tiene `overflow:hidden`, puede recortar los cantos o las pestañas:** revisar esta situación dentro del tema concreto sin alterar a ciegas el CSS global del foro.

Pruebas funcionales con DOM simulado verifican flechas gemelas, once marcadores, índice ilustrado a la izquierda, láminas botánicas a la izquierda, notas a la derecha, vista de un folio bajo 1.070 px, acciones de abrir/cerrar y herramientas y notas. Falta inspección visual real en Foroactivo y ajustar el grosor de las cintas según el ancho efectivo de la publicación.

## Apostillas del facultativo v3.2.0

El visor carga adicionalmente `data/codice-salud/apostillas-facultativo-v01.json?v=1.0.0`. Este archivo guarda observaciones ficticias y sus firmas por raza, hierba, enfermedad y sección; **no incluye cálculos de juego**. La carga opcional no bloquea el libro: si falla, el visor utiliza una nota literaria neutra con firma de autor desconocido.

La plantilla HTML de Foroactivo sigue sin cambios (`#ae-codice-salud`). El maestro activa el CSS/JS revisados mediante los identificadores `ae-codice-salud-css-v33` y `ae-codice-salud-js-v33`. El contenedor solo necesita tener instalado el maestro global ya existente.

Comprobaciones realizadas con DOM simulado y árbol GitHub: ocho razas vigentes, 105 folios, 93 textos individuales de apostilla, 201 apariciones firmadas en el recorrido de todas las páginas, y JS sintácticamente válido. Falta comprobar en el navegador real del foro la paginación y el aspecto final.

## Glosas individualizadas v3.3.0

El visor obtiene `data/codice-salud/apostillas-facultativo-v01.json?v=1.2.0`: 21 apostillas nuevas por título de folio, ocho glosas raciales de archivo reescritas y comentarios separados para los estudios del deterioro clínico. **No existe glosa de respaldo por sección**; una página sin apostilla concreta no exhibe recuadro de nota.

Se comprobó el recorrido de 105 folios en 53 pliegos simulados: 103 textos visibles de glosa, todos distintos. El reglamento permanece inalterado. Si el código antiguo continúa visible en un navegador, recargar forzadamente y comprobar que el maestro instalado descarga `3.3.0`; la versión sigue sin requerir cambios en el HTML del tema de Foroactivo.
