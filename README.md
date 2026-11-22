# Intrecci d’Essenze – Sito web

Catalogo online di **Intrecci d’Essenze** – *Creazioni in cera di soia* (Sabrina e Daniela, Canton Ticino).

- **Tecnologia:** Astro (pagine HTML statiche, veloci e leggere)
- **Lingua:** italiano (struttura pronta per aggiungere altre lingue in futuro)
- **Pannello di gestione:** Sveltia CMS su `/admin`, utilizzabile da iPhone, login con GitHub
- **Hosting:** GitHub + Cloudflare Pages
- **Ordini:** pulsante “Ordina su WhatsApp” con messaggio precompilato, verso il numero della creatrice del prodotto. Nessun pagamento online.

## Comandi

```bash
npm install                  # prima volta
npm run dev                  # sito in locale → http://localhost:4321
npm run build                # versione di produzione in dist/
ANTEPRIMA=1 npm run build    # come sopra, ma mostra anche i prodotti in bozza
npm run check                # controllo del codice
```

## Struttura

```
src/content/prodotti/       un file .json per ogni prodotto (gestiti dal pannello)
src/content/pagine/         testi di homepage, storia, contatti
src/content/legale/         spedizioni e condizioni, privacy
src/content/impostazioni/   numeri WhatsApp, Instagram, testi delle categorie
public/images/logo/         logo ufficiale (non modificato) e versioni web
public/images/prodotti/     foto caricate dal pannello
functions/api/              login GitHub del pannello (Cloudflare Pages Functions)
```

## Pagine

Home · Tutte le creazioni · Candele · Tart per armadi · Cere da sciogliere · Confezioni regalo · Scheda di ogni prodotto · La nostra storia · Contatti · Spedizioni e condizioni · Privacy e informazioni legali · Sitemap e robots.txt.

## Regole sui contenuti

- Nessun dato inventato: prezzi, pesi, note olfattive e numeri si inseriscono solo quando sono confermati.
- Prezzo vuoto → il sito mostra “Prezzo su richiesta”.
- Numero WhatsApp vuoto → il pulsante appare grigio e non attivo.
- Le avvertenze di sicurezza hanno un campo separato dalla descrizione e vanno inserite solo se verificate.
- La percentuale di fragranza non va mai indicata nelle schede.

Configurazione e messa online: vedi [docs/CONFIGURAZIONE.md](docs/CONFIGURAZIONE.md).
