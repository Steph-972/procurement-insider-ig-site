// api/subscribe.js
// Endpoint Vercel — Abonnement Brevo + journalisation consentement RGPD
// ENV requis : BREVO_API_KEY
// Optionnel : KV_REST_API_URL, KV_REST_API_TOKEN (Upstash KV via REST)

export default async function handler(req, res){
  if(req.method !== "POST") return res.status(405).send('Method Not Allowed');
  try{
    const { email, listId, source = 'Instagram' } = req.body || {};
    if(!email || !listId) return res.status(400).send('Missing email or listId');

    // 1) Créer/MàJ contact dans Brevo
    const r = await fetch('https://api.brevo.com/v3/contacts',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email,
        listIds: [ Number(listId) ],
        updateEnabled: true
      })
    });
    const data = await r.json();
    if(!r.ok){
      return res.status(r.status).send(data.message || 'Brevo error');
    }

    // 2) Journalisation consentement (si Upstash KV configuré)
    const record = {
      email,
      listId: Number(listId),
      consent: true,
      source,
      ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || null,
      ts: new Date().toISOString()
    };

    try{
      const url = process.env.KV_REST_API_URL;
      const token = process.env.KV_REST_API_TOKEN;
      if(url && token){
        await fetch(`${url}/lpush/pi:consents`,{
          method:'POST',
          headers:{ 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' },
          body: JSON.stringify({ value: JSON.stringify(record) })
        });
      } else {
        console.log('[CONSENT]', record);
      }
    }catch(e){
      console.warn('KV log failed', e);
    }

    return res.status(200).json({ ok:true });
  }catch(err){
    return res.status(500).send('Server error');
  }
}