# Bestiario de Aeternalis — migración a GitHub 2.0

## Qué se conserva
- 80 criaturas en ocho tomos: 40 de Bergheim y 40 de Yūgen.
- Cada título, subtítulo, texto de prefacio, rasgo, bloque naturalista e ID de imagen original, sin edición narrativa.
- Todos los ornamentos con IDs de Imgur; los **archivos binarios de imágenes siguen alojados en Imgur**, no en GitHub (el repositorio guarda los enlaces originales).
- El CSS original permanece intacto en la página auxiliar **h4-mapa-kawaii-css** y se adjunta su copia de seguridad, **sin pegar CSS nuevo**.

## Primer cambio que debes realizar en Foroactivo
1. Verifica el JSON público: https://morpheus-eko.github.io/aeternalis/data/bestiario/manifest.json
2. En Foroactivo, **DESACTIVA LOS TRES** JavaScript antiguos del Bestiario: motor v1.1, catálogo Bergheim y catálogo Yūgen. No desactives el Supermapa ni otros sistemas.
3. Crea **UN SOLO** código JS de Bestiario, ubicado **«En los temas»**, y pega íntegro `foroactivo/JS_UNICO_CARGADOR_BESTIARIO.js`, sin etiquetas `<script>`.
4. Mantén HTML `div# aeb-bestiary` y el CSS de h4 sin cambios.
5. Recarga el tema, abre Bergheim y Yūgen y verifica las fichas y sus imágenes.
6. Si hay error, desactiva el cargador y reactiva los tres archivos anteriores. No borres los backups.

## Cómo editar colaborativamente
- Editar un archivo `data/bestiario/<territorio>/tomo-<n>.json` desde GitHub, preferentemente mediante rama y pull request.
- No cambiar los campos `id`, `number`, `region` ni `volume` salvo una migración intencional; mantener 10 especies por tomo y 40 por territorio.
- Para cambiar imagen de una criatura, actualizar su `imgurId` y `imgurPage`.
- Cambios de nombres en las fichas se reflejan automáticamente en el índice al recargar el Bestiario, porque el índice se genera desde los JSON.
- Actualizar el archivo `data/bestiario/assets.json` para cambiar la iconografía ornamental. Las descripciones de los tomos pueden ampliarse sin modificar el código del foro.
- GitHub Pages no actualiza en tiempo real una pestaña abierta. Esperar a la publicación y recargar el foro.

## Pruebas
- Fuente original: Bestiario Interactivo v1.1 con catálogos comprimidos.
- Los JSON se descomprimieron con gzip y se guardaron sin reemplazar ningún contenido textual.
- Validación local: ocho tomos, diez criaturas por tomo, 80 identificadores únicos, motor y cargador con sintaxis JS correcta.
- No cambiar ni h4 ni h5 durante la migración del Bestiario.