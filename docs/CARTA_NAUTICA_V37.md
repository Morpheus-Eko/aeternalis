# Carta Náutica de Aeternalis · v3.7

## Cambio de arquitectura

Se reemplaza el dibujo directo de las **111 rutas históricas** por una red **de proximidad entre puertos**. La antigua malla conectaba pares predefinidos; algunos obligaban a rodear grandes masas continentales y producían líneas poco útiles para el jugador.

**La red visible se calcula al abrir la Carta Náutica**, considerando las coordenadas y el acceso al mar de cada localidad. Se carga la máscara `data/atlas/naval/agua-roja-nelson-1-1.json` (4.851 hexágonos marinos); los ríos y lagos quedan en una categoría de agua distinta.

El algoritmo de `js/supermapa-naval.js` v3.7 hace lo siguiente:

1. Considera puertos con coordenadas y entrada marina próxima (distancia de anclaje de hasta 10 px). Las riberas que solo tienen conexión fluvial confirmada se conservan en el selector, pero no se convierten artificialmente en accesos oceánicos.
2. Busca hasta ocho candidatos cercanos por puerto y restringe la distancia directa a 32 hexágonos.
3. Recorre cada candidato mediante A* **solo** sobre hexágonos marinos con aristas verificadas, sin atravesar territorio continental ni cauces interiores.
4. Descarta los rodeos: máximo de 50 hexágonos por enlace y un presupuesto dependiente de la distancia directa (1,75× + 8, limitado a 50).
5. Procura tres conexiones por puerto, hasta cinco donde ayude a mantener vecinos conectados. Las conexiones resultantes se presentan con los centros reales de todos sus hexágonos, sin líneas simplificadas que puedan atravesar una costa.

La configuración numérica está en `data/atlas/naval/politica-corredores-cercanos-v01.json`, separada del código. Los resultados son dinámicos: **no hay una cantidad fija certificada de corredores** hasta ejecutarse el algoritmo sobre el mapa en el navegador.

## Puertos próximos

La Carta incorpora una lista de destinos locales desde el puerto elegido. Las conexiones marítimas tienen botones que muestran su longitud en hexágonos. Las riberas de una misma cuenca declarada se muestran en un grupo diferente como **«río · pendiente»**, porque no se debe dibujar una línea terrestre cuando aún falta localizar el cauce.

## Navegación fluvial preservada

El archivo `data/atlas/naval/red-fluvial-declarada-v01.json` documenta:

- En Verdenteyl: Fohn’Veridan, Ris’Veridan, Loth’Veridan, Alandra y Bastión Heidrun.
- En Isilme: Kaly–Cyn’dorei y Bahía Calad–Er’yelia.
- En Kargast: Faro Dugarth, Reddas y Rinnos, con salida al mar por Faro Dugarth.

Estas redes **están reconocidas por el autor**, pero no tienen todavía todos los cauces georreferenciados para generar trayectos navegables verificables. La identidad de **Kaly** respecto de **Kale** no ha sido equiparada sin confirmación, y **Faro Dugarth** sigue sin coordenadas en las localidades del Atlas. En el visor esas riberas se pueden seleccionar y consultar, pero no se muestra una ruta inventada ni un tiempo de viaje ficticio.

## Datos y compatibilidad

- `js/supermapa-naval.js`: lógica de la Carta Náutica v3.7.
- `css/supermapa-naval.css`: panel de Puertos próximos, rutas y avisos fluviales.
- `data/atlas/naval/puertos.json`: 57 escalas declaradas.
- `data/atlas/naval/rutas-por-agua.json`: 111 rutas antiguas, solo archivo de referencia.
- `js/aeternalis-maestro.js`: carga CSS y JS con identificadores de caché v37.

El algoritmo A* fue ejecutado en una malla sintética de 54 hexágonos, seis puertos y 11 corredores locales; ninguna ruta superó sus límites ni perdió continuidad. Esta prueba verifica el funcionamiento aislado del algoritmo, **no equivale a comprobar las 4.851 celdas del mapa real**.

**Pendiente:** pruebas de navegación y revisión visual en la página real de Foroactivo, incluido el recuento dinámico de puertos costeros habilitados y corredores generados, así como el trazado específico de ríos y desembocaduras.
