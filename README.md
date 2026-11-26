# Aeternalis — Atlas y biblioteca del foro

Repositorio público de contenido y código del mundo de rol **Aeternalis**.

**Foroactivo:** https://aeternalis.foroactivo.com/  
**CSS auxiliar del Supermapa (h5, no vista del mapa):** https://aeternalis.foroactivo.com/h5-supermapa2-0  
**Sitio de datos (cuando se active GitHub Pages):** https://morpheus-eko.github.io/aeternalis/

## Carta Náutica integrada al Supermapa · v2.0

La Carta Náutica funciona como **capa de Leaflet en el Supermapa**, no como parte del Astillero. Incluye **5.965 hexágonos de agua**, **14 corredores precalculados**, **6 polígonos de mares** y planificación dinámica de viajes entre **14 puertos**.

- [Vista previa del Supermapa con Carta Náutica](https://morpheus-eko.github.io/aeternalis/supermapa-naval-preview.html?naval=1)
- [Documentación, geografía y guía de instalación](docs/CARTA_NAUTICA_SUPERMAPA_V2.md)
- [Instalador JS para Foroactivo](foroactivo/JS_INSTALAR_CARTA_SUPERMAPA.js)

**Astillero:** [vista independiente](https://morpheus-eko.github.io/aeternalis/astillero-preview.html), sin la Carta Náutica.

## Estado
Migración inicial desde el Supermapa Leaflet **v1.7**. Se conservan los textos narrativos y los datos cartográficos existentes. Las **165 conexiones** del Atlas son propuestas, no carreteras confirmadas.

## Carpetas
- `data/atlas/localidades/`: fichas completas de ciudades, pueblos y lugares singulares, agrupadas por territorio para edición colaborativa.
- `data/atlas/regiones.json`: polígonos y datos territoriales.
- `data/atlas/caminos.json`: red inicial de caminos y rutas propuestas.
- `data/atlas/fichas-civicas.json`: indicadores y distritos documentados.
- `data/atlas/reinos.json`: nombres de reinos y contexto narrativo territorial.
- `js/supermapa-core.js`: motor Leaflet que carga los datos externos.
- `js/supermapa-loader.js`: descarga los JSON, valida el esquema e inicia el motor.
- `js/supermapa-autonomo-v1.7.js`: respaldo del motor antiguo, independiente de GitHub.
- `css/`: copia de los estilos, sin reemplazar por ahora los de la página auxiliar h5.
- `foroactivo/`: cargador mínimo y HTML del foro.
- `docs/`: instrucciones de publicación y colaboración.

## Seguridad de la migración
**No reemplazar todavía** el JS del foro hasta comprobar que GitHub Pages sirve los JSON correctamente. La versión que funciona actualmente en Foroactivo se conserva intacta.

Para publicar datos externos: **Settings → Pages → Build and deployment → Deploy from a branch → main → /(root)**. Las actualizaciones se muestran tras la publicación de Pages y una recarga; no necesariamente en tiempo real.

## Colaboración
Trabajad en ramas separadas y proponed cambios mediante *pull requests*. No editar a la vez `main` sin coordinación. Los cambios aprobados en `main` se publican en Pages. Los archivos públicos pueden ser leídos por cualquier persona: no almacenar contenido secreto del rol, credenciales ni datos personales.

**Integridad editorial:** conservar párrafos y acentos literales; cambiar solo el contenido expresamente revisado. Los identificadores `id` y las coordenadas se consideran referencias técnicas, no títulos a sustituir.
