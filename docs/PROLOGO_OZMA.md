# Aeternalis · Prólogo del Bardo

## Objetivo

Una **única lámina vertical** para la publicación de **Ambientación** del foro. Ozma, el bardo, narra el inicio de la Cuarta Era desde una taberna, se dirige al viajero y concluye invitándolo a comenzar su propia historia. No hay paginación, menús desplegables ni un libro secundario.

La versión 1.0.0 desarrolla cinco cantos: el nuevo mundo, las sociedades secretas, Verdenteyl, los confines del mundo y la tregua de Alatariel. El relato es una adaptación teatral del texto de Ambientación facilitado por el autor, con intervención en primera persona de Ozma y acotaciones escénicas. No añade mecánicas.

### Dos imágenes originales

- Ozma: https://2img.net/u/4917/89/95/32/avatars/1-53.jpg
- Taberna: https://2img.net/i.imgur.com/8CZFJnE.png

**No se descargaron, editaron ni replicaron estas imágenes.** Se referencian literalmente los enlaces compartidos por el usuario y la página contiene una presentación alternativa si dejan de cargar. Se debe comprobar su disponibilidad dentro del foro.

La ornamentación utiliza solo archivos existentes de `assets/codex/`: esquinas de bronce, filigranas, emblemas, libros, brújula, reloj de arena y pluma.

## Arquitectura en GitHub

| Archivo | Función |
| --- | --- |
| `data/prologo-ozma/relato.json` | Texto de Ozma, acotaciones, cinco cantos, iconos y enlaces |
| `js/prologo-ozma/visor.js` | Renderizado semántico de una lámina; no incluye CSS |
| `css/prologo-ozma.css` | Estilos encapsulados en `#ae-prologo-ozma` |
| `prologo-ozma/index.html` | [Vista independiente](https://morpheus-eko.github.io/aeternalis/prologo-ozma/) |
| `css/prologo-ozma-preview.css` | Solo estilos de la vista independiente |
| `foroactivo/HTML_PROLOGO_OZMA.html` | Código mínimo para pegar en el mensaje de Ambientación |

## Instalación en Foroactivo

1. Confirmar que está activo el cargador maestro único `foroactivo/JS_UNICO_MAESTRO_PEGAR.js`, que carga el módulo solo al detectar `#ae-prologo-ozma`.
2. **Editar el mensaje existente de Ambientación** y reemplazar el contenido antiguo por:
   ```html
   <div class="hidethisprofile"></div>
   <div id="ae-prologo-ozma"></div>
   ```
3. Guardar la publicación y comprobar que se ve la escena de la taberna, el medallón de Ozma, los cinco cantos y las rutas de salida.

La subida a GitHub deja el módulo listo, pero **no modifica por sí sola una publicación guardada en Foroactivo**. No hay acceso al panel del foro en esta sesión: este paso debe verificarse allí. Tampoco hace falta añadir CSS al foro ni editar los estilos de h4/h5.

## Edición futura

Para modificar narración, escenas o los enlaces, editar solo `data/prologo-ozma/relato.json`. Las fuentes de texto son HTML del módulo y heredan la familia tipográfica del foro; no se generan imágenes de títulos ni botones. Para rediseñar una sección, editar `css/prologo-ozma.css`; solo modificar el motor si cambia la estructura. Mantener la narración continua en una sola lámina.
