// @ts-check
import { defineConfig } from 'astro/config';

// Dominio definitivo: impostare la variabile SITE_URL su Cloudflare Pages (es. https://www.intreccidessenze.ch).
// Finché non è impostata si usa l'indirizzo fornito da Cloudflare Pages oppure localhost.
const site = process.env.SITE_URL || process.env.CF_PAGES_URL || 'http://localhost:4321';

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  prefetch: { defaultStrategy: 'hover' },
  compressHTML: true,
});
