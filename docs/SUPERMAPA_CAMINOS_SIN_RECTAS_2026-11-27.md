# Aeternalis · Supermapa completo sin caminos rectos

**Actualización del 27 de noviembre de 2026.** Fuente: mapa canónico `Mapa_3.21(2).png` y caminos documentados del Atlas.

## Qué cambió

El Supermapa Leaflet ya no traza conexiones terrestres entre dos localidades con una línea artificial. Toda arista terrestre representada necesita vértices intermedios (`via`) calculados sobre la cuadrícula cartográfica. Los ocho antiguos tramos sin continuidad no se consideran conexiones activas. Los recorridos marítimos se visualizan con la capa independiente **Carta Náutica**, no con las rectas anteriores del Atlas.

| Registro | Cantidad |
| --- | ---: |
| Conexiones terrestres con geometría hexagonal previa | 34 |
| Conexiones terrestres recuperadas de la auditoría de puntos | 97 |
| **Total de caminos terrestres trazados** | **131** |
| Antiguas conexiones terrestres sin trazado archivadas | 8 |
| Registros de travesías marítimas preservados (ocultos de la capa terrestre) | 31 |
| **Conexiones que conserva el manifiesto del Atlas** | **162** |
| Localidades con al menos un camino terrestre trazado | 103 / 118 |
| Localidades sin camino terrestre trazado | 15 / 118 |

**Importante:** no se inventaron conexiones a localidades que la cartografía no vincula explícitamente con un camino. Algunas están en islas o enclaves aislados; otras pueden requerir una futura revisión visual de sus accesos.

## Auditoría de los 97 trazados recuperados

Los 97 recorridos anteriormente representados como líneas rectas fueron interpolados por la retícula hexadecimal con evidencia de puntos de color detectados: **58 con coincidencia cromática alta, 19 media y 20 baja**. Ninguna coincidencia cromática es una confirmación automática; se conserva `status: "propuesta"` y `cartographicEvidence.checked: "pendiente"`.

Las 97 secuencias superan la comprobación de continuidad (cada hexágono es adyacente al anterior), contienen al menos un vértice intermedio y no presentan distancias entre localidades incompatibles con las dimensiones de la imagen. Los 34 trazados previos (incluidos el litoral de Verdanteyl, Galanor e Ithar’iamil) no fueron sobreescritos.

**La coincidencia baja sigue siendo una alerta de cartografía:** aunque la ruta curva sigue la red de indicios detectados, parte de su geometría requiere todavía contrastación visual.

## Conexiones que se retiraron de la red terrestre activa

Se guardaron los ocho registros originales completos en `data/atlas/caminos-sin-trazado.json`:

- `base-021`, `base-022`, `base-023`: conexiones desde o hacia **Grimskar**, separada del continente por el mar.
- `base-042`: **Lothom → Faro Crepuscular**, a través del estrecho.
- `base-062`: **Fuerte Nurtac → Puerto del Sol**, cruzando el Estrecho de Kardan.
- `base-128`: **Fortaleza del Alba → Puerto del Sol**, cruzando el Estrecho de Kardan.
- `base-097`, `base-163`: enlaces de **Academia Njfarell**, situada entre islas.

Estos enlaces históricos no se han declarado imposibles: pueden existir rutas náuticas, transbordos o cruces especiales. Simplemente no hay evidencia suficiente de una **vía terrestre continua**. No deben permanecer como líneas rectas en el mapa general.

## Los 15 puntos sin conexión terrestre trazada

- **Bergheim:** Paso de Lory’ell, Grimskar y Cavernas de Varnok.
- **Kargast:** Fortaleza Vorhel y Kinnor.
- **Ávalon:** Faro Crepuscular, Fuerte Elyssfor, Fuerte Nurtac y Bosquemiel.
- **Isilme:** Sytenth.
- **Piratas:** Puerto Ramera, Costa Sangrienta y Bahía Kraken (conexiones marítimas en registros históricos).
- **Otros:** Academia Njfarell y Ushios.

Pueden estar enlazados por rutas marítimas o ser localidades sin camino terrestre indicado. El conteo anterior se refiere **exclusivamente a conexiones por tierra**; no significa que estén inaccesibles por cualquier medio.

## Cambios técnicos

- `data/atlas/caminos.json`: ahora 162 aristas; 131 terrestres con `via` y 31 marítimas antiguas, sin `via`.
- `data/atlas/caminos-sin-trazado.json`: archivo de respaldo de ocho hipótesis de conexión terrestre descartadas de la capa activa.
- `js/supermapa-core.js`: en el modo de caminos, Leaflet dibuja **solo las aristas terrestres que tienen `via`**. El planificador rechaza enlaces sin geometría, evitando usar caminos inexistentes o unir islas con líneas directas.
- `data/atlas/manifest.json`: manifiesto actualizado a 162 conexiones.
- **Migración local de borradores v18:** al recuperar una configuración anterior del navegador, el motor intenta incorporar los `via` del Atlas a las rutas rectas no editadas. No reemplaza trazados que estén confirmados y conserva las rutas del cartógrafo. Antes del cambio guarda una copia de los datos anteriores en el almacenamiento local con sufijo `_RESPALDO_ANTES_DE_CAMINOS_V18`.
- La **Carta Náutica** permanece independiente. Para viajes en barco, el planificador principal ya no supone que las 31 travesías antiguas sean rectas navegables. Se utiliza la capa naval para trazar el recorrido.

### Vista completa del Atlas

https://morpheus-eko.github.io/aeternalis/supermapa-rutas-preview.html

No hay que instalar un nuevo JS en Foroactivo si la página ya utiliza el cargador principal de datos desde GitHub. En caso de que el navegador mantenga recursos antiguos, recargar la página evitando caché. Si un foro sigue sirviendo una copia antigua íntegra de Supermapa, se requerirá migrar su cargador para acceder a estas rutas.

## Pendiente

El reemplazo de líneas rectas elimina atajos falsos, pero **no verifica visualmente todas las 131 rutas**: en particular, 20 de los nuevos recorridos tienen baja cobertura de pigmento y necesitan una revisión fina. Los enclaves sin camino terrestre deberán conectarse únicamente cuando el mapa o una decisión editorial respalden ese trazado. La red marítima seguirá ampliándose de forma independiente.
