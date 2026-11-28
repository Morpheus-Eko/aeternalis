# Aeternalis · Medallero v1.1.0
El Medallero se presenta como un Salón de las Distinciones conectado al cargador maestro. Sus **90 títulos, requisitos, premios y observaciones** provienen de Medallero.xlsx; los ocho grupos son exclusivamente de navegación.

## Instalación en Foroactivo
Reemplaza el contenido del post con:
```html
<!-- Aeternalis · Medallero v1.0.0. Mantener cargador maestro, no pegar estilos. -->
<div class="hidethisprofile"></div>
<div id="ae-medallero-app" aria-label="Salón de las Distinciones"><p>Abriendo el Medallero de Aeternalis…</p></div>
```
El maestro de Aeternalis ya carga automáticamente `css/medallero.css` y `js/medallero/visor.js` si existe `#ae-medallero-app`. No dupliques el cargador ni insertes CSS en el post.

## Directorios
- `data/medallero.json`: catálogo editable; no inventar reglas.
- `css/medallero.css`: estilos encapsulados y diseño responsive.
- `js/medallero/visor.js`: capítulos, buscador, fichas y paginación.
- `assets/medallero/iconos/medalla-NNN.webp`: ilustraciones asociadas en el Excel; 69 iconos con relación verificable.
- `medallero-preview.html`: vista previa independiente.

**Importante:** los 21 logros sin ilustración principal identificada se muestran con un símbolo provisional. No se atribuyen automáticamente recompensas ni estados de consecución a usuarios. La ausencia o fallo de un archivo de imagen muestra un emblema provisional, sin afectar la navegación.

Origen gráfico: 69 ilustraciones del Excel conservadas en el repositorio como archivos WebP independientes en `assets/medallero/iconos/`. No se sustituyen las ilustraciones originales.

## Estado de los archivos gráficos
**Transferencia terminada:** los 69 archivos WebP vinculados por `data/medallero.json` se encuentran publicados como blobs binarios en `assets/medallero/iconos/` y sus rutas se verificaron una a una. Los 21 logros sin ilustración principal identificada conservan el emblema provisional. No se ha sustituido ni reinterpretado ninguna imagen original. Los estandartes, insignias y coronas laureadas son decoración de la interfaz, no sustitutos de medallas.

## Diseño ceremonial v1.1.0
El Medallero ya no utiliza bustos ni ornamentos de la Normativa: cabecera con estandartes de estrella y dragón, insignia de laurel con estrella, y ocho emblemas de mérito distintos. Paleta azul noche, borgoña y oro. Las ilustraciones originales del Excel no se sustituyen. El HTML mínimo de Foroactivo sigue intacto.
