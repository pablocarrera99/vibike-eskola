const fallbackNews = [
  {
    "date":"Próximamente",
    "category":"VITRI",
    "title":"La actualidad de VITRI, siempre en portada",
    "summary":"Aquí aparecerá cada semana el resumen de competiciones, entrenamientos, actividades y novedades del club.",
    "image":"",
    "url":""
  }
];

function escapeHtml(value=""){
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
}

function newsMedia(item, className){
  const image = item.image ? '<img src="'+escapeHtml(item.image)+'" alt="">' : '';
  return '<div class="'+className+(item.image ? '' : ' no-image')+'">'+image+'</div>';
}

function renderNews(items){
  const news = items.length ? items : fallbackNews;
  const featured = news[0];

  document.getElementById("featured-news").innerHTML =
    newsMedia(featured,"featured-news-media")+
    '<div class="featured-news-copy">'+
      '<span class="news-meta">'+escapeHtml(featured.category)+' · '+escapeHtml(featured.date)+'</span>'+
      '<h3>'+escapeHtml(featured.title)+'</h3>'+
      '<p>'+escapeHtml(featured.summary)+'</p>'+
      (featured.url ? '<a href="'+escapeHtml(featured.url)+'">Leer noticia →</a>' : '')+
    '</div>';

  const secondary = news.slice(1,4);
  document.getElementById("news-grid").innerHTML = secondary.map(item =>
    '<article class="news-card">'+
      newsMedia(item,"news-card-media")+
      '<div class="news-card-copy">'+
        '<span class="news-meta">'+escapeHtml(item.category)+' · '+escapeHtml(item.date)+'</span>'+
        '<h3>'+escapeHtml(item.title)+'</h3>'+
        '<p>'+escapeHtml(item.summary)+'</p>'+
      '</div>'+
    '</article>'
  ).join("");
}

fetch("data/noticias.json")
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(data => renderNews(Array.isArray(data.noticias) ? data.noticias : []))
  .catch(() => renderNews(fallbackNews));
