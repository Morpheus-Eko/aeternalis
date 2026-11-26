# Aeternalis · Biblia visual naval · Ocho familias

**Versión:** 2026-11-26 · propuesta de arte. **Estado:** concepto visual, no iconografía heráldica aprobada.

## Principios comunes

El aspecto del barco **no** modifica Velas, Resistencia, Tripulación ni Poder de Ataque. Los colores, mascarones y tecnologías visibles no conceden bonos, aceleraciones ni armas adicionales. Las mejoras de juego son las recogidas en el documento de navegación.

Las familias de presentación son: **Nórdicos, Piratas, Yūgen, Humanos, Élficos, Nórin, Sinhair y Amarant**.

## Cuatro familias existentes

- **Nórdicos:** madera oscura, runas, mar frío, velas fuertes, drakkars y mascarones de cuervos/serpientes.
- **Piratas:** galeones, pabellones agresivos, cadenas, abordaje, kraken, calaveras y espolones.
- **Yūgen:** juncos de guerra, velas rojas, jade y laca, faroles y dragones.
- **Humanos (antes "medievales"):** navíos de reinos humanos, carracas y galeras, ingeniería de astilleros, heráldica y organización militar/comercial. En el repositorio los **archivos existentes** de assets/naval/medievales siguen con su ruta histórica: cambiar el rótulo no justifica romper enlaces.

## Cuatro nuevas familias visuales

### Élficos
**Carácter:** elegancia marítima noble y astral; proas largas de cisne, cascos esbeltos, plata, marfil, oro y azul noche. Diferenciar de Sinhair: no son barcos cubiertos de maleza ni madera silvestre. **Pack objetivo:** nave cisne-lunar, medallón del cisne astral, timón de estrella, vela con lunas y hojas, mascarón de cisne.

### Nórin
**Carácter:** **riqueza mercantil, gran inversión e ingeniería naval avanzada.** No son simples botes humildes o rurales: llevan cubiertas elaboradas, mecanismos de carga, cabrestantes de precisión, grúas navales, bronce pulido, abundantes lámparas, comodidades y almacenes bien organizados. Color verde esmeralda oscuro, marfil, cobre y bronce dorado. El lujo y la tecnología son identidad visual y no implican mejoras gratuitas en la mecánica. **Pack objetivo:** gran mercante tecnificado, sello de gremio de comercio y navegación, timón mecánico ornamentado, vela de casas comerciales, mascarón de pez dorado.

### Sinhair
**Carácter:** bosque vivo y simbiosis natural, más orgánicos que los élficos. Cascos de raíces trabadas, madera curvada y visible, musgo, hojas, lianas y flores húmedas; tonos verde hoja, verde musgo y madera. **Pack objetivo:** navío de madera viva, medallón árbol y mareas, timón de lianas, vela foliar, mascarón de ciervo vegetal.

### Amarant
**Carácter:** guerreras amazónicas de selva. Una huella formal de los largos navíos del norte, transformada en embarcación de asalto selvática con plumas, colmillos, escudos, madera rojiza, fibras y proas felinas. No deben confundirse con piratas tropicales. Paleta rojo terroso, negro madera, verde jungla y marfil. **Pack objetivo:** navío de asalto selvático, medallón jaguar, timón tribal, vela de garra y plumas, mascarón de bestia selvática.

## Producción de imágenes

Las **láminas de concepto** y los **25 recortes editoriales** se prepararon en un archivo de trabajo separado; los recortes conservan el fondo pictórico y **no son imágenes finales de interfaz con transparencia**. Antes de añadirlos a assets/naval/ y a data/astillero/navios.json hay que obtener sprites limpios, imágenes alfa reales o redibujar cada elemento de forma individual. No se deben etiquetar los recortes con fondo como transparentes.

## Futuro Astillero v1.1

La ampliación debe crear carpetas assets/naval/elficos, /norin, /sinhair y /amarant con assets WebP optimizados **y transparencia validada**; registrar cada archivo en el catálogo global y en el catálogo naval; luego incorporar sus entradas al selector (ocho en total) sin modificar el motor de reglas. Los barcos se deben revisar visualmente en móvil y escritorio antes de reemplazar el prototipo 1.0.

Ninguna familia debe recibir ventajas mecánicas por su apariencia o riqueza.
