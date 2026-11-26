# Assets navales de Aeternalis

**126 imágenes individuales**, derivadas de seis láminas generadas.

Las piezas incluyen naves piratas, nórdicas, orientales y medievales; emblemas heráldicos; armas y componentes navales; un conjunto de insignias de niveles y elementos para el mapa/navegación.

## Organización

Las rutas siguen `assets/naval/<familia>/<nombre>.[png|webp]`.

- Piratas: 16
- Nórdicos: 17
- Yūgen/orientales: 16
- Medievales: 20
- Progresión: 27
- Navegación/mapa: 30

## Reutilización en la futura interfaz

El documento `Sistema de navegación.docx` define **Velas**, **Resistencia**, **Tripulación** y **Poder de Ataque**, cada una con niveles 1, 2, 3 y legendario. Los dieciséis iconos `mejora_*` permiten representar estas cuatro categorías de progresión sin asumir reglas distintas a las definidas en el documento.

La colección se creó pensando en el sistema visual, **no** altera el reglamento. Comprobar compatibilidades y requisitos de cada mejora con el documento antes de implementarla (por ejemplo, Velas III y Resistencia III son incompatibles, salvo los casos legendarios definidos).

## Cómo publicarlos

Copia la carpeta `assets/naval/` a la raíz del repositorio `Morpheus-Eko/aeternalis`. El JSON registra las rutas web esperadas; antes de la publicación no serán accesibles desde GitHub Pages. Los WebP se recomiendan para el foro, los PNG para archivo y edición.

## Límites de los recortes

Las láminas son imágenes generadas con elementos de origen muy próximos. Se separaron con componentes de alfa, preservando antialias y contornos translúcidos. Los cuatro grupos de medallones de progresión y algunos emblemas apilados de Yūgen compartían detalles ornamentales: esos se dividieron mediante recortes guiados; pueden conservar pequeños fragmentos compartidos. Los escudos superpuestos nórdicos se mantienen como una pieza conjunta porque separarlos destruiría las partes ocultas. Los nombres de facciones son etiquetas visuales, no una atribución automática del canon.
