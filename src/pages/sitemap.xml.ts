import type { APIRoute } from 'astro';
import { categorie, prodotti, urlProdotto, storiaVisibile } from '../lib/site';

export const GET: APIRoute = ({ site }) => {
  const pagine = [
    '/', '/creazioni/', ...categorie.map((c) => `/${c.slug}/`),
    ...(storiaVisibile ? ['/la-nostra-storia/'] : []), '/contatti/', '/spedizioni-e-condizioni/', '/privacy-e-note-legali/',
    ...prodotti.filter((p) => !p.bozza).map(urlProdotto),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pagine
    .map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
