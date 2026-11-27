# Aeternalis · Códice de la Salud · Biblioteca anatómica v0.1

## Entrega

- `01_laminas_originales/`: **10 hojas intactas**, sin recortar ni cambiar de resolución (1536 × 1024 píxeles).
- `02_figuras_pergamino/`: **85 recortes individuales** en WebP con el dibujo y su pergamino originales. Se recomiendan para una ilustración dentro de una página de libro, sobre pergamino o bajo una nota.
- `03_figuras_tinta_transparente/`: **85 versiones de tinta sobre fondo transparente estimado**. La supresión cromática del pergamino es automatizada; puede dejar trazas de textura y marcas auxiliares. Revisar antes de usar como recorte flotante.
- `04_laminas_comparadas_archivo/`: **20 paneles** tomados de tres composiciones comparativas. Sus textos incorporados no están verificados; no son canon ni se recomienda usarlos tal como están en el libro.
- `05_catalogo/`: muestrarios e índice de recortes JSON/CSV con las coordenadas de origen para trazabilidad.

## Estado de las figuras según lore

**Láminas raciales individuales preparadas:** humanos, altos elfos, Nórin, Yūgen. Las láminas de 'anatomía no muerta' son un **estudio patológico** y NO describen una raza independiente del catálogo actual.

**Láminas comparativas de archivo:** incluyen representaciones preliminares de enanos, montaraces y Amarant, así como algunos textos generados con características biológicas que **no se deben convertir automáticamente en reglas**. Los no canónicos 'orco' y 'reptiliano' se conservan por trazabilidad en las láminas originales, pero NO se usan como razas del Códice.

**Pendiente:** láminas individuales definitivas para enanos, montaraces, Amarant y Sin’hair, contrastadas con el lore de `data/razas/fichas/` de Aeternalis. Las versiones previas de Nórin y otras razas deben leerse como concept art, no como descripción médica definitiva.

## Criterios de integración

1. Texto, títulos y notas escritos con fuentes del foro; no incrustar leyendas generadas en las ilustraciones.
2. Usar todas las láminas completas en el archivo de investigación del códice: pueden figurar como guarda, índice, catálogo o apéndice.
3. Los recortes individuales pueden aparecer en cualquier página, sin obligar a repetir toda la lámina.
4. Una imagen anatómica no constituye por sí sola una regla de resistencia o una capacidad física canónica.
5. No incluir atlas completos como fondos con texto encima: la paginación debe contener cada párrafo dentro de los límites físicos de la hoja.
6. Priorizar WebP y carga diferida de imágenes visibles para no empeorar el rendimiento de Foroactivo.

El registro `05_catalogo/catalogo_recortes.json` documenta procedencia y estado de cada recurso. Todas las imágenes proceden de las ilustraciones de este intercambio, conservadas sin redibujar.
