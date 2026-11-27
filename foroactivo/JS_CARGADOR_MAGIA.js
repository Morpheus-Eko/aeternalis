/* AETERNALIS · Códice de Magia v1.1 — Cargador de CSS externo */
(function () {
  "use strict";

  // Sustituir la ruta por la URL real de TU página HTML de CSS de Magia.
  // Ejemplo: "/h7-css-codice-de-magia" (es solo un ejemplo).
  var CSS_PAGE = "https://morpheus-eko.github.io/aeternalis/css/magia-codice.css?v=1.1.0";
  var ROOT = "aem-magic-codex";
  var STYLE_ID = "aem-magic-codex-styles-v11";
  var INICIO = "/* AEM_CSS_INICIO_V11 */";
  var FIN = "/* AEM_CSS_FIN_V11 */";

  function extraerCSS(respuesta) {
    // Caso recomendado: la página contiene <style id="aem-magic-css-source">.
    var pagina = new DOMParser().parseFromString(respuesta, "text/html");
    var estilo = pagina.getElementById("aem-magic-css-source");
    if (estilo && estilo.textContent.trim()) return estilo.textContent;

    // Respaldo: extraer el CSS entre marcadores si se perdió la etiqueta style.
    var inicio = respuesta.indexOf(INICIO);
    var fin = respuesta.indexOf(FIN);
    if (inicio !== -1 && fin > inicio) {
      return respuesta.slice(inicio, fin + FIN.length);
    }

    // Respaldo para páginas que muestran CSS como texto dentro de body/pre.
    var candidato = (pagina.body && pagina.body.textContent) || "";
    if (candidato.indexOf("#aem-magic-codex") !== -1) return candidato;

    throw new Error("La página indicada no contiene los estilos del Códice de Magia.");
  }

  function arrancar() {
    var raiz = document.getElementById(ROOT);
    if (!raiz) return; // El resto del foro permanece intacto.
    if (document.getElementById(STYLE_ID)) return;
    if (!CSS_PAGE || CSS_PAGE.indexOf("hNUM") !== -1) {
      console.error("[Aeternalis Magia] Falta colocar la URL real en CSS_PAGE.");
      return;
    }

    fetch(CSS_PAGE, { credentials: "same-origin", cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("Error HTTP " + res.status);
        return res.text();
      })
      .then(function (paginaHTML) {
        var css = extraerCSS(paginaHTML);
        if (css.indexOf("#aem-magic-codex") === -1) {
          throw new Error("El CSS encontrado no pertenece al Códice de Magia.");
        }
        var s = document.createElement("style");
        s.id = STYLE_ID;
        s.textContent = css;
        document.head.appendChild(s);
        console.info("[Aeternalis Magia] CSS instalado. Tarjetas: " + raiz.querySelectorAll(".aem-rule").length);
      })
      .catch(function (error) {
        console.error("[Aeternalis Magia] No se cargó el CSS desde " + CSS_PAGE + ":", error);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arrancar, { once: true });
  } else {
    arrancar();
  }
})();