// Cloudflare Worker (module syntax)
// Paste this into a Cloudflare Worker or deploy with Wrangler. Make sure to bind a secret
// named `GITHUB_TOKEN` (the personal access token for the bot account).

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: CORS_HEADERS });
    }

    let data;
    try {
      data = await request.json();
    } catch (err) {
      return new Response('Bad JSON', { status: 400, headers: CORS_HEADERS });
    }

    const token = env.GITHUB_TOKEN;
    if (!token) {
      return new Response('Missing GITHUB_TOKEN', { status: 500, headers: CORS_HEADERS });
    }

    const {
      annotationText = '(no suggestion provided)',
      selectedText = '',
      creditName = '',
      creditLink = '',
      pageId = '',
      pagePath = ''
    } = data;

    const filePath = pagePath || (pageId ? `results/${pageId}.md` : 'results/unknown.md');

    const issueBody = [
      `**File**: \`${filePath}\``,
      '',
      `**Selected Text:**`,
      selectedText ? `> ${selectedText}` : '(none)',
      '',
      `**Suggestion:**`,
      annotationText,
      '',
      creditName ? `**Suggested by:** ${creditLink ? `[${creditName}](${creditLink})` : creditName}` : '**Suggested by:** Anonymous',
      `**Submitted:** ${new Date().toISOString()}`
    ].join('\n');

    const payload = {
      title: `Suggestion: ${pageId || filePath}`,
      body: issueBody,
      labels: ['suggestion']
    };

    try {
      const ghRes = await fetch('https://api.github.com/repos/zkdeocadiz/Tech-for-Us/issues', {
        method: 'POST',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Tech-for-Us-suggestions-bot'
        },
        body: JSON.stringify(payload)
      });

      const text = await ghRes.text();
      if (!ghRes.ok) {
        return new Response(text || 'GitHub API error', { status: 502, headers: CORS_HEADERS });
      }

      const json = JSON.parse(text);
      return new Response(JSON.stringify({ ok: true, issueUrl: json.html_url }), { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } });
    } catch (err) {
      return new Response('Error creating issue', { status: 500, headers: CORS_HEADERS });
    }
  }
};
