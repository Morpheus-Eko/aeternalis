# Aeternalis · Restauración de caminos sobre el mapa, hexágono por hexágono

**Versión 1.1 | 26 de noviembre de 2026 | Fuente: Mapa_3.21(2).png**

## Propósito

Reconstruir caminos terrestres a partir de los puntos de tinta que ya existen sobre la imagen original de Aeternalis. El sistema anterior contiene **165 conexiones propuestas** y ninguna con puntos intermedios `via`; por tanto se dibujaban como líneas rectas entre localidades aunque el mapa original muestra caminos sinuosos. Se conserva el archivo `data/atlas/caminos.json` íntegro; los cálculos automáticos son material de revisión, no sustituciones silenciosas del canon.

El módulo de **Carta Náutica y sus 31 conexiones `sea`** quedan excluidos de este análisis: el trazador terrestre no los cambia.

## Primer diagnóstico cuantificado

- **8.801 hexágonos terrestres** analizados, radio cartográfico 9,3333 sobre 2048 × 1571 unidades lógicas.
- **2.027 hexágonos** con evidencias coloreadas de posibles líneas punteadas.
- Aproximadamente **1.501 puntos rojizos, 2.119 ocres y 882 azulados** identificados en componentes pequeños de imagen.
- **134 conexiones terrestres** examinadas (54 caminos y 80 sendas):
  - 66 coincidencias cromáticas **altas**;
  - 26 **medias**;
  - 34 **bajas**;
  - 8 **sin recorrido continuo** en la malla terrestre actual.
- **31 travesías marítimas** conservadas, sin alteraciones.

*Importante:* una coincidencia alta significa alineación con pigmentos detectados; no equivale a revisión manual ni a confirmación narrativa. En montañas hay falsas coincidencias por textura o etiquetas. Tampoco puede descartarse un sendero real solo porque el análisis le asigne coincidencia baja. El objetivo de estas cifras es ordenar la revisión humana.

### Conexiones que requieren atención inmediata por falta de continuidad

`base-021`, `base-022`, `base-023`, `base-042`, `base-062`, `base-097`, `base-128`, `base-163`.

No deben repararse inventando trazados sin inspeccionar la imagen original: algunas localidades están sobre la costa, otras rutas son propuestas históricas y algunas requieren una decisión de puente, paso montañoso o transbordo.

## Metodología de detección

1. Cargar el raster **Mapa_3.21(2).png** a su resolución lógica **2048 × 1571**.
2. Segmentar pigmentos de tinta **carmesí**, **ocre** y **azul/teal** según tonalidad y saturación. Identificar componentes conectados pequeños: puntitos de aproximadamente 3 a 42 píxeles, de extensión inferior a unos 12 píxeles.
3. Filtrar pigmentos aislados y agregar sus centros a la celda axial más cercana.
4. Examinar cada hexágono lógico, sumar puntitos por color y estimar presencia de agua. Descartar los hexágonos con una superficie de pigmento acuático excesiva.
5. Para cada conexión entre localidades, anclar el origen y el destino a la celda terrestre más cercana y calcular con A* una **secuencia contigua de hexágonos**. Se favorecen los hexágonos con tintas punteadas; la ausencia de tinta genera una penalización. Los hexágonos clasificados como agua no son transitables.
6. Contar el porcentaje de celdas de la ruta con tinta, el desvío frente a la distancia axial mínima, la distancia del marcador al anclaje y la continuidad del camino. Con estos criterios se obtiene una **prioridad de revisión**, no una decisión automática de autenticidad.

Los puntos coloridos detectados no son una transcripción perfecta del trazado impreso: el arte del relieve, las rotulaciones, los ríos y las costas pueden contaminar la clasificación. Por ello la interfaz permite imponer puntos de paso y bloquear hexágonos equivocados.

## Archivo de datos

- `data/atlas/caminos-evidencia.json`: los 8.801 hexágonos examinables, con `[q,r,carmin,ocre,azul,aguaPct]`; 2.027 tienen al menos una clase de tinta detectada.
- `data/atlas/caminos-auditoria.json`: resultado de la auditoría de **los 134 tramos terrestres**, con `id`, `from`, `to`, distancia, coincidencia, categoría de revisión, anclajes y camino de celdas candidato `path:[[q,r],...]`. Todos mantienen el estado original **propuesta**.
- `data/atlas/caminos.json`: **sin modificaciones automáticas**. Conserva 165 conexiones para garantizar compatibilidad.

## Herramienta de Cartógrafo

`js/supermapa-trazador.js` + `css/supermapa-trazador.css` añaden a Leaflet el botón **⌁ Calcar caminos**. Aparece un panel de trabajo, independiente del planificador de viajes y de la Carta Náutica:

1. Elegir cualquiera de las 134 conexiones terrestres; cada entrada indica la prioridad de revisión.
2. Pulsar **Detectar recorrido** para ver el trazado calculado. El panel indica hexágonos, porcentaje cromático, desvío y distancia de anclaje al poblado.
3. Mostrar u ocultar los indicios de tinta de los tres colores sobre el mapa.
4. Con **Inspeccionar hexágono**, pulsar cualquier hexágono para conocer q/r, número de puntitos por clase y porcentaje de agua.
5. Con **Obligar a pasar por aquí**, pulsar hexágonos de la línea real; el sistema recalcula el camino pasando por todos los puntos obligatorios en orden.
6. Con **Bloquear / desbloquear hexágono**, evitar errores en los que la sugerencia cruza relieve, elementos decorativos o una zona equivocada.
7. **Quitar último paso** o **Limpiar correcciones** conserva el trabajo ya realizado en otros tramos.
8. **Siguiente tramo que requiere revisión** prioriza los 34 de coincidencia baja y los 8 sin continuidad, descartando los ya aceptados.
9. Tras comparar el trazado con el mapa real, pulsar **Aceptar trazado revisado**, con una confirmación manual explícita.
10. **Aplicar al Atlas local** actualiza los puntos `via` de ese tramo en la sesión del Supermapa y guarda el borrador local, siempre que se use la versión del motor que expone `updateEdgeVia`.
11. **Exportar cartografía revisada (JSON)** crea un archivo compatible con la importación del Cartógrafo original. Se incluyen las coordenadas de ciudades, las regiones y las aristas; **solo** las conexiones revisadas obtienen `via` y `status:'confirmada'`.

El almacenamiento de correcciones es **localStorage**, no una escritura automática en GitHub ni una modificación de todas las partidas. Se puede importar posteriormente el JSON de correcciones. Para actualizar a los demás usuarios, el editor debe revisar y publicar los cambios en el repositorio.

### Integración con Foroactivo

El cargador **`foroactivo/JS_INSTALAR_TRAZADOR_CAMINOS.js`** añade de forma selectiva CSS y JS solo en páginas con `#aeternalis-atlas`. Necesita el Atlas Leaflet v1.7 con la interfaz pública `window.__AE_ATLAS_LEAFLET_DEBUG__`. Para aplicar la geometría directamente al Atlas, debe utilizarse el motor de GitHub actualizado que expone `updateEdgeVia`.

En **Panel de Administración → Módulos → Gestión de los códigos JavaScript**, agregar la versión completa del cargador anterior; activar donde se encuentre el Supermapa.

**Activación de Cartógrafo:** abrir el mapa con el parámetro `?cartografo=1` (o `&cartografo=1` si ya hay otros parámetros). El instalador no descarga los 8.801 hexágonos ni muestra el botón «Calcar caminos» durante las visitas ordinarias. El parámetro no constituye autenticación: las ediciones son locales, y la publicación real de los JSON requiere permisos de GitHub. No reemplazar el CSS de la página h5; no modificar h4 ni las páginas del Astillero.

**Vista previa con el mapa completo, la Carta Náutica y el trazador:**

https://morpheus-eko.github.io/aeternalis/supermapa-caminos-preview.html?cartografo=1&caminos=1

No activar simultáneamente dos versiones completas del Atlas. Si aún funciona en Foroactivo una copia antigua del código que no carga desde GitHub, la capa de revisión puede funcionar en modo independiente, pero la incorporación de cambios requerirá exportar el JSON, o migrar la copia del Atlas de forma controlada.


## Dibujo manual de caminos (v1.2)

La edición exclusivamente automática no es suficiente para calcar todos los puntitos de tinta. Por ello se incorporó el módulo independiente `js/supermapa-manual-caminos.js` + `css/supermapa-manual-caminos.css`, integrado en el **mismo cargador del trazador** `foroactivo/JS_INSTALAR_TRAZADOR_CAMINOS.js?v=1.2.0`. No se necesita añadir un nuevo código al panel de Foroactivo si ya se utiliza ese instalador; **actualiza la versión del URL de instalación a 1.2.0** para evitar cachés antiguos.

**Enlace de uso directo:**
https://morpheus-eko.github.io/aeternalis/supermapa-caminos-preview.html?cartografo=1&dibujar=1

### Procedimiento para el autor

1. Abrir el Supermapa con `?cartografo=1&dibujar=1` y pulsar **✎ Dibujar caminos**.
2. En «Selecciona el recorrido», elegir un camino existente del Atlas; o elegir dos ciudades, clase **Camino/Senda**, y pulsar **Crear conexión nueva**.
3. Pulsar **Empezar / continuar dibujo**. El primer hexágono se establece junto a la localidad de origen; hacer clic sobre los **puntos y curvas reales** del mapa. Los clics sucesivos se unen por una cadena hexagonal contigua, sin búsqueda A* ni corrección automática que desvíe el camino a otro lugar. Para reproducir las curvas, hacer clic en cada giro relevante.
4. **Deshacer última pincelada** revierte solo el último tramo entre clics. **Pausar para navegar** permite desplazarse o inspeccionar el mapa; también se puede hacer zoom mientras se dibuja.
5. Cuando el último punto esté a seis hexágonos o menos del destino, pulsar **Finalizar cerca del destino**. No se insertan cierres largos y rectos que salten el camino.
6. Si la malla del análisis no reconoce suelo en un puente o en un paso correcto, activar voluntariamente **Permitir cruces de hexágonos no clasificados como suelo**. El JSON señala qué hexágonos fueron excepcionales.
7. Las rutas se guardan automáticamente **en el navegador**; se puede cerrar y reabrir sin perder las pinceladas (salvo borrado de datos locales). Los dibujos **incompletos también se exportan**.
8. Pulsar **Exportar TODOS mis caminos (JSON)**. Se descargará `Aeternalis_Caminos_Manuales_AAAA-MM-DD.json`. **Adjuntar ese archivo a la conversación** para comparar las rutas, resolver cruces pendientes e incorporarlas a `data/atlas/caminos.json` o archivos nuevos según convenga.

**El archivo JSON contiene** `schema: "aeternalis-caminos-manuales-v1"`, `map`, `coordinateSystem`, `summary` y `routes[]`. Cada ruta indica `id`, `from`, `to`, tipo `road/trail`, `finished`, `reviewedByAuthor`, `hexPath:[[q,r],...]`, `via:[{x,y},...]` y `unknownLandCells`. Así el archivo conserva los **hexágonos exactos elegidos por el autor**, incluso en trabajos incompletos y conexiones nuevas. No publica nada por sí solo.

**Compatibilidad:** la herramienta manual y el trazador automático son dos botones independientes del Supermapa. El módulo manual se desactiva en las visitas normales y únicamente se inyecta con `cartografo=1`; los cambios se mantienen separados de la Carta Náutica, de los polígonos marítimos y de los 165 caminos existentes.

## Qué queda por revisar manualmente

La interfaz permite hacer el trabajo fino, pero **no equivale a haber verificado manualmente 134 recorridos**. Se requieren visitas cartográficas por tramo, priorizando los 42 con baja coincidencia o sin continuidad. En especial:

- Cruces de ríos y puentes.
- Caminos montañosos de Nórdia/Neithem en los que los trazos ocres se mezclan con sombreado de roca.
- Tramos azulados de Bergheim, próximos a ríos también azules.
- Conexiones costeras y puertos donde la posición de ciudad y el agua quedan en hexágonos distintos.
- Sendas del sur con pigmentos que se confunden con las letras de «Gran Bosque de Viridia».

**Regla editorial:** ningún recorrido calculado es canónico hasta que se contraste visualmente y se apruebe. La aprobación es reversible mediante el borrador y el JSON exportado.
