# La senda del aventurero · Manual para nuevos usuarios

## Objetivo
Convertir el antiguo mensaje de "Primeros Pasos" en un itinerario guiado y usable desde Foroactivo. No modifica las normas: orienta al nuevo usuario hacia Normativa, Ambientación, Cronología, Estadísticas, Progresión, Razas, Magia, Mapa, Expediente, Registros, Baúl, Buzón, Presentaciones, Dudas y Codex.

## Instalación
Si el **cargador maestro** de Aeternalis ya está instalado, sustituir el HTML del tema original por el contenido de:
- [HTML_PRIMEROS_PASOS_PEGAR.txt](../foroactivo/HTML_PRIMEROS_PASOS_PEGAR.txt)

El maestro detecta \`#ae-primeros-pasos\` y carga:
- \`css/primeros-pasos.css\`
- \`js/primeros-pasos/visor.js\`
- \`data/primeros-pasos.json\`

No es necesario copiar CSS ni JS al mensaje del foro. **No tocar los CSS auxiliares h4/h5.**

## Activar enlaces cuando estén listos
En \`data/primeros-pasos.json\`, campo \`enlaces\`, sustituir \`null\` por una URL de la sección publicada, por ejemplo:

\`\`\`json
"normativa": "https://aeternalis.foroactivo.com/t22-normativa-del-foro"
\`\`\`

Se admiten exclusivamente enlaces HTTPS a \`aeternalis.foroactivo.com\`. Mientras el valor sea \`null\`, el manual ofrece la explicación de cada zona y no enlaza a páginas inconclusas.

## Navegación
Las cinco etapas son botones internos funcionales y los accesos rápidos abren la orientación apropiada. El usuario puede marcar etapas como revisadas; la marca se almacena **solamente en el navegador local** mediante localStorage y **no equivale a aprobación administrativa**. El registro de color sigue dependiendo de los procedimientos oficiales del foro.

## Arte e identidad
Interfaz de itinerario de viaje (brújula, mapa, llave, pergamino y linterna), distinta de la Normativa y del Medallero. Solo usa rutas ya existentes bajo \`assets/\`, sin duplicar las imágenes.

[Vista previa](https://morpheus-eko.github.io/aeternalis/primeros-pasos-preview.html)

## Edición visual v1.1.0

Se ha integrado una capa de estética sobria: cuatro hitos con ilustraciones originales de la biblioteca, iconos discretos para accesos rápidos, estilo refinado para tarjetas y un separador arcano fino. No hay snippets pendientes: el CSS, los hitos del JSON y el visor JS están conectados y publicados como archivos completos. Todas las URLs de `enlaces` siguen siendo `null` hasta que los apartados estén listos.
