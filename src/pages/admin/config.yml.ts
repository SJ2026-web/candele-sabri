// Configurazione del pannello /admin (Sveltia CMS), generata durante la build.
// Il formato JSON è YAML valido. Variabili (Cloudflare Pages → Settings → Variables):
//   CMS_GITHUB_REPO   predefinito "SJ2026-web/candele-sabri"
//   CMS_GITHUB_BRANCH predefinito "main"
//   SITE_URL          dominio del sito; serve per il login GitHub tramite /api/auth
import type { APIRoute } from 'astro';

const S = (label: string, extra: Record<string, unknown> = {}) => ({ label, widget: 'string', ...extra });
const TX = (label: string, extra: Record<string, unknown> = {}) => ({ label, widget: 'text', ...extra });
const IMG = (label: string, extra: Record<string, unknown> = {}) => ({ label, widget: 'image', required: false, ...extra });
const f = (name: string, field: Record<string, unknown>) => ({ name, ...field });
const seo = [
  f('seoTitle', S('Google – titolo', { hint: 'Circa 60 caratteri' })),
  f('seoDescription', TX('Google – descrizione', { hint: 'Circa 150 caratteri' })),
];
const categorieOpt = [
  { label: 'Candele', value: 'candele' },
  { label: 'Tart profumate per armadi', value: 'tart' },
  { label: 'Cere da sciogliere (wax melts)', value: 'cere' },
  { label: 'Confezioni regalo', value: 'regalo' },
];
const categoria = (id: string, label: string) => ({
  name: id, label, widget: 'object', collapsed: true,
  fields: [f('titolo', S('Titolo')), f('intro', TX('Testo introduttivo')), f('immagine', IMG('Immagine della categoria (facoltativa)'))],
});

export const GET: APIRoute = () => {
  const site = (process.env.SITE_URL || '').replace(/\/$/, '');
  const config = {
    backend: {
      name: 'github',
      repo: process.env.CMS_GITHUB_REPO || 'SJ2026-web/candele-sabri',
      branch: process.env.CMS_GITHUB_BRANCH || 'main',
      ...(site ? { base_url: site, auth_endpoint: 'api/auth' } : {}),
      commit_messages: {
        create: 'Pannello: crea {{collection}} “{{slug}}”', update: 'Pannello: aggiorna {{collection}} “{{slug}}”',
        delete: 'Pannello: elimina {{collection}} “{{slug}}”', uploadMedia: 'Pannello: carica “{{path}}”', deleteMedia: 'Pannello: elimina “{{path}}”',
      },
    },
    site_url: site || undefined,
    display_url: site || undefined,
    logo: { src: '/images/logo/logo-320.png' },
    publish_mode: 'simple',
    media_folder: 'public/images/sito',
    public_folder: '/images/sito',
    // Le foto caricate dal telefono vengono convertite in WebP e ridimensionate.
    media_libraries: { default: { config: { max_file_size: 20000000, transformations: { raster_image: { format: 'webp', quality: 82, width: 1600, height: 1600 } } } } },
    collections: [
      {
        name: 'prodotti', label: 'Prodotti', label_singular: 'Prodotto', icon: 'local_florist',
        description: 'Le creazioni del catalogo. “Archiviato” toglie un prodotto dal sito senza cancellarlo.',
        folder: 'src/content/prodotti', format: 'json', extension: 'json',
        create: true, delete: true, identifier_field: 'nome', slug: '{{slug}}',
        media_folder: '/public/images/prodotti', public_folder: '/images/prodotti',
        summary: '{{codice}} · {{nome}}', sortable_fields: ['nome', 'codice', 'ordine'],
        view_filters: [
          { label: 'Di Sabrina', field: 'creatrice', pattern: 'sabrina' },
          { label: 'Di Daniela', field: 'creatrice', pattern: 'daniela' },
          { label: 'Non disponibili', field: 'disponibile', pattern: false },
          { label: 'Archiviati', field: 'archiviato', pattern: true },
          { label: 'Bozze (non pubblicati)', field: 'pubblicato', pattern: false },
        ],
        view_groups: [
          { label: 'Categoria', field: 'categoria' },
          { label: 'Creatrice', field: 'creatrice' },
        ],
        fields: [
          f('nome', S('Nome della creazione', { hint: 'Es. Winter Wonderland' })),
          f('categoria', { label: 'Categoria', widget: 'select', options: categorieOpt, default: 'candele' }),
          f('creatrice', { label: 'Creatrice', widget: 'select', options: [{ label: 'Sabrina', value: 'sabrina' }, { label: 'Daniela', value: 'daniela' }], hint: 'Il pulsante WhatsApp apre la chat di questa creatrice.' }),
          f('codice', S('Codice identificativo', {
            hint: 'S = Sabrina, D = Daniela · CAN candele, TAR tart, WAX cere, REG regali · es. S-CAN-001',
            pattern: ['^[SD]-(CAN|TAR|WAX|REG)-\\d{3}$', 'Formato richiesto: S-CAN-001'],
          })),
          f('foto', {
            label: 'Fotografie', widget: 'list', required: false, label_singular: 'foto',
            hint: 'La prima foto è quella principale. Solo il prodotto, senza scritte.',
            fields: [f('immagine', { label: 'Foto', widget: 'image' }), f('alt', S('Descrizione della foto (per Google, facoltativa)', { required: false }))],
          }),
          f('profumazione', S('Profumazione', { required: false })),
          f('note', TX('Note olfattive', { required: false, hint: 'Es. Abete, pino, foglie verdi, legni e incenso.' })),
          f('peso', { label: 'Peso netto (grammi)', widget: 'number', value_type: 'int', required: false, min: 1 }),
          f('prezzo', { label: 'Prezzo (CHF)', widget: 'number', value_type: 'float', required: false, min: 0, step: 0.5, hint: 'Vuoto = “Prezzo su richiesta”' }),
          f('descrizione', TX('Descrizione (facoltativa)', { required: false })),
          f('disponibile', { label: 'Disponibile', widget: 'boolean', default: true }),
          f('nuovo', { label: 'Mostra tra le “Nuove creazioni” in homepage', widget: 'boolean', default: true, required: false }),
          f('pubblicato', { label: 'Pubblicato sul sito', widget: 'boolean', default: true, hint: 'Spento = bozza, non visibile.' }),
          f('archiviato', { label: 'Archiviato (non più in vendita)', widget: 'boolean', default: false, required: false }),
          f('avvertenze', TX('Avvertenze di sicurezza (facoltative)', { required: false, hint: 'Separate dalla descrizione. Inserire solo testi verificati con la documentazione delle fragranze.' })),
          f('ordine', { label: 'Ordine nel catalogo (numero più basso = prima)', widget: 'number', value_type: 'int', required: false }),
        ],
      },
      {
        name: 'pagine', label: 'Pagine', icon: 'description',
        files: [
          {
            name: 'home', label: 'Homepage', file: 'src/content/pagine/home.json',
            fields: [
              ...seo,
              f('frase', S('Frase principale')), f('intro', TX('Testo sotto la frase')),
              f('immagineCopertina', IMG('Immagine di copertina con alcune creazioni (facoltativa)', { media_folder: '/public/images/sito', public_folder: '/images/sito' })),
              f('categorieTitolo', S('Titolo sezione categorie')), f('nuoviTitolo', S('Titolo sezione nuove creazioni')),
              f('storiaTitolo', S('Storia – titolo')), f('storiaTesto', TX('Storia – testo breve')),
              f('instagramTitolo', S('Instagram – titolo')), f('instagramTesto', TX('Instagram – testo')),
              f('contattiTitolo', S('WhatsApp – titolo')), f('contattiTesto', TX('WhatsApp – testo')),
            ],
          },
          {
            name: 'storia', label: 'La nostra storia', file: 'src/content/pagine/storia.json',
            fields: [...seo, f('titolo', S('Titolo')), f('sottotitolo', S('Sottotitolo')), f('immagine', IMG('Foto (facoltativa)')), f('testo', TX('Testo (paragrafi separati da una riga vuota)')), f('firma', S('Firma', { required: false }))],
          },
          {
            name: 'contatti', label: 'Contatti', file: 'src/content/pagine/contatti.json',
            fields: [...seo, f('titolo', S('Titolo')), f('intro', TX('Introduzione')), f('nota', TX('Nota'))],
          },
          {
            name: 'spedizioni', label: 'Spedizioni e condizioni', file: 'src/content/legale/spedizioni.md', format: 'frontmatter',
            fields: [f('title', S('Titolo')), f('seoDescription', TX('Google – descrizione')), f('updated', { label: 'Aggiornato il', widget: 'datetime', time_format: false, format: 'YYYY-MM-DD' }), f('body', { label: 'Testo', widget: 'markdown' })],
          },
          {
            name: 'privacy', label: 'Privacy e informazioni legali', file: 'src/content/legale/privacy.md', format: 'frontmatter',
            fields: [f('title', S('Titolo')), f('seoDescription', TX('Google – descrizione')), f('updated', { label: 'Aggiornato il', widget: 'datetime', time_format: false, format: 'YYYY-MM-DD' }), f('body', { label: 'Testo', widget: 'markdown' })],
          },
        ],
      },
      {
        name: 'impostazioni', label: 'Impostazioni', icon: 'settings',
        files: [
          {
            name: 'generale', label: 'Contatti, WhatsApp e Instagram', file: 'src/content/impostazioni/generale.json',
            fields: [
              f('nomeMarchio', S('Nome del marchio')), f('sottotitolo', S('Sottotitolo')), f('regione', S('Regione')),
              f('instagram', S('Profilo Instagram (senza @)', { required: false })),
              f('email', S('Email (facoltativa)', { required: false })),
              f('creatrici', {
                label: 'Creatrici', widget: 'object',
                fields: [
                  f('sabrina', { label: 'Sabrina', widget: 'object', fields: [f('nome', S('Nome')), f('whatsapp', S('Numero WhatsApp', { required: false, hint: 'Con prefisso, es. +41 79 123 45 67. Vuoto = pulsante non attivo.' }))] }),
                  f('daniela', { label: 'Daniela', widget: 'object', fields: [f('nome', S('Nome')), f('whatsapp', S('Numero WhatsApp', { required: false, hint: 'Con prefisso, es. +41 79 123 45 67. Vuoto = pulsante non attivo.' }))] }),
                ],
              }),
              f('venditore', {
                label: 'Dati legali (pagina Privacy)', widget: 'object', collapsed: true,
                fields: [f('nomi', S('Nomi', { required: false })), f('indirizzo', S('Indirizzo', { required: false })), f('localita', S('CAP e località', { required: false })), f('email', S('Email', { required: false }))],
              }),
              f('messaggioOrdine', TX('Messaggio WhatsApp – ordine', { hint: 'Usa {nome}, {codice} e {prezzo}' })),
              f('messaggioNonDisponibile', TX('Messaggio WhatsApp – prodotto non disponibile', { hint: 'Usa {nome} e {codice}' })),
              f('messaggioContatto', TX('Messaggio WhatsApp – contatto generico')),
            ],
          },
          {
            name: 'categorie', label: 'Categorie', file: 'src/content/impostazioni/categorie.json',
            fields: [categoria('candele', 'Candele'), categoria('tart', 'Tart per armadi'), categoria('cere', 'Cere da sciogliere'), categoria('regalo', 'Confezioni regalo')],
          },
        ],
      },
    ],
  };
  return new Response(JSON.stringify(config, null, 2), { headers: { 'Content-Type': 'text/yaml; charset=utf-8' } });
};
