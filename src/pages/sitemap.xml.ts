import { SITE_URL, indexableRoutes } from '../data/growth';

const lastmod = '2026-04-22';

export async function GET() {
  const urls = [...new Set(indexableRoutes)]
    .sort()
    .map((path) => {
      const loc = new URL(path, SITE_URL).toString();
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    }
  );
}

