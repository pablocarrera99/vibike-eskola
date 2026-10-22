/* VITRI - sistema de noticias compartido para ES/EU */
(() => {
  "use strict";
  const body=document.body;
  const lang=body.dataset.lang==="eu"?"eu":"es";
  const base=body.dataset.root||"";
  const page=body.dataset.page||"index.html";
  const tr=lang==="eu"?
    {read:"Albistea irakurri",no:"Laster argitaratuko ditugu VITRIren albisteak.",none:"Ez da albisterik aurkitu.",missing:"Euskarazko bertsioa prestatzen ari gara.",back:"Albisteetara itzuli",unknown:"Ez dugu albiste hau aurkitu.",soon:"Laster",media:"VITRIko albistea"}:
    {read:"Leer noticia",no:"Pronto publicaremos las noticias de VITRI.",none:"No hay noticias que coincidan con la búsqueda.",missing:"",back:"Volver a noticias",unknown:"No se ha encontrado esta noticia.",soon:"Próximamente",media:"Noticia de VITRI"};
  const limit=9;
  let visible=limit;
  let all=[];
  const $=s=>document.querySelector(s);
  const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const value=(post,name)=>{
    if(lang==="eu"){
      if(post[name+"_eu"])return String(post[name+"_eu"]);
      if(name==="category")return post.category_eu||post.category||"VITRI";
      if(name==="date")return post.date_eu||post.date||"";
      return tr.missing;
    }
    return String(post[name+"_es"]??post[name]??"");
  };
  const dateText=post=>value(post,"date")||"";
  const media=(post,large=false)=>{
    const img=post.image?String(post.image):"";
    if(img && !/^(?:javascript|data):/i.test(img)){
      const source=/^https?:\/\//i.test(img)?img:base+img.replace(/^\/+/, "");
      return '<div class="'+(large?"featured-news-media":"news-card-media")+'"><img loading="lazy" src="'+esc(source)+'" alt="'+esc(value(post,"title"))+'"></div>';
    }
    return '<div class="'+(large?"featured-news-media":"news-card-media")+' no-image" aria-hidden="true"></div>';
  };
  const getUrl=post=>{
    if(post.slug && (post.body_es||post.body||post.body_eu))return "noticia.html?id="+encodeURIComponent(post.slug);
    const link=lang==="eu"?(post.url_eu||post.url):post.url;
    if(link && (/^https?:\/\//i.test(link)||/^(?:[.\/a-z0-9_-]+)(?:\?.*)?$/i.test(link)))return String(link);
    return "";
  };
  const card=post=>{
    const url=getUrl(post);
    return '<article class="news-card">'+media(post)+'<div class="news-card-copy"><span class="news-meta">'+esc(value(post,"category"))+' · '+esc(dateText(post))+'</span>'+
      '<h3>'+esc(value(post,"title"))+'</h3><p>'+esc(value(post,"summary"))+'</p>'+
      (url?'<a class="news-card-link" href="'+esc(url)+'">'+tr.read+' →</a>':"")+
      '</div></article>';
  };
  function featured(post){
    const target=$("#featured-news");
    if(!target)return;
    if(!post){target.innerHTML='<article class="featured-news-copy"><h3>'+tr.soon+'</h3><p>'+tr.no+'</p></article>';return;}
    const url=getUrl(post);
    target.innerHTML=media(post,true)+'<div class="featured-news-copy"><span class="news-meta">'+esc(value(post,"category"))+' · '+esc(dateText(post))+'</span>'+
      '<h3>'+esc(value(post,"title"))+'</h3><p>'+esc(value(post,"summary"))+'</p>'+
      (url?'<a href="'+esc(url)+'">'+tr.read+' →</a>':"")+"</div>";
  }
  function homepage(){
    featured(all[0]);
    const grid=$("#news-grid");
    if(grid)grid.innerHTML=all.slice(1,4).map(card).join("");
  }
  function archive(){
    const grid=$("#all-news"),search=$("#news-search"),more=$("#load-more-news");
    if(!grid)return;
    const draw=()=>{
      const query=(search?.value||"").trim().toLocaleLowerCase();
      const filtered=all.filter(post=>[value(post,"title"),value(post,"summary"),value(post,"category"),value(post,"date")].join(" ").toLocaleLowerCase().includes(query));
      grid.innerHTML=filtered.length?filtered.slice(0,visible).map(card).join(""):'<p class="empty-news">'+(all.length?tr.none:tr.no)+'</p>';
      if(more)more.hidden=filtered.length<=visible;
    };
    search?.addEventListener("input",()=>{visible=limit;draw();});
    more?.addEventListener("click",()=>{visible+=limit;draw();});
    draw();
  }
  function article(){
    const el=$("#single-news");
    if(!el)return;
    const slug=new URLSearchParams(location.search).get("id");
    const post=all.find(p=>String(p.slug)===slug);
    if(!post){el.innerHTML="<h1>"+tr.unknown+"</h1>";return;}
    // Conserva la URL individual y sus equivalentes de idioma para cada artículo.
    const query="?id="+encodeURIComponent(String(slug));
    const canonical=$('link[rel="canonical"]');
    if(canonical)canonical.href=location.origin+location.pathname+query;
    for(const alternate of document.querySelectorAll('link[rel="alternate"][hreflang]')){
      if(!alternate.href.includes("?id="))alternate.href+=query;
    }
    const content=value(post,"body").trim()||tr.missing;
    const paragraphs=content.split(/\n\s*\n/g).map(p=>"<p>"+esc(p).replace(/\n/g,"<br>")+"</p>").join("");
    el.innerHTML='<p class="news-meta">'+esc(value(post,"category"))+' · '+esc(dateText(post))+'</p><h1>'+esc(value(post,"title"))+'</h1>'+
      (post.image?media(post,true):"")+
      '<p class="article-summary">'+esc(value(post,"summary"))+'</p>'+paragraphs;
    document.title=value(post,"title")+" | VITRI Gasteiz";
  }
  for(const a of document.querySelectorAll("[data-lang-switch]"))a.href+=location.search;
  fetch(base+"data/noticias.json",{cache:"no-store"})
    .then(r=>r.ok?r.json():Promise.reject(new Error("No se pudo cargar noticias.json")))
    .then(data=>{
      all=Array.isArray(data.noticias)?data.noticias:[];
      all=all.map((x,i)=>({...x,__order:i})).sort((a,b)=>{
        const valid=s=>/^\d{4}-\d\d-\d\d$/.test(s||"")?Date.parse(s):0;
        const da=valid(a.date_iso||a.date),db=valid(b.date_iso||b.date);
        return db-da||a.__order-b.__order;
      });
      if(page==="index.html")homepage();
      if(page==="noticias.html")archive();
      if(page==="noticia.html")article();
    })
    .catch(()=>{
      all=[];
      if(page==="index.html")homepage();
      if(page==="noticias.html")archive();
      if(page==="noticia.html")article();
    });
})();