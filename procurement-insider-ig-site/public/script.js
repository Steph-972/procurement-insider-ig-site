// script.js — interactions légères (scroll + forms)
(function(){
  // Smooth scroll
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(a=>a.addEventListener('click',e=>{
    const id=a.getAttribute('href').slice(1); const el=document.getElementById(id);
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); }
  }));

  async function wireForm(formId, statusId){
    const f=document.getElementById(formId); if(!f) return;
    const msg=document.getElementById(statusId);
    f.addEventListener('submit', async (e)=>{
      e.preventDefault();
      msg.textContent='Envoi en cours…';
      const fd=new FormData(f), body=Object.fromEntries(fd.entries());
      try{
        const res=await fetch(f.action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
        if(res.ok){ msg.textContent='Merci ! Vérifiez votre email pour confirmer votre inscription.'; f.reset(); }
        else{ msg.textContent='Impossible de traiter votre demande.'; }
      }catch(err){ msg.textContent='Erreur réseau. Merci de réessayer.'; }
    });
  }
  wireForm('ig-sub','ig-sub-msg');
  wireForm('ig-sub-mobile','ig-sub-mobile-msg');
})();