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
  sections: GrowthPage['sections'];
  sectionCount: number;
  score: number;
  tasks: AdminSeoAction[];
};

export type AdminTopicNodeType = 'pillar' | 'commercial' | 'learn' | 'compare' | 'integration' | 'trust';

export type AdminTopicClusterNode = {
  id: string;
  path: string;
  label: string;
  keyword: string;
  type: AdminTopicNodeType;
  score: number;
  radius: number;
  x: number;
  y: number;
};

export type AdminTopicClusterEdge = {
  source: string;
  target: string;
  kind: 'pillar' | 'related';
};

export type AdminTopicCluster = {
  id: string;
  label: string;
  intent: string;
  pillarPath: string;
  pillarLabel: string;
  nodeCount: number;
  edgeCount: number;
  averageScore: number;
  gaps: string[];
  nodes: AdminTopicClusterNode[];
  edges: AdminTopicClusterEdge[];
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
  sections: page.sections,
  sectionCount: page.sections.length,
  score: scorePage(page),
  tasks: pageTasks(page),
}));

const clusterDefinitions = [
  {
    id: 'growth-agent',
    label: 'AIグロースエージェント',
    intent: 'Product Growth Agent / AIグロースエージェントの総合導入検討を受ける',
    pillarPath: '/growth/ai-growth-agent/',
    include: [
      '/growth/ai-growth-agent/',
      '/growth/lp-optimization-ai/',
      '/growth/sample-report/',
      '/growth/pricing/',
      '/growth/methodology/',
      '/growth/case-studies/',
      '/growth/security/',
      '/growth/learn/growth/',
    ],
  },
  {
    id: 'seo-automation',
    label: 'SEO自動化',
    intent: 'SEO自動化、GSC改善、スタートアップSEOの比較検討を受ける',
    pillarPath: '/growth/seo-automation/',
    include: [
      '/growth/seo-automation/',
      '/growth/gsc-automation/',
      '/growth/startup-seo/',
      '/growth/compare/ai-seo-tools/',
      '/growth/compare/seo-automation-tools/',
      '/growth/integrations/google-search-console/',
      '/growth/integrations/google-analytics-4/',
      '/growth/learn/seo/',
      '/growth/learn/startup-seo/',
    ],
  },
  {
    id: 'aeo',
    label: 'AEO / LLMO',
    intent: 'AEO対策、AI Overview引用、LLMOの理解から導入まで受ける',
    pillarPath: '/growth/aeo/',
    include: ['/growth/aeo/', '/growth/compare/aeo-tools/', '/growth/learn/aeo/'],
  },
  {
    id: 'mcp-github',
    label: 'MCP / GitHub連携',
    intent: 'MCP、GitHub連携、Search Console MCPの技術検討を受ける',
    pillarPath: '/growth/mcp-github/',
    include: ['/growth/mcp-github/', '/growth/integrations/github/', '/growth/learn/mcp/'],
  },
  {
    id: 'integrations',
    label: '導入・連携',
    intent: 'GitHub、GSC、GA4、Cloudflare/Vercelなどの連携可否を確認する',
    pillarPath: '/growth/integrations/',
    include: ['/growth/integrations/'],
  },
] as const;

const normalizePath = (href: string) => {
  let rawPath = href.split('#')[0].split('?')[0];
  if (href.startsWith('http')) {
    try {
      rawPath = new URL(href).pathname;
    } catch {
      return '';
    }
  }
  if (!rawPath.startsWith('/growth/')) return '';
  return rawPath.endsWith('/') ? rawPath : `${rawPath}/`;
};

const pageType = (page: AdminSeoPage, pillarPath: string): AdminTopicNodeType => {
  if (page.path === pillarPath) return 'pillar';
  if (page.path.includes('/learn/')) return 'learn';
  if (page.path.includes('/compare/')) return 'compare';
  if (page.path.includes('/integrations/')) return 'integration';
  if (['/growth/sample-report/', '/growth/security/', '/growth/pricing/', '/growth/methodology/', '/growth/case-studies/'].includes(page.path)) {
    return 'trust';
  }
  return 'commercial';
};

const branchIncludes = new Set([
  '/growth/integrations/',
  '/growth/learn/aeo/',
  '/growth/learn/growth/',
  '/growth/learn/mcp/',
  '/growth/learn/seo/',
  '/growth/learn/startup-seo/',
]);

const clusterPages = (include: readonly string[]) =>
  adminSeoPages.filter((page) =>
    include.some((target) => page.path === target || (branchIncludes.has(target) && page.path.startsWith(target)))
  );

const nodePosition = (index: number, total: number, type: AdminTopicNodeType) => {
  if (type === 'pillar') return { x: 50, y: 50 };
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / Math.max(total, 1);
  const ring = type === 'commercial' || type === 'trust' ? 31 : 41;
  return {
    x: Math.round((50 + Math.cos(angle) * ring) * 10) / 10,
    y: Math.round((50 + Math.sin(angle) * ring * 0.72) * 10) / 10,
  };
};

const clusterGaps = (nodes: AdminTopicClusterNode[], edges: AdminTopicClusterEdge[]) => {
  const gaps: string[] = [];
  const learnCount = nodes.filter((node) => node.type === 'learn').length;
  const compareCount = nodes.filter((node) => node.type === 'compare').length;
  const integrationCount = nodes.filter((node) => node.type === 'integration').length;
  const lowScoreCount = nodes.filter((node) => node.score < 82).length;
  const relatedEdgeCount = edges.filter((edge) => edge.kind === 'related').length;

  if (learnCount < 3) gaps.push('支援記事が薄い。learn記事を2-3本追加するとピラーの文脈が強くなる。');
  if (compareCount === 0) gaps.push('比較記事がない。検討後期KWの受け皿を追加する。');
  if (integrationCount === 0) gaps.push('導入・連携ページがない。実装可否を確認する検索意図に弱い。');
  if (relatedEdgeCount < nodes.length - 1) gaps.push('関連リンクが少ない。本文中アンカーで双方向リンクを増やす。');
  if (lowScoreCount > 0) gaps.push(`${lowScoreCount}ページが優先改善対象。Title/FAQ/AEO結論ブロックから直す。`);

  return gaps.length ? gaps : ['現状のクラスター骨格は良好。次はSearch Console実績で枝葉KWを増やす。'];
};

export const adminTopicClusters: AdminTopicCluster[] = clusterDefinitions.map((definition) => {
  const pages = clusterPages(definition.include);
  const pageMap = new Map(pages.map((page) => [page.path, page]));
  const nonPillarCount = Math.max(pages.length - 1, 1);
  let nonPillarIndex = 0;
  const nodes = pages.map((page) => {
    const type = pageType(page, definition.pillarPath);
    const position = nodePosition(type === 'pillar' ? 0 : nonPillarIndex++, nonPillarCount, type);
    return {
      id: page.path,
      path: page.path,
      label: page.title,
      keyword: page.primaryKeyword,
      type,
      score: page.score,
      radius: type === 'pillar' ? 7.5 : type === 'commercial' ? 5.6 : 4.6,
      ...position,
    };
  });

  const edges = new Map<string, AdminTopicClusterEdge>();
  pages.forEach((page) => {
    if (page.path !== definition.pillarPath && pageMap.has(definition.pillarPath)) {
      edges.set(`${definition.pillarPath}->${page.path}`, {
        source: definition.pillarPath,
        target: page.path,
        kind: 'pillar',
      });
    }

    page.related.forEach((link) => {
      const target = normalizePath(link.href);
      if (!target || target === page.path || !pageMap.has(target)) return;
      edges.set(`${page.path}->${target}`, {
        source: page.path,
        target,
        kind: 'related',
      });
    });
  });

  const edgeList = [...edges.values()];
  const pillar = pageMap.get(definition.pillarPath) ?? pages[0];
  return {
    id: definition.id,
    label: definition.label,
    intent: definition.intent,
    pillarPath: definition.pillarPath,
    pillarLabel: pillar?.title ?? definition.label,
    nodeCount: nodes.length,
    edgeCount: edgeList.length,
    averageScore: Math.round(nodes.reduce((sum, node) => sum + node.score, 0) / Math.max(nodes.length, 1)),
    gaps: clusterGaps(nodes, edgeList),
    nodes,
    edges: edgeList,
  };
});

export const adminSeoSummary = {
  pageCount: adminSeoPages.length,
  highPriorityCount: adminSeoPages.filter((page) => page.score < 82).length,
  articleCount: adminSeoPages.filter((page) => page.schemaType === 'Article').length,
  clusterCount: adminTopicClusters.length,
  averageScore: Math.round(adminSeoPages.reduce((sum, page) => sum + page.score, 0) / adminSeoPages.length),
};
