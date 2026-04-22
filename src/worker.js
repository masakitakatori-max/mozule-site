const MAX_LENGTHS = {
  name: 120,
  company: 160,
  email: 200,
  topic: 120,
  targetUrl: 300,
  message: 4000,
  context: 80,
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });

const normalize = (value, limit) => String(value || '').trim().slice(0, limit);

const getSubmission = async (request) => {
  const contentType = request.headers.get('content-type') || '';
  const values = contentType.includes('application/json')
    ? await request.json()
    : Object.fromEntries(await request.formData());

  return {
    name: normalize(values.name, MAX_LENGTHS.name),
    company: normalize(values.company, MAX_LENGTHS.company),
    email: normalize(values.email, MAX_LENGTHS.email),
    topic: normalize(values.topic, MAX_LENGTHS.topic),
    targetUrl: normalize(values.targetUrl, MAX_LENGTHS.targetUrl),
    message: normalize(values.message, MAX_LENGTHS.message),
    context: normalize(values.context, MAX_LENGTHS.context),
    website: normalize(values.website, 200),
  };
};

const validateSubmission = (submission) => {
  if (submission.website) return '送信できませんでした。';
  if (!submission.name || !submission.email || !submission.topic || !submission.message) {
    return '必須項目を入力してください。';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email)) {
    return 'メールアドレスの形式を確認してください。';
  }
  if (submission.targetUrl) {
    try {
      const url = new URL(submission.targetUrl);
      if (!['http:', 'https:'].includes(url.protocol)) return 'URLの形式を確認してください。';
    } catch {
      return 'URLの形式を確認してください。';
    }
  }
  return '';
};

const submissionText = (submission) =>
  [
    `Context: ${submission.context || '-'}`,
    `Name: ${submission.name}`,
    `Company: ${submission.company || '-'}`,
    `Email: ${submission.email}`,
    `Topic: ${submission.topic}`,
    `Target URL: ${submission.targetUrl || '-'}`,
    '',
    submission.message,
  ].join('\n');

const CONTACT_TO = 'masaki.takatori@mozule.co.jp';
const ADMIN_CONTENT_PATH = 'src/data/growthOverrides.json';
const DEFAULT_GITHUB_REPO = 'masakitakatori-max/mozule-site';
const ADMIN_MAX_LENGTHS = {
  path: 240,
  title: 90,
  description: 180,
  primaryKeyword: 80,
  lede: 420,
  indexStatus: 20,
  canonical: 240,
  notes: 1200,
};

const notifyCloudflareEmail = async (submission, env) => {
  if (!env.CONTACT_EMAIL) return false;

  await env.CONTACT_EMAIL.send({
    to: CONTACT_TO,
    from: { email: 'noreply@mozule.co.jp', name: 'Mozule Contact' },
    replyTo: submission.email,
    subject: `[Mozule] ${submission.topic} inquiry from ${submission.name}`,
    text: submissionText(submission),
  });
  return true;
};

const notifyWebhook = async (submission, env) => {
  if (!env.CONTACT_WEBHOOK_URL) return false;

  const response = await fetch(env.CONTACT_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: 'mozule.co.jp',
      submittedAt: new Date().toISOString(),
      ...submission,
    }),
  });

  if (!response.ok) {
    throw new Error(`Webhook failed: ${response.status}`);
  }

  return true;
};

const notifyResend = async (submission, env) => {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO) return false;

  const from = env.CONTACT_FROM || 'Mozule Site <noreply@mozule.co.jp>';
  const subject = `[Mozule] ${submission.topic} inquiry from ${submission.name}`;
  const text = submissionText(submission);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [env.CONTACT_TO],
      reply_to: submission.email,
      subject,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend failed: ${response.status}`);
  }

  return true;
};

const adminNormalize = (value, limit) => String(value || '').trim().slice(0, limit);

const decodeBase64Utf8 = (encoded) => {
  const binary = atob(String(encoded || '').replace(/\s/g, ''));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const encodeBase64Utf8 = (value) => {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const allowedAdminEmails = (env) =>
  String(env.ADMIN_ALLOWED_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const getAdminAuth = (request, env) => {
  const allowedEmails = allowedAdminEmails(env);
  const accessEmail = String(request.headers.get('cf-access-authenticated-user-email') || '').toLowerCase();
  const authHeader = request.headers.get('authorization') || '';
  const hasAccessPolicy = allowedEmails.length > 0;
  const hasTokenPolicy = Boolean(env.ADMIN_TOKEN);

  if (!hasAccessPolicy && !hasTokenPolicy) {
    return {
      ok: false,
      status: 503,
      message: 'Admin保存APIの認証設定が未設定です。Cloudflare AccessまたはADMIN_TOKENを設定してください。',
    };
  }

  if (hasAccessPolicy && accessEmail && allowedEmails.includes(accessEmail)) {
    return { ok: true };
  }

  if (hasTokenPolicy && authHeader === `Bearer ${env.ADMIN_TOKEN}`) {
    return { ok: true };
  }

  return { ok: false, status: 401, message: 'Admin保存APIの認証に失敗しました。' };
};

const getAdminPayload = async (request) => {
  const values = await request.json();
  return {
    path: adminNormalize(values.path, ADMIN_MAX_LENGTHS.path),
    title: adminNormalize(values.title, ADMIN_MAX_LENGTHS.title),
    description: adminNormalize(values.description, ADMIN_MAX_LENGTHS.description),
    primaryKeyword: adminNormalize(values.primaryKeyword, ADMIN_MAX_LENGTHS.primaryKeyword),
    lede: adminNormalize(values.lede, ADMIN_MAX_LENGTHS.lede),
    indexStatus: adminNormalize(values.indexStatus, ADMIN_MAX_LENGTHS.indexStatus) || 'index',
    canonical: adminNormalize(values.canonical, ADMIN_MAX_LENGTHS.canonical),
    sitemap: Boolean(values.sitemap),
    notes: adminNormalize(values.notes, ADMIN_MAX_LENGTHS.notes),
  };
};

const validateAdminPayload = (payload) => {
  if (!payload.path.startsWith('/growth/') || !payload.path.endsWith('/')) {
    return '編集対象URLは/growth/配下かつ末尾スラッシュありにしてください。';
  }
  if (!payload.title || !payload.description || !payload.primaryKeyword || !payload.lede) {
    return 'Title、description、Target KW、AIO/AEO結論ブロックは必須です。';
  }
  if (payload.indexStatus === 'noindex' && payload.sitemap) {
    return 'noindexページはsitemapに掲載できません。';
  }
  if (payload.indexStatus === 'noindex' && payload.canonical) {
    return 'noindexとcanonicalは同一ページで併用しないでください。';
  }
  if (payload.canonical && !payload.canonical.startsWith('/growth/')) {
    return 'canonicalは/growth/配下のパスで指定してください。';
  }
  return '';
};

const buildGrowthOverride = (payload) => ({
  title: payload.title,
  description: payload.description,
  primaryKeyword: payload.primaryKeyword,
  lede: payload.lede,
});

const githubJson = async (env, path, init = {}) => {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'mozule-site-admin',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(`GitHub API failed: ${response.status} ${body.message || text}`);
  }
  return body;
};

const createAdminPullRequest = async (proposal, env) => {
  const override = buildGrowthOverride(proposal);

  if (!env.GITHUB_TOKEN) {
    return {
      mode: 'dry_run',
      message: 'GITHUB_TOKENが未設定のため、PRは作成せず差分案だけ返しました。',
      override,
    };
  }

  const repo = env.GITHUB_REPO || DEFAULT_GITHUB_REPO;
  const base = env.GITHUB_BASE_BRANCH || 'master';
  const safeSlug = proposal.path.replace(/^\/|\/$/g, '').replace(/[^a-zA-Z0-9-]+/g, '-').slice(0, 70);
  const branch = `admin/seo-${safeSlug}-${Date.now()}`;

  const baseRef = await githubJson(env, `/repos/${repo}/git/ref/heads/${base}`);
  await githubJson(env, `/repos/${repo}/git/refs`, {
    method: 'POST',
    body: JSON.stringify({
      ref: `refs/heads/${branch}`,
      sha: baseRef.object.sha,
    }),
  });

  const file = await githubJson(
    env,
    `/repos/${repo}/contents/${ADMIN_CONTENT_PATH}?ref=${encodeURIComponent(base)}`
  );
  const current = JSON.parse(decodeBase64Utf8(file.content));
  current.pages = current.pages || {};
  current.pages[proposal.path] = override;

  await githubJson(env, `/repos/${repo}/contents/${ADMIN_CONTENT_PATH}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `Update SEO fields for ${proposal.path}`,
      content: encodeBase64Utf8(`${JSON.stringify(current, null, 2)}\n`),
      branch,
      sha: file.sha,
    }),
  });

  const pr = await githubJson(env, `/repos/${repo}/pulls`, {
    method: 'POST',
    body: JSON.stringify({
      title: `Update SEO fields for ${proposal.path}`,
      head: branch,
      base,
      body: [
        'SEO Control Roomから作成した変更案です。',
        '',
        `- URL: ${proposal.path}`,
        `- Target KW: ${proposal.primaryKeyword}`,
        `- Index: ${proposal.indexStatus}`,
        `- Sitemap: ${proposal.sitemap ? 'include' : 'exclude'}`,
        proposal.notes ? `- Notes: ${proposal.notes}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    }),
  });

  return {
    mode: 'pull_request',
    branch,
    prUrl: pr.html_url,
    override,
  };
};

const handleAdminProposal = async (request, env) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        Allow: 'POST, OPTIONS',
        'Cache-Control': 'no-store',
      },
    });
  }

  if (request.method !== 'POST') {
    return json({ ok: false, message: 'POSTで送信してください。' }, 405);
  }

  const auth = getAdminAuth(request, env);
  if (!auth.ok) return json({ ok: false, message: auth.message }, auth.status);

  let payload;
  try {
    payload = await getAdminPayload(request);
  } catch {
    return json({ ok: false, message: 'Admin保存リクエストのJSONを確認してください。' }, 400);
  }

  const error = validateAdminPayload(payload);
  if (error) return json({ ok: false, message: error }, 400);

  try {
    const result = await createAdminPullRequest(payload, env);
    return json({ ok: true, ...result });
  } catch (error) {
    console.error('Admin proposal failed', error);
    return json({ ok: false, message: 'GitHub PRの作成に失敗しました。Workerログを確認してください。' }, 502);
  }
};

const handleAdminAsset = async (request, env) => {
  const auth = getAdminAuth(request, env);
  if (!auth.ok) {
    return new Response(
      [
        '<!doctype html>',
        '<html lang="ja">',
        '<head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>Admin protected</title></head>',
        '<body style="font-family:system-ui,sans-serif;background:#0B0D10;color:#fff;padding:40px">',
        `<h1 style="font-size:24px">Admin is protected</h1>`,
        `<p style="color:#9ca3af;line-height:1.7">${auth.message}</p>`,
        '</body>',
        '</html>',
      ].join(''),
      {
        status: auth.status,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      }
    );
  }

  return env.ASSETS.fetch(request);
};

const handleContact = async (request, env) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        Allow: 'POST, OPTIONS',
        'Cache-Control': 'no-store',
      },
    });
  }

  if (request.method !== 'POST') {
    return json({ ok: false, message: 'POSTで送信してください。' }, 405);
  }

  let submission;
  try {
    submission = await getSubmission(request);
  } catch {
    return json({ ok: false, message: 'フォームの内容を確認してください。' }, 400);
  }

  const error = validateSubmission(submission);
  if (error) return json({ ok: false, message: error }, 400);

  try {
    const results = await Promise.allSettled([
      notifyCloudflareEmail(submission, env),
      notifyWebhook(submission, env),
      notifyResend(submission, env),
    ]);
    const sent = results.some((result) => result.status === 'fulfilled' && result.value);
    const failures = results.filter((result) => result.status === 'rejected');

    failures.forEach((result) => {
      console.error('Contact form notification failed', result.reason);
    });

    if (!sent && failures.length) {
      return json({ ok: false, message: '送信に失敗しました。時間をおいて再度お試しください。' }, 502);
    }

    if (!sent) {
      return json({ ok: false, message: 'お問い合わせフォームの送信先が未設定です。' }, 503);
    }

    return json({ ok: true });
  } catch (error) {
    console.error('Contact form notification failed', error);
    return json({ ok: false, message: '送信に失敗しました。時間をおいて再度お試しください。' }, 502);
  }
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
      return handleAdminAsset(request, env);
    }

    if (url.pathname === '/api/contact') {
      return handleContact(request, env);
    }

    if (url.pathname === '/api/admin/proposals') {
      return handleAdminProposal(request, env);
    }

    if (url.pathname === '/growth/solution/' || url.pathname === '/growth/solution/index.html') {
      return Response.redirect(new URL('/growth/', request.url), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
