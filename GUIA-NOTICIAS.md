# Publicar noticias en VITRI
La información de portada y del archivo de noticias se obtiene de `data/noticias.json`.

## Nueva publicación
1. Sube una imagen a `assets/noticias/` (si tienes permiso para publicarla, especialmente cuando aparezcan menores).
2. Añade un objeto al array `noticias`, indicando `date_iso` con la fecha en formato YYYY-MM-DD.
3. Escribe `title_es`, `summary_es`, `body_es` y los campos equivalentes `title_eu`, `summary_eu`, `body_eu`.
4. Añade `slug` único, sin acentos ni espacios (ejemplo: `carrera-gasteiz-2026`). El artículo se mostrará en `noticia.html?id=carrera-gasteiz-2026` o `eu/noticia.html?id=...`.
5. Añade `image` como `assets/noticias/nombre.jpg`; deja vacío si no hay foto.

Ejemplo:
```json
{
  "slug": "ejemplo-publicacion",
  "date_iso": "2026-10-22",
  "date": "22 de octubre de 2026",
  "date_eu": "2026ko urriaren 22a",
  "category": "Club",
  "category_eu": "Kluba",
  "title_es": "Ejemplo de título",
  "title_eu": "Izenburuaren adibidea",
  "summary_es": "Resumen en castellano.",
  "summary_eu": "Laburpena euskaraz.",
  "body_es": "Primer párrafo.\n\nSegundo párrafo.",
  "body_eu": "Lehen paragrafoa.\n\nBigarren paragrafoa.",
  "image": "assets/noticias/foto.jpg"
}
```

Las publicaciones con `date_iso` aparecerán de más reciente a más antigua. La portada enseña la noticia destacada y hasta tres secundarias; `noticias.html` muestra el archivo completo, con buscador y carga por lotes de nueve.

Nota: la publicación bilingüe exige revisar las dos versiones antes de compartirla. Los campos antiguos sin sufijo `_es` siguen funcionando.
