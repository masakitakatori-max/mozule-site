const baseUrl = (process.argv[2] || 'http://127.0.0.1:8788').replace(/\/+$/, '');

const checks = [];

const record = (name, ok, detail) => {
  checks.push({ name, ok, detail });
  const prefix = ok ? 'PASS' : 'FAIL';
  console.log(`${prefix} ${name}: ${detail}`);
};

const fetchText = async (url, init) => {
  const response = await fetch(url, init);
  const text = await response.text();
  return { response, text };
};

try {
  const root = await fetchText(`${baseUrl}/`);
  record('GET /', root.response.status === 200, `status=${root.response.status}`);

  const growth = await fetchText(`${baseUrl}/growth/`);
  record('GET /growth/', growth.response.status === 200, `status=${growth.response.status}`);

  const getContact = await fetchText(`${baseUrl}/api/contact`);
  record('GET /api/contact', getContact.response.status === 405, `status=${getContact.response.status}`);

  const formBody = new URLSearchParams({
    context: 'growth',
    name: 'Smoke Test',
    company: 'Mozule',
    email: 'masaki.takatori@mozule.co.jp',
    topic: 'delivery-test',
    targetUrl: 'https://mozule.co.jp/growth/',
    message: 'Smoke test from scripts/smoke-contact.mjs',
  });

  const postContact = await fetchText(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody,
  });

  let postJson = {};
  try {
    postJson = JSON.parse(postContact.text);
  } catch {
    postJson = { raw: postContact.text };
  }

  record(
    'POST /api/contact',
    postContact.response.status === 200 && postJson.ok === true,
    `status=${postContact.response.status} body=${JSON.stringify(postJson)}`,
  );
} catch (error) {
  record('Smoke runner', false, error instanceof Error ? error.message : String(error));
}

const failed = checks.some((check) => !check.ok);
if (failed) {
  process.exitCode = 1;
}
