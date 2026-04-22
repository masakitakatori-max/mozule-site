import { allGrowthPages, type GrowthPage } from './growth';

export type SeoActionCategory =
  | 'KW/THP'
  | 'AIO/AEO'
  | 'E-E-A-T'
  | 'Internal link'
  | 'Structured data'
  | 'Indexing'
  | 'UX';

export type AdminSeoAction = {
  id: string;
  category: SeoActionCategory;
  label: string;
  oneClick: string;
  impact: 'High' | 'Medium' | 'Low';
  effort: '1 click' | 'Input' | 'Review';
  source: string;
};

export type AdminSeoPage = {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  lede: string;
  primaryKeyword: string;
  schemaType: GrowthPage['schemaType'];
  faqCount: number;
  relatedCount: number;
  related: { label: string; href: string }[];
  sectionCount: number;
  score: number;
  tasks: AdminSeoAction[];
};

export const seoActionLibrary: AdminSeoAction[] = [
  {
    id: 'title-intent',
    category: 'KW/THP',
    label: '検索意図に沿ったTitleへ磨く',
    oneClick: 'Title案を3つ生成',
    impact: 'High',
    effort: 'Review',
    source: 'KW・THPまとめ',
  },
  {
    id: 'description-ctr',
    category: 'KW/THP',
    label: 'descriptionをCTR向けに整える',
    oneClick: '60-90字の説明文を生成',
    impact: 'Medium',
    effort: 'Review',
    source: 'KW・THPまとめ / UXまとめ',
  },
  {
    id: 'snippet-answer',
    category: 'KW/THP',
    label: '強調スニペット向けの短い回答を置く',
    oneClick: '120-150字の回答を追加',
    impact: 'Medium',
    effort: '1 click',
    source: 'KW・THPまとめ',
  },
  {
    id: 'aio-summary',
    category: 'AIO/AEO',
    label: 'AIO引用向けの結論ブロックを作る',
    oneClick: '150-200字の結論を追加',
    impact: 'High',
    effort: '1 click',
    source: 'AIOまとめ',
  },
  {
    id: 'faq-aeo',
    category: 'AIO/AEO',
    label: 'FAQを3-5件に増やす',
    oneClick: 'FAQ候補を生成',
    impact: 'High',
    effort: 'Review',
    source: 'AIOまとめ / 構造化データマークアップまとめ',
  },
  {
    id: 'author-proof',
    category: 'E-E-A-T',
    label: '著者/監修者と根拠を明示する',
    oneClick: 'プロフィール・出典ブロックを追加',
    impact: 'High',
    effort: 'Input',
    source: 'E-E-A-Tまとめ',
  },
  {
    id: 'freshness',
    category: 'E-E-A-T',
    label: '最新性を示す',
    oneClick: '最終更新日と更新理由を追加',
    impact: 'Medium',
    effort: '1 click',
    source: 'E-E-A-Tまとめ',
  },
  {
    id: 'context-links',
    category: 'Internal link',
    label: '文脈に沿ったアンカーリンクを追加する',
    oneClick: '関連ページから候補を出す',
    impact: 'High',
    effort: 'Review',
    source: '内部リンクまとめ',
  },
  {
    id: 'three-click',
    category: 'Internal link',
    label: '3クリック以内の導線に入れる',
    oneClick: 'ピラー/枝葉接続を提案',
    impact: 'Medium',
    effort: 'Review',
    source: '内部リンクまとめ',
  },
  {
    id: 'article-schema',
    category: 'Structured data',
    label: 'Article/FAQ/Breadcrumbを検証する',
    oneClick: 'JSON-LDを再生成',
    impact: 'Medium',
    effort: '1 click',
    source: '構造化データマークアップまとめ',
  },
  {
    id: 'service-schema',
    category: 'Structured data',
    label: 'Service/SoftwareApplicationを検証する',
    oneClick: '事業ページschemaを再生成',
    impact: 'Medium',
    effort: '1 click',
    source: '構造化データマークアップまとめ',
  },
  {
    id: 'index-safety',
    category: 'Indexing',
    label: 'noindex/canonical/sitemapの矛盾を防ぐ',
    oneClick: '安全チェックを実行',
    impact: 'High',
    effort: '1 click',
    source: 'ネガティブ要素まとめ / メディアサイト施策+基礎施策攻略',
  },
  {
    id: 'ux-intent',
    category: 'UX',
    label: 'Title・description・本文の一貫性を確認する',
    oneClick: '検索意図チェックを実行',
    impact: 'Medium',
    effort: 'Review',
    source: 'UXまとめ',
  },
];

const taskById = new Map(seoActionLibrary.map((action) => [action.id, action]));

const requireTask = (id: string) => {
  const task = taskById.get(id);
  if (!task) throw new Error(`Missing SEO action: ${id}`);
  return task;
};

const scorePage = (page: GrowthPage) => {
  let score = 100;
  if (page.title.length < 12 || page.title.length > 36) score -= 8;
  if (page.description.length < 60 || page.description.length > 120) score -= 10;
  if (page.faq.length < 3) score -= 12;
  if (page.related.length < 3) score -= 8;
  if (page.sections.length < 2) score -= 8;
  if (page.lede.length < 90 || page.lede.length > 220) score -= 7;
  if (page.schemaType === 'Article' && !page.path.includes('/learn/')) score -= 6;
  return Math.max(48, score);
};

const pageTasks = (page: GrowthPage): AdminSeoAction[] => {
  const tasks = ['title-intent', 'description-ctr', 'aio-summary', 'context-links', 'index-safety'];

  if (page.faq.length < 3) tasks.splice(3, 0, 'faq-aeo');
  if (page.schemaType === 'Article') tasks.push('article-schema', 'author-proof', 'freshness');
  if (page.schemaType !== 'Article') tasks.push('service-schema');
  if (page.related.length < 3) tasks.push('three-click');
  tasks.push('ux-intent');

  return [...new Set(tasks)].map(requireTask);
};

export const adminSeoPages: AdminSeoPage[] = allGrowthPages.map((page) => ({
  slug: page.slug,
  path: page.path,
  title: page.title,
  description: page.description,
  h1: page.h1,
  lede: page.lede,
  primaryKeyword: page.primaryKeyword,
  schemaType: page.schemaType,
  faqCount: page.faq.length,
  relatedCount: page.related.length,
  related: page.related.map((link) => ({ label: link.label, href: link.href })),
  sectionCount: page.sections.length,
  score: scorePage(page),
  tasks: pageTasks(page),
}));

export const adminSeoSummary = {
  pageCount: adminSeoPages.length,
  highPriorityCount: adminSeoPages.filter((page) => page.score < 82).length,
  articleCount: adminSeoPages.filter((page) => page.schemaType === 'Article').length,
  averageScore: Math.round(adminSeoPages.reduce((sum, page) => sum + page.score, 0) / adminSeoPages.length),
};
