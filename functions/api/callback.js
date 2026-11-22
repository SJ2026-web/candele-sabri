// Login del pannello /admin con GitHub – passo 2: verifica l'utente autorizzato e consegna il token al pannello.
const page = (status, payload) => {
  const msg = JSON.stringify(`authorization:github:${status}:${JSON.stringify(payload)}`);
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Intrecci d’Essenze</title></head><body>
<p style="font-family:sans-serif">${status === 'success' ? 'Accesso in corso…' : 'Accesso negato.'}</p>
<script>
(function () {
  var msg = ${msg};
  function receive(e) { window.opener && window.opener.postMessage(msg, e.origin); window.removeEventListener('message', receive); setTimeout(function(){ window.close(); }, 300); }
  window.addEventListener('message', receive, false);
  if (window.opener) window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'Set-Cookie': 'cms_oauth_state=; Path=/api; Max-Age=0' } },
  );
};

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const saved = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)cms_oauth_state=([^;]+)/)?.[1];
  if (!code || !state || !saved || state !== saved) return page('error', { message: 'Stato OAuth non valido. Riprova.' });

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: env.GITHUB_OAUTH_CLIENT_ID, client_secret: env.GITHUB_OAUTH_CLIENT_SECRET, code, redirect_uri: new URL('/api/callback', url.origin).href }),
  }).then((r) => r.json()).catch(() => ({}));
  const token = res.access_token;
  if (!token) return page('error', { message: 'GitHub non ha restituito un token.' });

  // Solo gli account GitHub autorizzati possono entrare nel pannello.
  const allowed = String(env.CMS_ALLOWED_USERS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  const user = await fetch('https://api.github.com/user', { headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'intrecci-dessenze-cms' } })
    .then((r) => r.json()).catch(() => ({}));
  const login = String(user.login || '').toLowerCase();
  if (!allowed.length || !allowed.includes(login)) return page('error', { message: `Account GitHub "${user.login || '?'}" non autorizzato.` });

  return page('success', { token, provider: 'github' });
}
