const MAX_LENGTHS = {
  name: 120,
  company: 160,
  email: 200,
  topic: 120,
  targetUrl: 300,
  message: 4000,
  context: 80,
};

const normalize = (value, limit) => String(value || '').trim().slice(0, limit);

const parseBody = async (request) => {
  if (request.body && typeof request.body === 'object') return request.body;

  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  const contentType = request.headers['content-type'] || '';

  if (contentType.includes('application/json')) return JSON.parse(raw || '{}');
  return Object.fromEntries(new URLSearchParams(raw));
};

const getSubmission = async (request) => {
  const values = await parseBody(request);

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

const notifyWebhook = async (submission) => {
  if (!process.env.CONTACT_WEBHOOK_URL) return false;

  const response = await fetch(process.env.CONTACT_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: 'mozule.co.jp',
      submittedAt: new Date().toISOString(),
      ...submission,
    }),
  });

  if (!response.ok) throw new Error(`Webhook failed: ${response.status}`);
  return true;
};

const notifyResend = async (submission) => {
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO) return false;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || 'Mozule Site <noreply@mozule.co.jp>',
      to: [process.env.CONTACT_TO],
      reply_to: submission.email,
      subject: `[Mozule] ${submission.topic} inquiry from ${submission.name}`,
      text: submissionText(submission),
    }),
  });

  if (!response.ok) throw new Error(`Resend failed: ${response.status}`);
  return true;
};

export default async function handler(request, response) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');

  if (request.method !== 'POST') {
    response.status(405).json({ ok: false, message: 'POSTで送信してください。' });
    return;
  }

  let submission;
  try {
    submission = await getSubmission(request);
  } catch {
    response.status(400).json({ ok: false, message: 'フォームの内容を確認してください。' });
    return;
  }

  const error = validateSubmission(submission);
  if (error) {
    response.status(400).json({ ok: false, message: error });
    return;
  }

  try {
    const sentToWebhook = await notifyWebhook(submission);
    const sentToResend = await notifyResend(submission);

    if (!sentToWebhook && !sentToResend) {
      response.status(503).json({ ok: false, message: 'お問い合わせフォームの送信先が未設定です。' });
      return;
    }

    response.status(200).json({ ok: true });
  } catch {
    response.status(502).json({ ok: false, message: '送信に失敗しました。時間をおいて再度お試しください。' });
  }
}
