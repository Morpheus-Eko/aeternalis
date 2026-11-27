# El Códice de la Salud · Replanteamiento editorial v0.1

**Proyecto:** sustituir conceptualmente el limitado «Códice de las Pestilencias» por un **compendio médico de Aeternalis**. El módulo existente `pestilencias` y sus reglas continúan intactos durante el diseño del nuevo libro.

## Orden de los libros

1. **Introducción / voz del compilador:** un archivo de observaciones firmado por médicos, chamanes, parteras, sacerdotes, curanderas, boticarios y viajeros.
2. **Atlas de anatomía racial:** Altos Elfos, Montaraces, Yūgen, Enanos, Humanos, Nórin, Sin'hair y Amarant (según `data/razas/manifest.json`); ficha por anatomía, hábitos, vida y riesgos regionales.
3. **Generación y mestizaje:** genealogías y relación entre linajes, distinguiendo sexo del descendiente y raza del descendiente. **Por precisar:** la formulación «el sexo del bebé está determinado por la raza de la madre» antes de convertirla en regla narrativa.
4. **Aires, aguas y trabajos:** enfermedades relacionadas con la vida cotidiana, las rutas, el trabajo minero, el frío, la selva y las costas. Distinguir epidemiología de genética e hipótesis de mecánica aprobada.
5. **Herbario / materia médica:** plantas comunes y por región, usos modestos, preparación, riesgos y contraindicaciones; no existen curas universales.
6. **Pestilencias reglamentadas:** Fiebre de Driadem, Canto de la Orquídea Marchita y Sangrenegra. Conservar los datos y cálculos presentes en `data/pestilencias/enfermedades.json`.
7. **Cuadernos y atlas del investigador:** notas, borradores, láminas originales completas y fragmentos ilustrativos reutilizados.

## Tono y validez

El texto literario se redactará **en primera o tercera persona** como observaciones de fuentes diferentes, con marginalia y discrepancias. Cada afirmación llevará una categoría editorial: `canon`, `testimonio`, `hipótesis`, `propuesta narrativo-médica` o `regla pendiente`.

La anatomía de las figuras **no crea resistencias nuevas**. El catálogo racial actual no incluye orcos ni humanoides reptilianos; ilustraciones de esos tipos y composiciones generadas con reglas dudosas se conservan solo como material de archivo no canónico. La anatomía no muerta, cuando se use, representa un estado patológico o una intervención nigromántica, no una raza adicional.

## Nueva interfaz objetivo

- **Un libro de folios reales**, sin texto desbordando una imagen fija de pergamino; doble página en escritorio, una hoja legible en móvil.
- Ilustraciones anatómicas dentro de las páginas; bustos, saltos, glosario, búsqueda y ayudas en un panel que se abre con la **Brújula Arcana**.
- Texto y títulos con la tipografía del foro, nunca letras incrustadas en las imágenes.
- Atajos artísticos reutilizando botones góticos del repertorio de GitHub.
- Hoja de atlas completa, con anotaciones del médico, al inicio o final como parte del archivo.
- HTML mínimo y CSS/JS/JSON separados; imágenes WebP con carga diferida para cuidar la navegación en Foroactivo.
- No desplegar el reemplazo en producción antes de validar capítulos, imágenes canónicas y continuidad de la calculadora.

## Producción de assets · 27/11/2026

En el paquete de trabajo local se han preparado **10 láminas íntegras, 85 figuras recortadas con versión en pergamino y tinta con transparencia estimada, 20 paneles comparativos y muestrarios**. El paquete binario todavía requiere subida individual a GitHub; **este documento no equivale a publicar los recortes**. Las láminas preliminares de Enanos, Montaraces y Amarant no son aún atlas canónicos definitivos, y falta la lámina específica de Sin'hair.

## Siguiente revisión

Priorizar anatomías fieles al registro de las ocho razas, acordar la formulación exacta de la regla materna y convertir el prototipo editorial en módulo separado, sin sobreescribir hasta entonces el visor de enfermedades existente.
