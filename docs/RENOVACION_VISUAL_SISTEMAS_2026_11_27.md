# Renovación visual y recuperación de assets históricos · 27/11/2026

## Módulos renovados y publicados

- Brújula Arcana / calculadora de estadísticas: 16 correspondencias de imágenes originales enlazadas a `assets/brujula/`. Control de foco y estados de selección; estilos en `css/stats-brujula.css`; motor en `js/stats/calculadora.js`.
- Libro de Monturas: 30 referencias originales enlazadas a `assets/monturas/`; 10 ilustraciones conservadas, 10 iconos y piezas de libro, CSS y JS independientes.
- Grimorio de Estadísticas: 23 recursos gráficos históricos de Postimg reemplazados por WebP de `assets/grimorio/`; tipografía y jerarquía visual renovadas.
- Códice de Magia: cinco emblemas rúnicos locales y sellos del Grimorio, cabecera alternativa de la nueva biblioteca; reglas preservadas.
- Progresión: hoja CSS recuperada con un ornamento del Códex; **falta el HTML original del Libro Nórdico**. No se han alterado fórmulas ni valores de XP.

## Biblioteca y trazabilidad

[Ver mapa completo de imágenes antiguas y nuevas](../assets/historicos-migracion.json). Se han cotejado todas las rutas locales del mapa con el árbol del repositorio, sin duplicar imágenes preexistentes. La antigua cabecera de magia `sea8orp.png` sigue **sin archivarse como archivo**: se ha sustituido visualmente por el fondo `biblioteca_gran_archivo_01.webp` (Códex). El original permanece en el registro por si se recupera posteriormente.

## Instalación en Foroactivo

Las vistas previas están disponibles en:

- [Calculadora de stats](../calculadora-stats-preview.html)
- [Grimorio de stats](../stats-grimorio-preview.html)
- [Monturas](../monturas-preview.html)
- [Magia](../magia-codice-preview.html)

El CSS se carga mediante etiqueta `<link rel="stylesheet">` desde GitHub Pages, sin necesidad de `fetch()` ni CORS. Los cargadores están en `foroactivo/JS_CARGADOR_*.js`. No pegar scripts duplicados encima de los actuales; sustituir el script anterior por su nuevo cargador al validar cada sistema. En publicaciones de Magia y Grimorio, utilizar los HTML actualizados de la carpeta `foroactivo/` para aprovechar las nuevas URLs.

No se ha modificado la skin ni h4/h5 de Foroactivo, ni se ha ejecutado una sustitución automática de los módulos en el foro real. La revisión visual en el sitio final sigue pendiente.
