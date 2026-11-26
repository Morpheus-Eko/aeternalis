# Biblioteca de assets · Códex de Aeternalis

**Versión de nombres normalizados 1.0 — 26 de noviembre de 2026.**

- 218 recursos individuales: los tres volúmenes I, II y III.
- Cada recurso tiene archivos `.png` (original recortado) y `.webp` (optimizado).
- Se usan rutas `assets/codex/...` comunes a todos los volúmenes y con nombres descriptivos en minúsculas, sin espacios ni tildes.
- El catálogo contiene el ID viejo, la ruta anterior, nueva ruta y palabras clave para búsquedas futuras.
- Un nombre como `busto_orco_generico` designa **arte conceptual genérico**; no confirma que esa raza sea canónica en Aeternalis.
- Las URL indicadas en los catálogos son **destinos planificados** para GitHub Pages. Solo funcionarán una vez que los archivos se publiquen en el repositorio `Morpheus-Eko/aeternalis` con estas rutas.
- El archivo `mapeo_nombres.csv` permite migrar referencias existentes sin pérdida de información.

**Para programar:** usar `webp` en el HTML y CSS, `png` como fuente original. El JSON `catalogo_maestro.json` permite filtrar por `grupo`, `volumen` y `palabras_clave`. No se ha realizado ninguna publicación a GitHub.

**Importante:** los materiales ya recortados no se han regenerado; este paso únicamente reorganiza y renombra sus bytes. Los originales se conservan en los ZIP de partida.
