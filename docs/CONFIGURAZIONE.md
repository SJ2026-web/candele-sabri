# Configurazione e messa online

Nulla viene acquistato o pubblicato senza approvazione.

## 1. Cloudflare Pages (gratuito)

1. dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git** → repository `SJ2026-web/candele-sabri`.
2. Impostazioni di build:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Variabile `NODE_VERSION` = `22`
3. Ogni push su `main` pubblica il sito in automatico.

## 2. Login del pannello `/admin`

**Subito, senza configurazioni:** nella schermata del pannello scegli *Sign in using Access Token* e incolla un *Fine-grained personal access token* GitHub (GitHub → Settings → Developer settings → Personal access tokens) con permesso **Contents: Read and write** limitato al solo repository `candele-sabri`. Su iPhone il token si salva nel portachiavi.

**Login con il pulsante GitHub (consigliato a regime):**
1. GitHub → Settings → Developer settings → **OAuth Apps → New OAuth App**
   - Homepage URL: l’indirizzo del sito
   - Authorization callback URL: `https://<indirizzo-del-sito>/api/callback`
2. Su Cloudflare Pages → Settings → Variables:
   - `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET` (secret)
   - `CMS_ALLOWED_USERS` = `SJ2026-web` (altri utenti separati da virgola)
   - `SITE_URL` = indirizzo del sito, es. `https://intrecci-dessenze.pages.dev`
3. Rifai il deploy.

## 3. Dominio .ch (quando approvato)

Registrare il dominio (circa 10–20 CHF/anno) → Cloudflare Pages → **Custom domains**. Poi aggiornare `SITE_URL`, la Homepage e la Callback dell’OAuth App, e inviare `/sitemap.xml` a Google Search Console.

## Da completare (campi già pronti nel pannello)

| Cosa | Dove nel pannello | Finché manca |
|---|---|---|
| Numeri WhatsApp di Sabrina e Daniela | Impostazioni → Contatti, WhatsApp e Instagram | Pulsanti grigi non attivi |
| Prodotti con foto, profumazione, note, peso, prezzo, codice | Prodotti | Pagine con “arriveranno a breve” |
| Immagine di copertina della homepage | Pagine → Homepage | Homepage con solo logo |
| Foto delle categorie | Impostazioni → Categorie | Icona disegnata |
| Dati legali (nomi, indirizzo, email) | Impostazioni → Dati legali | Sezione non mostrata |
| Condizioni di spedizione (costi, corriere, ritiro, zone) | Pagine → Spedizioni e condizioni | Testo provvisorio |
| Revisione privacy | Pagine → Privacy | Bozza da verificare |
| Nuovo nome Instagram | Impostazioni → Instagram | Link a @_medleyofscents_ |
| Avvertenze di sicurezza per prodotto | Prodotti → Avvertenze | Sezione non mostrata |

## Prima di iniziare le vendite

- Dati legali del venditore (in Svizzera un sito commerciale deve indicare nome, indirizzo ed email).
- Condizioni di spedizione e pagamento (TWINT commercianti / Revolut Pro, incassi separati per ciascuna creatrice).
- Verifica delle etichette e delle avvertenze (CLP, allergeni, schede di sicurezza) con la documentazione delle fragranze.

## Prodotto di esempio

`src/content/prodotti/winter-wonderland.json` contiene l’esempio del brief come **bozza** (non pubblicato, prezzo vuoto). Verificare i dati, aggiungere la foto e attivare “Pubblicato”, oppure eliminarlo.
