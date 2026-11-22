// Dati del sito: prodotti, impostazioni, categorie e funzioni di supporto.
// Tutti i contenuti vivono in src/content e si modificano dal pannello /admin.
import generale from '../content/impostazioni/generale.json';
import categorieTesti from '../content/impostazioni/categorie.json';

export const settings = generale;

/** Con ANTEPRIMA=1 i prodotti non ancora pubblicati compaiono con l’etichetta “Bozza”. */
export const ANTEPRIMA = process.env.ANTEPRIMA === '1';

export type CategoriaId = 'candele' | 'tart' | 'cere' | 'regalo';
export type CreatriceId = 'sabrina' | 'daniela';

export interface Categoria {
  id: CategoriaId;
  slug: string;
  titolo: string;
  breve: string;
  singolare: string;
  intro: string;
  immagine: string;
  sigla: string;
}

const base: Record<CategoriaId, Omit<Categoria, 'titolo' | 'intro' | 'immagine'>> = {
  candele: { id: 'candele', slug: 'candele', breve: 'Candele', singolare: 'Candela', sigla: 'CAN' },
  tart: { id: 'tart', slug: 'tart-per-armadi', breve: 'Tart per armadi', singolare: 'Tart per armadi', sigla: 'TAR' },
  cere: { id: 'cere', slug: 'cere-da-sciogliere', breve: 'Cere da sciogliere', singolare: 'Cera da sciogliere', sigla: 'WAX' },
  regalo: { id: 'regalo', slug: 'confezioni-regalo', breve: 'Confezioni regalo', singolare: 'Confezione regalo', sigla: 'REG' },
};

export const categorie: Categoria[] = (Object.keys(base) as CategoriaId[]).map((id) => {
  const t = (categorieTesti as Record<string, { titolo: string; intro: string; immagine: string }>)[id];
  return { ...base[id], titolo: t?.titolo || base[id].breve, intro: t?.intro || '', immagine: t?.immagine || '' };
});

export const categoriaById = (id: string) => categorie.find((c) => c.id === id);

export interface Prodotto {
  slug: string;
  nome: string;
  categoria: CategoriaId;
  creatrice: CreatriceId;
  codice: string;
  profumazione: string;
  note: string;
  peso: number | null;
  prezzo: number | null;
  descrizione: string;
  foto: { immagine: string; alt?: string }[];
  disponibile: boolean;
  nuovo: boolean;
  pubblicato: boolean;
  archiviato: boolean;
  avvertenze: string;
  ordine: number | null;
  bozza: boolean;
}

const files = import.meta.glob<{ default: any }>('../content/prodotti/*.json', { eager: true });

const tutti: Prodotto[] = Object.entries(files).map(([path, mod]) => {
  const d = mod.default || {};
  const slug = path.split('/').pop()!.replace(/\.json$/, '');
  const num = (v: unknown) => (v === null || v === undefined || v === '' || Number.isNaN(Number(v)) ? null : Number(v));
  return {
    slug,
    nome: String(d.nome || slug),
    categoria: (d.categoria || 'candele') as CategoriaId,
    creatrice: (d.creatrice || 'sabrina') as CreatriceId,
    codice: String(d.codice || ''),
    profumazione: String(d.profumazione || ''),
    note: String(d.note || ''),
    peso: num(d.peso),
    prezzo: num(d.prezzo),
    descrizione: String(d.descrizione || ''),
    foto: (Array.isArray(d.foto) ? d.foto : []).filter((f: any) => f && f.immagine),
    disponibile: d.disponibile !== false,
    nuovo: !!d.nuovo,
    pubblicato: d.pubblicato !== false,
    archiviato: !!d.archiviato,
    avvertenze: String(d.avvertenze || ''),
    ordine: num(d.ordine),
    bozza: d.pubblicato === false,
  };
});

/** Prodotti visibili sul sito: pubblicati e non archiviati (in anteprima anche le bozze). */
export const prodotti: Prodotto[] = tutti
  .filter((p) => !p.archiviato && (p.pubblicato || ANTEPRIMA) && categoriaById(p.categoria))
  .sort((a, b) => (a.ordine ?? 9999) - (b.ordine ?? 9999) || a.nome.localeCompare(b.nome, 'it'));

export const prodottiDi = (cat: CategoriaId) => prodotti.filter((p) => p.categoria === cat);

export const urlProdotto = (p: Prodotto) => `/${categoriaById(p.categoria)!.slug}/${p.slug}/`;

export const formatPrezzo = (v: number | null) =>
  v === null ? 'Prezzo su richiesta' : `CHF ${v.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const nomeCreatrice = (id: CreatriceId) => settings.creatrici[id]?.nome || id;

const soloCifre = (n: string) => {
  let d = (n || '').replace(/[^\d+]/g, '');
  if (d.startsWith('+')) d = d.slice(1);
  else if (d.startsWith('00')) d = d.slice(2);
  else if (d.startsWith('0')) d = '41' + d.slice(1); // numero svizzero scritto come 079…
  return d.replace(/\D/g, '');
};

export const numeroWhatsApp = (id: CreatriceId) => soloCifre(settings.creatrici[id]?.whatsapp || '');

export const linkWhatsApp = (id: CreatriceId, testo: string) => {
  const n = numeroWhatsApp(id);
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(testo)}` : '';
};

export const messaggioOrdine = (p: Prodotto) => {
  const modello = p.disponibile ? settings.messaggioOrdine : settings.messaggioNonDisponibile;
  return modello
    .replace('{nome}', p.nome)
    .replace('{codice}', p.codice || '—')
    .replace('{prezzo}', p.prezzo === null ? '' : `, al prezzo di ${formatPrezzo(p.prezzo)}`);
};

export const instagramUrl = settings.instagram ? `https://www.instagram.com/${settings.instagram.replace(/^@/, '')}/` : '';
