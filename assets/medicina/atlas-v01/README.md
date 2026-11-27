# Atlas médico del Códice de la Salud · Aeternalis

Biblioteca de imágenes de la primera fase del Códice de la Salud, accesible desde Foroactivo y GitHub Pages.

**Inventario verificado:** 10 láminas completas WebP, 85 figuras individuales con fondo de pergamino, 85 versiones en tinta con transparencia estimada, 20 paneles de archivo y 8 ficheros de catálogo y muestrarios.

Las láminas completas de 1536 px conservan la composición original, convertida a WebP para reducir el peso de carga en Foroactivo. Los PNG fuente permanecen conservados en el paquete ZIP del proyecto.

## Carpetas

- `01_laminas_originales/`: láminas enteras, composiciones completas para mostrar como folios del investigador.
- `02_figuras_pergamino/<raza>/`: recortes individuales con fondo.
- `03_figuras_tinta_transparente/<raza>/`: recortes separados para montar dentro de nuevas páginas.
- `04_laminas_comparadas_archivo/`: composiciones comparativas preliminares, **no canónicas**.
- `05_catalogo/`: catálogo de recortes JSON y CSV, muestrarios y `manifest_publico.json` con URL directa de cada archivo.

## Ejemplos de uso

`https://morpheus-eko.github.io/aeternalis/assets/medicina/atlas-v01/01_laminas_originales/yugen.webp`

`https://morpheus-eko.github.io/aeternalis/assets/medicina/atlas-v01/03_figuras_tinta_transparente/yugen/corazon.webp`

Las ilustraciones de orcos o reptilianos se mantienen exclusivamente por integridad del archivo gráfico y **no representan razas admitidas en el foro**. La anatomía no muerta es un estado descrito, no una novena raza jugable. Ninguna imagen establece estadísticas, inmunidades, enfermedades o curaciones por sí misma.

**Integración:** el desarrollo del nuevo Códice de la Salud se hará sin sustituir todavía el módulo activo de Pestilencias. El catálogo de razas oficial se encuentra en `data/razas/manifest.json` y el reglamento de enfermedades en `data/pestilencias/enfermedades.json`.
