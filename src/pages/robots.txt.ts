import { SITE_URL } from '../data/growth';

export async function GET() {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /preview/',
    'Disallow: /search/',
    'Disallow: /tags/',
    'Disallow: /demo/thanks/',
    'Disallow: /thanks/',
    'Disallow: /test/',
    'Disallow: /tests/',
    'Disallow: /growth/preview/',
    'Disallow: /growth/search/',
    'Disallow: /growth/demo/thanks/',
    'Disallow: /growth/lp/thanks/',
    'Disallow: /growth/test/',
    'Disallow: /growth/tests/',
    '',
    `Sitemap: ${new URL('/sitemap.xml', SITE_URL).toString()}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
