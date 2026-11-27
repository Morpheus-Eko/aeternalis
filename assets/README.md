# Biblioteca de assets de Aeternalis

Biblioteca pública para reutilizar imágenes y ornamentos en Foroactivo, nuevas páginas y módulos.

## Acceso
- [Explorar visualmente](https://morpheus-eko.github.io/aeternalis/assets/)
- [Catálogo estructurado](https://morpheus-eko.github.io/aeternalis/assets/catalogo.json)
- [Repositorio de recursos](https://github.com/Morpheus-Eko/aeternalis/tree/main/assets)

## Qué contiene
- **480 recursos alojados en GitHub** y 143 referencias externas según el catálogo central (623 registros). Las colecciones originales de Brújula (17), Grimorio (24), Monturas (43) y Runas (6) ya estaban presentes, con sus WebP y SVG disponibles.
- **61 ornamentos de Bestiario** conservados en Imgur con ID y URL.
- **80 ilustraciones de criaturas** conservadas en Imgur y referenciadas por nombre, tomo y región.
- **2 imágenes cartográficas externas** referenciadas desde el motor del Atlas.

### Recuperación de recursos de códigos antiguos
- [Registro de correspondencias de imágenes históricas](historicos-migracion.json) — URLs originales y sus equivalentes en GitHub para Stats, Monturas, Grimorio y Magia.
- [Renovación visual de los módulos](../docs/RENOVACION_VISUAL_SISTEMAS_2026_11_27.md) — inventario técnico e instalación.
- La antigua cabecera del sistema de Magia sigue referenciada en el registro como **no archivada**; la interfaz actual utiliza un fondo del Códex ya publicado.

## Cómo reutilizar
1. Buscar por nombre o etiqueta en `assets/catalogo.json` o en el explorador de recursos.
2. Preferir las fichas con `tipo: "archivo"` y `estado: "alojado-github"`, usar su campo `url`.
3. Revisar `transparencia` antes de usar sobre pergaminos, fondos o marcos.
4. Consultar `fuente_archivo` y `fuente_ruta` para recuperar el PNG/JPG original del paquete ZIP.
5. Para `enlace-externo`, no inferir formatos ni extensiones de Imgur; consultar la página original. **No descargar los originales de Imgur de forma automática** en códigos nuevos.
6. Nuevos assets: subir al directorio temático, registrar en el catálogo y conservar la ruta.
7. Nunca reemplazar sin aviso los archivos consumidos por el bestiario, el Atlas u otros módulos ya instalados.

### Compatibilidad y cuidado
- Se generaron WebP optimizados (con canal alfa cuando existía) y se conservaron SVG originales seguros.
- Las **8 hojas de recursos visuales del Bestiario** se publican como láminas completas; **no** equivalen a las 61 imágenes individuales de Imgur.
- No se alteró ninguno de los HTML/CSS/JS activos de Foroactivo, Atlas o Bestiario.
- Los paquetes originales se mantienen en la Biblioteca de archivos asociada a los trabajos anteriores.
- GitHub Pages puede tardar en publicar commits nuevos; recargar el explorador tras la publicación.
