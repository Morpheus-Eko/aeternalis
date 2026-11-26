# Instalación del Atlas desde GitHub (fase de pruebas)

1. **No desactivar todavía el JavaScript v1.7 que funciona en Foroactivo.**
2. Activar GitHub Pages desde `main` y `/(root)` en Settings → Pages.
3. Comprobar que `https://morpheus-eko.github.io/aeternalis/data/atlas/manifest.json` muestra JSON (puede tardar en publicarse).
4. Las descripciones pueden editarse en `data/atlas/localidades/<territorio>.json`. Conservar `id` y estructura JSON válida. Enviar *pull request* para revisión si trabajan varias personas.
5. **Solo después de verificar Pages:** desactivar el JS del Atlas v1.7 en Foroactivo y pegar **íntegro** `foroactivo/SUPERMAPA_CARGADOR_PARA_FOROACTIVO.js` como único JS del Atlas, habilitado en «En los temas».
6. Mantener sin cambios la página h5 de CSS `https://aeternalis.foroactivo.com/h5-supermapa2-0` y el HTML mínimo existente.

### Funcionamiento y actualizaciones
El cargador solicita el manifiesto y todos los JSON a GitHub Pages con `cache: 'no-store'` y parámetro ant caché. Tras publicarse un cambio en Pages, normalmente basta recargar Foroactivo para verlo; no es transmisión instantánea a una pestaña abierta.

### Integridad
El motor original está en `backups/supermapa-autonomo-v1.7.js`. Los párrafos, curiosidades, indicadores, distritos, coordenadas y 165 caminos del Supermapa v1.7 están separados en los archivos JSON sin reescritura editorial. Los caminos siguen marcados como propuestas.

### Riesgos
Los datos publicados en Pages son públicos; no guardar secretos de tramas ni credenciales. No ejecutar simultáneamente el nuevo cargador y el JS v1.7: compiten por el mismo contenedor y pueden duplicar mapas.

### Código y estilos
`js/supermapa-core.js` es el motor completo heredado que recibe datos desde la carga externa. El CSS sigue alojado en h5, y hay una copia en `css/supermapa-v1.7-h5.html`.
