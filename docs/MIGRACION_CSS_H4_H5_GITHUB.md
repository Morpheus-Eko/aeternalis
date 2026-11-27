# Migración de CSS del Atlas y Bestiario a GitHub

El Supermapa antes recuperaba sus estilos de `/h5-supermapa2-0` y ahora los carga desde `css/supermapa-core.css` mediante un `link[rel=stylesheet]`. Los estilos originales completos (incluyendo ampliaciones posteriores) se extrajeron de `css/supermapa-v1.7-h5.html`, preservado sin modificación.

El Bestiario antes recuperaba su CSS de `/h4-mapa-kawaii-css`; ahora lo carga de `css/bestiario.css`. Se copió el bloque **íntegro** del respaldo `backups/bestiario/CSS_BESTIARIO_H4_EXISTENTE.html` y se conservó el respaldo.

**Importante:** este cambio no desactiva los scripts antiguos configurados en Foroactivo, ni garantiza que sean los únicos que se ejecutan. Para usar el nuevo cargador maestro debe desactivarse el JavaScript antiguo de cada módulo. No borrar los contenidos de h4/h5 hasta comprobar el funcionamiento del Atlas y Bestiario usando el nuevo motor.

Ambos CSS están encapsulados en IDs específicos y no reemplazan la hoja de estilo de la skin global.
