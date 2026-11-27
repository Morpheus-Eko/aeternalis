# Carta Náutica 3.3 · costas, ríos y Yūgen

**Integración: 27 de noviembre de 2026.** 55 escalas solicitadas, 97 corredores nuevos y 111 tramos totales precalculados. Se conservan los 14 corredores anteriores.

Los puertos y localidades ribereñas se integraron por ID al Atlas. **Kazehara es puerto**, Yukishima y Tetsumori no se designaron puertos sin confirmación. La senda terrestre violeta de Yukishima–Tetsumori se guarda exclusivamente en caminos.json.

**Límite:** las rutas sobre agua se derivan del grafo cromático del Mapa 3.21, no de la clasificación del raster 3.3 recién aportado. Los accesos con desfase de más de 25 px se señalan como *no verificados* y no se dibuja una línea recta de conexión terrestre. Debe regenerarse la máscara de hexágonos con el PNG nuevo antes de considerarlas navegables.

**El raster 3.3 está pendiente de publicación.** No se alteró la URL del mapa público para evitar imágenes rotas. El archivo Mapa_3.3.png y sus variantes de hexágonos deben subirse a assets/mapas/ antes de cambiar CONFIG.MAP_URL en js/supermapa-core.js y data/atlas/catalogo.json.

## Accesos fluviales que necesitan revisión
- Kale: 66.9 px respecto del componente oceánico anterior
- Rinnos: 28.1 px respecto del componente oceánico anterior
- Cyder: 77.6 px respecto del componente oceánico anterior
- Bajo Reeve: 128.8 px respecto del componente oceánico anterior
- Fuerte Hydell: 169.8 px respecto del componente oceánico anterior
- Monasterio Celendyr: 92.7 px respecto del componente oceánico anterior
- Fohn’Veridan: 102.9 px respecto del componente oceánico anterior
- Alandra: 188.8 px respecto del componente oceánico anterior
- Loth’Veridan: 96.5 px respecto del componente oceánico anterior
- Ris'Veridan: 36.4 px respecto del componente oceánico anterior

## Verificación
La Carta Náutica sigue integrada al Supermapa, no al Astillero. Prueba en https://morpheus-eko.github.io/aeternalis/supermapa-naval-preview.html?naval=1.

## Corrección de carga

El 27 de noviembre se corrigió la incoherencia del manifiesto (26 regiones reales frente a 24 declaradas), se retiró el camino violeta duplicado y se configuró en el motor `MAP_URL` con `assets/mapas/mapa-3.3.webp?v=3.3.1` y respaldo automático al mapa anterior.

**Falta únicamente cargar físicamente la imagen** en la ruta esperada; preparar el código no equivale a publicar el archivo binario. GitHub Pages mostrará el mapa anterior hasta que `mapa-3.3.webp` esté disponible.
