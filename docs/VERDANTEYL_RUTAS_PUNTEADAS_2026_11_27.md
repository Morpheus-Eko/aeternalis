# Aeternalis — Caminos de Verdanteyl y territorios élficos

**26–27 de noviembre de 2026 · Cartografía propuesta a partir de Mapa 3.21.**

## Corrección realizada

La segmentación antigua únicamente reconocía pigmentos rojizos, ocres y azulados. El raster del Atlas incluye **tres estilos adicionales** importantes:

- **Puntos blancos:** a través de los bosques del continente de Verdanteyl, especialmente desde Guardia Zytheria y Fohn’Veridan hacia Torreón Ásdris, Alandra, Ris'Veridan y Atalaya Éyniri.
- **Puntos verde oscuro:** caminos sobre el terreno claro al oeste del bosque, entre Eirae, Dulcesidra, Molino Blanco y Comarca Esmeralda.
- **Puntos negros:** senderos en los territorios élficos al sur de las cordilleras y en el sector oriental del bosque. La textura de hojas y rocas puede generar falsos positivos; estos trazados requieren mayor inspección.

**Imagen fuente:** `Mapa_3.21(2).png`, 2048 × 1571 píxeles lógicos, SHA-256 `79d8d66d34951f531ddc98bdb04f2e8d9efbfdffb395da86dee4fd5bb0cbc71d`. Hexágonos axiales, radio 9.3333, fase (0,0), alineados con el Supermapa vigente.

### Datos publicados

| Archivo | Contenido |
| --- | --- |
| `data/atlas/caminos-pigmentos-verdanteyl-elfos.json` | 1718 hexágonos con indicios de los nuevos colores; observaciones `white`, `darkGreen` y `black` |
| `data/atlas/caminos-rutas-sur-candidatas.json` | 28 recorridos analizados, con coordenadas axiales y porcentajes de coincidencia |
| `data/atlas/caminos.json` | 23 caminos dibujados como polilíneas que siguen el terreno, con todos sus vértices por hexágono |
| `js/supermapa-core.js` | Migración de geometría a borradores previos de usuarios, sin borrar rutas modificadas por ellos |
| `data/atlas/manifest.json` | Recuento actualizado de 167 conexiones (165 anteriores + 2 nuevas) |
| `supermapa-rutas-preview.html` | Vista del Atlas sin activar el editor |

## Tramos geometrizados

Se incorporaron **9 trazados blancos**, **5 verde oscuro** y **9 negros** (**23 en total**).

Entre las nuevas líneas blancas, dos enlaces visibles que no figuraban en las 165 conexiones originales fueron incorporados como **propuestas**, no confirmaciones:

1. **Fohn’Veridan — Torreón Ásdris** (`atlas-ver-001`).
2. **Loth’Veridan — Alandra** (`atlas-ver-002`).

Otras conexiones existentes actualizadas incluyen Guardia Zytheria — Fohn’Veridan, Fuerte Azgereth — Fohn’Veridan, Bastión Heidrun — Torreón Ásdris, Fohn’Veridan — Alandra, Alandra — Ris'Veridan, Ris'Veridan — Atalaya Éyniri, Eirae — Dulcesidra, Molino Blanco — Dulcesidra, Comarca Esmeralda — Molino Blanco, Elv’Thilion — Elorian, Elorian — Khal’doril, Baelwyn — Silvanys, Aethelas — Silvanys, Ianelya — Dael’enor, Thyriel — Dael’enor y Coriel — Ianelya.

Todos los 23 trayectos conservan `status: "propuesta"` y contienen `cartographicEvidence`: `source`, `pigment`, `coverage`, `confidence:"sugerencia"`, `hexagons` y `checked:"pendiente"`.

**Los otros 144 tramos originales permanecen inalterados**, incluidas las 31 conexiones marítimas. Ningún estado de aprobación se ha modificado.

## Método y limitaciones

1. Segmentar por color y contraste local sobre el **raster original**.
2. Filtrar componentes de tinta de tamaño pequeño y asignarlos a la retícula hexagonal existente.
3. Reconocer las localidades y proponer secuencias de celdas adyacentes, favoreciendo puntos detectados y evitando agua abierta.
4. Comprobar que **cada segmento** está compuesto por hexágonos contiguos; conservar el recorrido en `via` (coordenadas cartográficas), con el origen y destino atados a las localidades existentes.
5. Guardar los trazados candidatos no escogidos para revisión en el JSON de auditoría, sin alterar las rutas originales.

**Importante:** una coincidencia cromática alta significa que el trazado sigue el pigmento seleccionado, no que el pixel es inequívocamente un punto de camino. En particular, el detector de negro puede reconocer follaje, sombras o límites fronterizos. El archivo de auditoría retiene los tramos sin continuidad o poca evidencia. El trabajo requiere una última validación visual antes de considerarlo canon.

Para esta actualización se evitó reescribir la cartografía de otras regiones y no se requiere el editor manual que estaba en desarrollo.

### Borradores locales y visualización

El motor del Atlas ahora reconoce una migración de red **v16**. Si el navegador almacenaba el borrador de una red anterior, incorpora únicamente los nuevos vértices en aristas originales sin `via` que todavía están `propuesta`, junto con los dos nuevos enlaces. **No sobreescribe rutas que el cartógrafo ya modificó, aprobó o eliminó**.

Para ver el nuevo mapa directamente:
https://morpheus-eko.github.io/aeternalis/supermapa-rutas-preview.html

El cargador existente del Supermapa de GitHub obtiene `manifest.json`, `caminos.json` y el motor de forma automática. No hace falta sustituir el código principal en Foroactivo. Si la aplicación sigue usando una copia antigua autoinstalada del Atlas, esa copia no incorporará automáticamente los datos nuevos.

**Queda pendiente** revisar manualmente los caminos negros del sotobosque y los pasos de montaña que no tienen pigmentos inequívocos, en particular donde faltan caminos entre algunos enclaves del sudeste élfico.
