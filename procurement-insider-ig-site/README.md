# Procurement Insider — Mini dépôt (Instagram + Site)

Déploiement **Vercel** (statique + API serverless) prêt à l'emploi.

## 📦 Contenu
- `public/index.html` — Landing minimaliste
- `public/ig.html` — Micro-landing Instagram (desktop)
- `public/ig-mobile.html` — Version mobile type Linktree
- `public/politique-confidentialite.html` — Page RGPD
- `public/styles.css` — Styles (tokens + layout)
- `public/script.js` — JS léger (scroll + formulaires)
- `api/subscribe.js` — Endpoint d'abonnement Brevo (RGPD log)
- `vercel.json` — Routes/redirects (/ig, /ig/mobile) + statique
- `package.json` — Config Node 18 (sans dépendances)
- `public/assets/logo.svg` — Placeholder logo

## 🚀 Déploiement sur Vercel (pas à pas)
1. **Créer le projet** → Importer ce dépôt dans Vercel.
2. Dans *Project Settings → Environment Variables*, ajouter :
   - `BREVO_API_KEY` = *votre clé API Brevo v3*
   - *(Optionnel)* `KV_REST_API_URL` et `KV_REST_API_TOKEN` (Upstash KV) pour journaliser le consentement.
3. Déployer. Les routes exposées : 
   - `https://<domaine>/` → index
   - `https://<domaine>/ig` → micro-landing IG
   - `https://<domaine>/ig/mobile` → version mobile IG
   - `POST https://<domaine>/api/subscribe` → endpoint Brevo

## 🧩 Configuration Brevo
- Liste : **Procurement Insider — IG** (`listId` **10** utilisé dans les formulaires).
- Activez le **double opt‑in** côté Brevo.
- Chaque email envoyé doit inclure un lien de **désinscription** (géré par Brevo).

## 🔒 Journalisation du consentement (RGPD)
- Si `KV_REST_API_URL` + `KV_REST_API_TOKEN` sont configurés (Upstash KV), l'endpoint pousse un enregistrement JSON dans la liste `pi:consents`.
- Sinon, fallback : `console.log` côté serveur (logs Vercel).

## ✅ Tests rapides
- Ouvrir `/ig` et `/ig/mobile`.
- Tester un email → message *“Merci ! Vérifiez votre email pour confirmer votre inscription.”*.
- Vérifier l’ajout du contact dans Brevo (liste `10`).

---

*Généré : 2025-08-27T15:43:38.027435Z*
