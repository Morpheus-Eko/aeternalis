# Aeternalis · El Almirantazgo / Astillero v1.0

**Versión posterior disponible:** el **Astillero v1.1** con ocho familias y la **Carta Náutica v1.0** están documentados en [ALMIRANTAZGO_ASTILLERO_1_1_CARTA_1_0.md](ALMIRANTAZGO_ASTILLERO_1_1_CARTA_1_0.md). Las instrucciones siguientes se conservan como histórico del prototipo de cuatro navíos; para nuevas instalaciones usar el instalador conjunto.

## Estado
**Prototipo funcional en GitHub Pages.** No instala automáticamente nada en Foroactivo. Debe revisarse su representación gráfica en el tema real.

**Vista de prueba:** https://morpheus-eko.github.io/aeternalis/astillero-preview.html

## Capacidades
- Cuatro apariencias sin efectos mecánicos: nórdico, pirata, Yūgen, medieval.
- Ilustraciones de los 126 assets navales, medallones I–Legendario y cantoneras del Códex.
- Cuatro ramas de progreso, respetando el documento original: Velas, Resistencia, Tripulación, Ataque.
- Precios normales y descuentos posibles sujetos a acreditación narrativa.
- Motor de simulación local: avanzar, comprobar requisitos, deshacer y reiniciar.
- Bloqueo de combinación simultánea Velas III + Resistencia III, con excepciones legendarias.
- Las mejoras legendarias requieren una autorización hipotética marcada expresamente.
- Cálculo teórico del tiempo para 1 a 20 hexágonos, sin asignar rutas ficticias al Atlas.

## Archivos
- data/astillero/reglas.json: fuente versionada del reglamento.
- data/astillero/navios.json: estilos y assets de barcos.
- js/astillero/visor.js: interfaz, validación y simulador.
- css/astillero.css: estilos ornamentales adaptativos aislados por el selector #ae-astillero.
- astillero-preview.html: demostración pública.
- foroactivo/HTML_ASTILLERO.html: publicación mínima.
- foroactivo/JS_CARGADOR_ASTILLERO.js: cargador de assets y motor.
- foroactivo/JS_INSTALAR_ASTILLERO.js: fragmento que se pega en el panel JS de Foroactivo.

## Reglas originales
1. Barco inicial con todas las mejoras I: 50 oro off-rol, salvo justificación narrativa aprobada.
2. Velas: I 24 h/hex, II 18 h/hex (500/100 oro), III 12 h/hex (1.500/300 oro y Tripulación II), Legendarias 8 h/hex (Velas III, Tripulación III y evento).
3. Resistencia: II 500/100, III 1.500/300, Legendaria por evento con Corteza Negra y Metal Nihil.
4. Tripulación: II 500/100, III 2.500/500 (hasta dos barcos adicionales de máximo nivel II), Legendaria por evento (hasta cuatro barcos auxiliares).
5. Ataque: II 500/100, III 1.500/300 (Tripulación II), Legendario por evento (Ataque III y Tripulación III; dos catapultas y máximo cinco proyectiles de cada tipo).
6. No se permite Velas III simultáneamente con Resistencia III. Las excepciones de Velas o Resistencia Legendarias se respetan; para obtener la mejora legendaria hay que pasar primero por III.
7. El descuento solo es una hipótesis; el cumplimiento de los temas es competencia administrativa.
8. Las localizaciones LXXXXX, VXXXXXXX y AXXXXXXX quedan pendientes de canon. No se inventan.

## Instalación en Foroactivo (opcional)
1. Primero abrir y revisar la página pública de prueba.
2. Crear una página/tema con el HTML de foroactivo/HTML_ASTILLERO.html; el id es ae-astillero.
3. En Panel de Administración → Módulos → Gestión de los códigos JavaScript, agregar el contenido de foroactivo/JS_INSTALAR_ASTILLERO.js sin etiquetas script.
4. El cargador detecta el contenedor y carga CSS/JS desde GitHub, solo en esa página.
5. No modificar JS, CSS ni HTML del Supermapa, Razas, Cronología o Bestiario. No se requiere modificar h4 ni h5.
6. Tras modificaciones futuras, incrementar versiones de caché en el cargador y su instalador.

## Limitaciones deliberadas
- No realiza compras ni concede mejoras ni aprobación de eventos.
- No guarda datos del capitán ni accede a cuentas Foroactivo.
- No identifica personajes ni acredita temas terminados.
- No calcula rutas reales, bloqueos por mar, encuentros o combate.
- No interpreta los assets como símbolos raciales oficiales ni introduce bonificaciones por diseño del barco.

## Arquitectura prevista
**Fase 2 — Registro naval:** ID, propietario/capitán, licencias de mejora, embarcaciones auxiliares, puerto, bitácora. JSON validado por staff para un primer modo administrado; se requiere un backend autorizado para edición por usuarios.

**Fase 3 — Carta Náutica:** cuadrícula y grafo marítimo independientes, conexión solo mediante IDs de puertos y localidades válidas del Supermapa. Sin tocar caminos terrestres actuales. A falta de cartografía y conexiones verificadas, no deben inventarse hexágonos.

**Fase 4 — Flotas:** agrupación de barcos y expediciones, siempre vinculadas a requisitos de Tripulación.

**Fase 5 — Combate naval:** un motor separado, únicamente después de consensuar reglas.

Fuente: Sistema de navegación.docx aportado por el autor. Todos los assets usados son del repositorio GitHub de Aeternalis.
