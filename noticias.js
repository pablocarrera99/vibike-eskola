function escapeHtml(value=""){
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
}

function renderAllNews(items){
  const root = document.getElementById("all-news");
  if(!items.length){
    root.innerHTML = '<article class="news-card"><div class="news-card-copy"><span class="news-meta">VITRI</span><h3>Próximamente</h3><p>Aquí iremos publicando toda la actualidad del club.</p></div></article>';
    return;
  }

  root.innerHTML = items.map(item => {
    const media = item.image
      ? '<div class="news-card-media"><img src="'+escapeHtml(item.image)+'" alt="'+escapeHtml(item.title || "Noticia VITRI")+'"></div>'
      : '<div class="news-card-media no-image"></div>';

    return '<article class="news-card">'+
      media+
      '<div class="news-card-copy">'+
        '<span class="news-meta">'+escapeHtml(item.category)+' · '+escapeHtml(item.date)+'</span>'+
        '<h3>'+escapeHtml(item.title)+'</h3>'+
        '<p>'+escapeHtml(item.summary)+'</p>'+
        (item.url ? '<a class="news-card-link" href="'+escapeHtml(item.url)+'">Leer noticia →</a>' : '')+
      '</div>'+
    '</article>';
  }).join("");
}

fetch("data/noticias.json")
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(data => renderAllNews(Array.isArray(data.noticias) ? data.noticias : []))
  .catch(() => renderAllNews([]));