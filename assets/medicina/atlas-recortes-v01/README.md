# Atlas anatómico de Aeternalis · Recortes v1

**21 láminas originales** preservadas, **329 ilustraciones separadas**, cada una en versión con pergamino y versión de tinta transparente aproximada.

## Criterios

- Se han separado figuras, perfiles, retratos, musculatura, esqueletos, órganos, detalles y paisajes ornamentales. No se ha reescrito ninguna anatomía ni creado una regla.
- Para montajes y fondos temáticos se recomienda `recortes/`, que conserva el pigmento y el papel original. `tinta_transparente/` utiliza una máscara de luminancia y puede conservar restos de marcos, notas y textura: requiere revisión si se usa sobre fondos oscuros.
- La categoría editorial `ilustracion_provisional` indica que se trata de láminas de estudio y no acredita características biológicas o mágicas canónicas.
- Las Amarant se catalogan únicamente en `amarant/femenino/`. No se incluye ninguna versión Amarant masculina.
- `manifest.json` indica fuente, grupo, recorte, ruta transparente y coordenadas exactas del original para cada pieza.
- Se han publicado las ilustraciones en GitHub; **todavía no se han integrado en las páginas del Tomo en Foroactivo**.

## Inventario de recortes

- **amarant · femenino**: 26 piezas
- **elfos · femenino**: 18 piezas
- **elfos · masculino**: 13 piezas
- **enanos · femenino**: 18 piezas
- **enanos · masculino**: 18 piezas
- **humanos · femenino**: 18 piezas
- **humanos · masculino**: 23 piezas
- **montaraces · femenino**: 34 piezas
- **montaraces · masculino**: 15 piezas
- **norin · femenino**: 34 piezas
- **norin · masculino**: 29 piezas
- **sinhair · femenino**: 11 piezas
- **sinhair · masculino**: 36 piezas
- **yugen · femenino**: 18 piezas
- **yugen · masculino**: 18 piezas

## Conservación

Cada lámina íntegra está publicada en `fuentes_webp/` como WebP optimizado. El PNG original sin compresión se conserva en el ZIP local de archivo, en `fuentes/`. Si un recorte necesita un contorno más preciso, recuperar desde allí; el proceso es reversible.

## Advertencia de coherencia racial

Las dos láminas de Nórin del segundo grupo conservan estudios previos de proporciones posiblemente demasiado humanas. No deben utilizarse para definir la estatura Nórin: preferir `norin_masculino_A` y `norin_femenino_A` mientras no se aprueben otros dibujos con proporciones hobbit.

La lámina `yugen_masculino_B` había sido etiquetada erróneamente como femenina durante una primera extracción y fue corregida tras revisar la imagen. La figura femenina Yūgen está en `yugen_femenino_A`.

## Paquetes

- **Recortes ligeros**: solo imágenes WebP conservando el pergamino, más índice y catálogo.
- **Recortes más tinta transparente**: variantes listas para usar, con advertencia de transparencia por máscara tonal (no recorte vectorial manual).
- **Archivo completo**: ambos formatos y 21 láminas originales PNG para volver a extraer o ajustar.
- **Paquetes por raza**: incluyen versiones con pergamino y tinta por separado, sin originales, para incorporación progresiva al repositorio.

## Publicación y rutas

La biblioteca de [GitHub](https://github.com/Morpheus-Eko/aeternalis/tree/main/assets/medicina/atlas-recortes-v01) contiene 329 recortes con pergamino, 329 variantes de tinta transparente y 21 láminas originales publicadas como WebP optimizados. El archivo `manifest.json` enlaza cada recorte con su fuente y la variante correspondiente; los valores SHA-256 permiten verificar su integridad.

**Advertencias:** el resultado es un estudio de dibujo, no canon biológico. Los recortes y transparencias pueden arrastrar bordes, texto ilegible, fragmentos de otras figuras o partes del entorno; elegir con revisión visual antes de darles uso definitivo. Los Nórin que no correspondan a su aspecto hobbit están clasificados como provisionales. Las Amarant son exclusivamente femeninas.