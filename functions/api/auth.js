// Login del pannello /admin con GitHub – passo 1: reindirizza a GitHub.
// Cloudflare Pages → Settings → Variables: GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_CLIENT_SECRET, CMS_ALLOWED_USERS
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  if (!env.GITHUB_OAUTH_CLIENT_ID) return new Response('Login del pannello non configurato: manca GITHUB_OAUTH_CLIENT_ID.', { status: 503 });
  const state = crypto.randomUUID();
  const gh = new URL('https://github.com/login/oauth/authorize');
  gh.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID);
  gh.searchParams.set('redirect_uri', new URL('/api/callback', url.origin).href);
  gh.searchParams.set('scope', url.searchParams.get('scope') || 'repo,user');
  gh.searchParams.set('state', state);
  return new Response(null, {
    status: 302,
    headers: {
      Location: gh.href,
      'Set-Cookie': `cms_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      'Cache-Control': 'no-store',
    },
  });
}
