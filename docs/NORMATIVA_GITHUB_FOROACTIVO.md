# Normativa de Aeternalis · GitHub + Foroactivo

Este módulo sigue el cargador maestro de Aeternalis. Los textos e imágenes se alojan en GitHub y la publicación del foro contiene solo el contenedor mínimo.

1. En el tema original de Normativa, sustituye el contenido por [HTML_NORMATIVA_PEGAR.txt](../foroactivo/HTML_NORMATIVA_PEGAR.txt).
2. Conserva el cargador maestro único ya instalado en Foroactivo: `foroactivo/JS_UNICO_MAESTRO_PEGAR.js`. No instales otro cargador ni pegues CSS en el mensaje.
3. El maestro detecta `#ae-normativa-mount` y descarga `css/normativa.css` y `js/normativa/visor.js`. El visor obtiene el contenido íntegro de `data/normativa/contenido.html`.
4. Para hacer cambios, edita en GitHub el contenido o CSS y actualiza la versión del módulo si necesitas invalidar caché.

[Vista previa](https://morpheus-eko.github.io/aeternalis/normativa-preview.html) · HTML, CSS y JS separados · bustos, sellos y emblemas referenciados a `assets/codex`.

No tocar las páginas CSS auxiliares h4/h5: pertenecen a otros módulos. El post de Foroactivo debe modificarse manualmente si no hay acceso a su editor.
