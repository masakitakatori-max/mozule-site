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
    const sentToCloudflareEmail = await notifyCloudflareEmail(submission, env);
    const sentToWebhook = await notifyWebhook(submission, env);
    const sentToResend = await notifyResend(submission, env);

    if (!sentToCloudflareEmail && !sentToWebhook && !sentToResend) {
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

    if (url.pathname === '/api/contact') {
      return handleContact(request, env);
    }

    if (url.pathname === '/growth/solution/' || url.pathname === '/growth/solution/index.html') {
      return Response.redirect(new URL('/growth/', request.url), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
