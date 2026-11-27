# Aeternalis · Corrección de caminos: Comarca Esmeralda, Verdanteyl, Galanor e Ithar’iamil

**Fecha:** 27 de noviembre de 2026. **Fuente:** raster canónico `Mapa_3.21(2).png` (2048 × 1571).

## Objetivo y criterio editorial

Se revisaron las rutas impresas con **puntos oscuros** sobre el litoral élfico, **verde oscuro** junto a Comarca Esmeralda y **puntos blancos** en el continente de Verdanteyl. Las rutas siguen el recorrido dibujado sobre el mapa, con sus vueltas alrededor de bahías, montañas y cabos. **Los rótulos del mapa no se consideran barreras:** cuando los puntitos desaparecen bajo nombres como «Praderas de Galanor» o «Valle de Ithar’iamil», la línea se interpola entre los puntos visibles anteriores y posteriores.

No se infieren puentes ni conexiones terrestres entre islas separadas por mar. La Carta Náutica mantiene su red independiente.

## Cambios efectuados

| Sector | Tramos |
|---|---|
| **Comarca Esmeralda** | Eirae → Dulcesidra → Molino Blanco → Comarca Esmeralda. Trazados basados en los puntos de la pradera. |
| **Costa de Verdanteyl** | Eirae → Guardia Zytheria → Fohn’Veridan, siguiendo el borde costero antes de internarse en el bosque. |
| **Litoral occidental élfico** | Elorian ↔ Elv’Thilion, Elv’Thilion ↔ Baelwyn. |
| **Ithar’iamil** | Baelwyn ↔ Sylvanis ↔ Aethelas ↔ Bahía Calad ↔ Bahía Hirion, con alternativas litoral / estuario hacia Er’yelia. |
| **Galanor** | Ifnolir ↔ Inlyria; Ifnolir ↔ Cyn’dorei; Inlyria ↔ Cyn’dorei; Cyn’dorei ↔ Rhori’len, más la revisión del paso entre Essëa y Kale. |
| **Fallenor** | Salones Dorados ↔ Eledhyn y Syrann ↔ Galathir. |

### Recuento exacto

- **15 conexiones existentes** recibieron geometría corregida, incluyendo la extensión Eirae → Guardia Zytheria → Fohn’Veridan mediante un nuevo enlace intermedio.
- **5 conexiones nuevas**: `atlas-costera-001` (Eirae–Guardia Zytheria), `atlas-elf-coast-001` (Elv’Thilion–Baelwyn), `atlas-elf-coast-003` (Bahía Calad–Bahía Hirion), `atlas-elf-coast-004` (Ifnolir–Inlyria) y `atlas-elf-coast-006` (Er’yelia–Bahía Hirion).
- **2 atajos redundantes retirados**, `base-129` (Eirae–Comarca Esmeralda) y `base-130` (Eirae–Molino Blanco), porque ahora el corredor correcto pasa por Dulcesidra y Molino Blanco.
- **170 conexiones en total**, frente a 167 antes de esta revisión.
- **31 rutas marítimas sin modificación**. Los 150 tramos restantes del archivo previo no recibieron cambios de geometría.
- **Nombre corregido:** `place-309` pasó de «Silvanys» a **«Sylvanis»**, tal como aparece en el mapa.

## Metodología

Las curvas se trazaron con anclajes visuales sobre el raster y se interpolaron a la retícula hexagonal preexistente (radio lógico `9.3333`, fase `0,0`). Se calcularon rutas contiguas por celdas axiales `[q,r]` y se realizó una segunda pasada local que penaliza centros de hexágonos de mar abierto, conservando la proximidad a las cadenas de puntos originales.

Los **20 recorridos tratados** satisfacen la comprobación de continuidad, sin saltos entre hexágonos. En 18 de ellos, la máscara de agua no detectó celdas con más de 110/255 de probabilidad acuática. **Dos corredores de estuario costero** (Bahía Calad–Bahía Hirion y Er’yelia–Bahía Hirion) tienen pequeñas fracciones clasificadas como agua (8,3 % y 5,0 %, respectivamente), probablemente por el borde litoral y desembocaduras; hay que revisar estos cruces antes de declararlos definitivos.

El tratamiento cartográfico evita cortar las rutas bajo letras, pero **no prueba la existencia de todos los pasos en terreno**. Todos los caminos conservan `status: "propuesta"`. Los campos `cartographicEvidence` y los anclajes quedan disponibles para auditoría.

## Archivos

- `data/atlas/caminos.json`: grafo terrestre y marítimo actualizado (170 conexiones).
- `data/atlas/caminos-trazados-costeros-2026-11-27.json`: anclajes, hexágonos de cada trazado y eliminación de duplicados.
- `data/atlas/manifest.json`: recuentos y registro de datos.
- `data/atlas/localidades/isilme.json`: corrección del nombre **Sylvanis**.
- `js/supermapa-core.js`: migración de borradores `networkVersion:17`, conservando modificaciones locales confirmadas y aplicando la nueva geometría solo a sugerencias automáticas anteriores.

Para la vista del Atlas sin herramientas editoriales:

https://morpheus-eko.github.io/aeternalis/supermapa-rutas-preview.html

**Foroactivo:** el cargador principal desde GitHub lee los JSON y el motor actualizados. No se necesita instalar otro JavaScript. Si el foro todavía ejecuta el motor antiguo íntegramente incrustado en un módulo JS, ese motor no utilizará los datos de GitHub hasta que se migre.

## Pendientes

- Inspeccionar la continuidad exacta sobre los bordes de aguas someras y desembocaduras de los dos tramos de estuario.
- Revisar caminos negros donde puedan confundirse puntos de carretera, límites, sombras de árboles o costas.
- Si se aprueban más conexiones entre asentamientos, actualizar el registro de localizaciones y aristas, manteniendo identificadores estables.
