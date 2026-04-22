export const SITE_URL = 'https://mozule.co.jp';
export const GROWTH_ROOT = '/growth/';

export type LinkItem = {
  label: string;
  href: string;
  description?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ContentSection = {
  title: string;
  body: string;
  items?: string[];
};

export type Comparison = {
  title: string;
  headers: [string, string, string];
  rows: [string, string, string][];
};

export type WorkflowStep = {
  label: string;
  title: string;
  body: string;
};

export type GrowthPage = {
  slug: string;
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  lede: string;
  primaryKeyword: string;
  ctaLabel: string;
  ctaHref: string;
  schemaType: 'Service' | 'SoftwareApplication' | 'Article';
  sections: ContentSection[];
  comparison?: Comparison;
  workflow?: WorkflowStep[];
  faq: FaqItem[];
  related: LinkItem[];
};

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();

export const organizationJson = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '株式会社Mozule',
  url: SITE_URL,
  address: {
    '@type': 'PostalAddress',
    addressRegion: '東京都',
    addressLocality: '目黒区',
    streetAddress: '自由が丘２丁目１６番１２号 ＲＪ３',
    addressCountry: 'JP',
  },
  founder: [
    { '@type': 'Person', name: '梅本誠也', jobTitle: 'CEO / CTO' },
    { '@type': 'Person', name: '澤重利樹', jobTitle: 'COO' },
    { '@type': 'Person', name: '高取將來', jobTitle: 'CMO / CSO' },
  ],
};

export const growthSoftwareJson = (path = GROWTH_ROOT) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'mozule growth',
  alternateName: 'Product Growth Agent',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  inLanguage: 'ja-JP',
  url: absoluteUrl(path),
  description:
    'mozule growthは、SEO/AEOの機会検知から改善提案、GitHub PR、効果監視までを閉じるAIグロースエージェントです。',
  publisher: {
    '@type': 'Organization',
    name: '株式会社Mozule',
    url: SITE_URL,
  },
});

export const faqJson = (faqs: FaqItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const breadcrumbJson = (items: LinkItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: absoluteUrl(item.href),
  })),
});

const commonWorkflow: WorkflowStep[] = [
  {
    label: 'Signal',
    title: '改善機会を検知',
    body: 'GSC、GA4、検索順位、AI Visibilityの変化から、今テコ入れすべきページと論点を抽出します。',
  },
  {
    label: 'Decide',
    title: '施策案を選ぶ',
    body: 'AIが改善案、想定インパクト、リスクを整理し、人間は承認すべき施策を選びます。',
  },
  {
    label: 'Ship',
    title: 'PRとして実装',
    body: 'MCP/GitHub連携で、コピー、構造化データ、内部リンク、LP改善をPR化します。',
  },
  {
    label: 'Learn',
    title: '結果を見て次を出す',
    body: '公開後の指標を追い、伸びた施策は深掘りし、弱い施策は戻すか次の仮説へ切り替えます。',
  },
];

export const growthHomeFaq: FaqItem[] = [
  {
    question: 'mozule growthはAI記事生成ツールですか？',
    answer:
      'いいえ。記事生成だけでなく、SEO/AEOの機会検知、改善案、GitHub PR、効果監視までを閉じるAIグロースエージェントです。',
  },
  {
    question: 'シード期の会社でも使えますか？',
    answer:
      'シード期、プレシリーズA、少人数のB2B SaaSを主対象にしています。専任グロース人材を採用する前の検証回数を増やす用途に向いています。',
  },
  {
    question: '本番コードを勝手に変更しますか？',
    answer:
      '原則としてPR単位で人間承認を挟む設計です。権限、監査ログ、rollback方針は導入時に確認します。',
  },
];

export const commercialPages: GrowthPage[] = [
  {
    slug: 'seo-automation',
    path: '/growth/seo-automation/',
    title: 'SEO自動化ツールPGA',
    description:
      'SEO自動化ツールとして、GSC分析、AEO改善、構造化データ、内部リンク、GitHub PR、効果監視までをAIが支援します。',
    eyebrow: 'SEO Automation',
    h1: 'SEO自動化ツールPGA',
    lede:
      'SEO自動化ツールに必要なのは、記事を作ることだけではありません。mozule growthは、GSCのSignalを読み、改善案を選び、GitHub PRとしてShipし、公開後のLearnまで回します。',
    primaryKeyword: 'SEO 自動化ツール',
    ctaLabel: '自社サイトのSEO改善案を見る',
    ctaHref: '/growth/sample-report/',
    schemaType: 'SoftwareApplication',
    sections: [
      {
        title: '記事生成だけで止めない',
        body:
          'SEOの成果を止めるのは、記事不足だけではありません。改善優先順位、title修正、内部リンク、構造化データ、LPの訴求修正が実装待ちになることです。',
        items: ['GSCから低CTR/順位下落/表示増クリック低を検知', '改善案をリスクと工数つきで提示', '承認後にPRとして反映'],
      },
      {
        title: 'AEOまで同じ運用で見る',
        body:
          'AI OverviewやLLM回答で引用されるには、E-E-A-T、FAQ、構造化データ、明確な結論が必要です。PGAはSEO改善をAEOにも効く構造で出します。',
      },
    ],
    comparison: {
      title: 'SEO自動化で比較すべき軸',
      headers: ['比較軸', '一般的なAI記事生成', 'mozule growth'],
      rows: [
        ['機会検知', '人間がGSCを確認', 'AIが改善候補を抽出'],
        ['実装', '原稿納品で止まる', 'GitHub PRまで進む'],
        ['AEO対応', '記事構成中心', 'FAQ/構造化データ/引用性まで見る'],
        ['検証', '公開後は別運用', 'Learnで次の施策へつなぐ'],
      ],
    },
    workflow: commonWorkflow,
    faq: [
      {
        question: 'AI SEOツールとの違いは何ですか？',
        answer: 'SEO記事の生成だけでなく、改善機会の検知、実装PR、公開後の効果監視までを扱う点です。',
      },
      {
        question: '既存CMSでも使えますか？',
        answer: '静的サイト、GitHub運用、Vercel/Cloudflare/WordPressなど、導入環境に合わせてPoCします。',
      },
      {
        question: 'どの指標を見ますか？',
        answer: '表示回数、CTR、平均掲載順位、インデックス状況、CV導線、AI Visibilityを見ます。',
      },
    ],
    related: [
      { label: 'AI SEOツール比較', href: '/growth/compare/ai-seo-tools/' },
      { label: 'SEOリライト優先順位', href: '/growth/learn/seo/seo-rewrite-priority/' },
      { label: 'GSC改善自動化', href: '/growth/gsc-automation/' },
    ],
  },
  {
    slug: 'aeo',
    path: '/growth/aeo/',
    title: 'AEO対策をAIで自動化',
    description:
      'AEO対策、AI Overview引用、AI Visibility改善を、SEO基礎施策と構造化データ、FAQ、内部リンクまで含めて支援します。',
    eyebrow: 'AEO / AI Visibility',
    h1: 'AEO対策をAIで自動化',
    lede:
      'AEO対策はSEOと別物ではありません。mozule growthは、AIが理解しやすい結論、FAQ、構造化データ、E-E-A-T、内部リンクを整え、AI検索で見つかる状態を作ります。',
    primaryKeyword: 'AEO対策',
    ctaLabel: 'AI Visibility診断を受ける',
    ctaHref: '/growth/sample-report/',
    schemaType: 'Service',
    sections: [
      {
        title: 'AIに引用される形へ整える',
        body:
          'AIOやLLM回答は、明確な定義、短い結論、表、FAQ、信頼できる著者情報を読み取りやすく評価します。PGAはページの構造から整えます。',
        items: ['冒頭150-200字の結論', 'FAQPageとArticle構造化データ', '関連ページとのトピッククラスター'],
      },
      {
        title: 'AI Visibilityを定点観測する',
        body:
          'AEOは公開して終わりではありません。重要クエリでAI回答にブランドやURLが出るかを観測し、足りない情報を次の改善にします。',
      },
    ],
    comparison: {
      title: 'AEO対策で見るべき差分',
      headers: ['項目', '従来SEO', 'mozule growth'],
      rows: [
        ['狙い', '検索順位とクリック', 'AI回答内の引用と推奨も追う'],
        ['実装', '記事単位の修正', 'FAQ/Schema/内部リンクまでPR化'],
        ['評価', 'GSC中心', 'GSC + AI回答の定点観測'],
      ],
    },
    workflow: commonWorkflow,
    faq: [
      {
        question: 'AEOとSEOの違いは何ですか？',
        answer: 'AEOはAI回答で発見、理解、引用、推奨されるための実務です。SEOの基礎を土台に、AIが読みやすい構造へ整えます。',
      },
      {
        question: 'AI Overviewに必ず引用されますか？',
        answer: '保証はできません。ただし、引用されやすい結論、信頼情報、FAQ、構造化データ、内部リンクを整備します。',
      },
      {
        question: 'どのAIを観測しますか？',
        answer: 'Google AI Overview、ChatGPT、Gemini、Perplexityなど、事業上重要な回答面を定点観測します。',
      },
    ],
    related: [
      { label: 'AEOとは', href: '/growth/learn/aeo/what-is-aeo/' },
      { label: 'AI Overviewに引用されるには', href: '/growth/learn/aeo/ai-overview-citation/' },
      { label: 'AEOツール比較', href: '/growth/compare/aeo-tools/' },
    ],
  },
  {
    slug: 'ai-growth-agent',
    path: '/growth/ai-growth-agent/',
    title: 'AIグロースエージェント',
    description:
      'AIグロースエージェントとして、分析、意思決定、実装、検証を一体化し、シード期の検証回数を増やします。',
    eyebrow: 'Category',
    h1: 'AIグロースエージェント',
    lede:
      'AIグロースエージェントは、分析ダッシュボードでも記事生成ツールでもありません。Signalを見つけ、施策を選び、PRとしてShipし、結果から次の仮説へ進む仕組みです。',
    primaryKeyword: 'AIグロースエージェント',
    ctaLabel: 'PGAデモを見る',
    ctaHref: '/growth/#contact',
    schemaType: 'SoftwareApplication',
    sections: [
      {
        title: '4%の指示で64点の実装へ',
        body:
          'CxOがゼロから調査し、依頼し、レビューし、デプロイする作業を分解し、承認に必要な4%へ圧縮します。',
      },
      {
        title: '向いているチーム',
        body:
          '専任グロース人材を採用する前のB2B SaaS、Web獲得比率が高い少人数チーム、GitHubベースの開発ワークフローを持つチームに向いています。',
        items: ['シードからプレシリーズA', '3-15名程度', 'FounderやCTOがWeb改善まで担っている'],
      },
    ],
    comparison: {
      title: '既存ツールとの違い',
      headers: ['種類', '主な役割', '不足しやすい点'],
      rows: [
        ['分析ツール', '数値を見る', '実装まで進まない'],
        ['AI記事生成', '原稿を作る', '改善検知と検証がない'],
        ['mozule growth', '検知からPRと検証まで回す', '初期はDesign Partnerと育てる'],
      ],
    },
    workflow: commonWorkflow,
    faq: growthHomeFaq,
    related: [
      { label: 'スタートアップSEO', href: '/growth/startup-seo/' },
      { label: 'MCP GitHub連携', href: '/growth/mcp-github/' },
      { label: 'サンプルレポート', href: '/growth/sample-report/' },
    ],
  },
  {
    slug: 'mcp-github',
    path: '/growth/mcp-github/',
    title: 'MCP GitHub連携でSEO改善PRを自動化',
    description:
      'MCPとGitHub連携で、SEO/AEO改善案をPR化。人間承認、権限分離、rollback、監査ログを前提に安全に導入します。',
    eyebrow: 'MCP / GitHub',
    h1: 'MCP GitHub連携でSEO改善PRを自動化',
    lede:
      'MCP GitHub連携の価値は、AIに本番を任せることではありません。改善案をPRに閉じ込め、人間が差分を確認し、承認したものだけをShipできることです。',
    primaryKeyword: 'MCP GitHub 連携',
    ctaLabel: 'GitHub連携PoCを相談',
    ctaHref: '/growth/integrations/github/',
    schemaType: 'Service',
    sections: [
      {
        title: '勝手に本番変更しない設計',
        body:
          'PGAはPR単位の人間承認を前提にします。権限スコープ、secret、private repository、rollback方針を導入前に確認します。',
        items: ['読み取り/書き込み権限の分離', 'PR差分レビュー', '監査ログとrollback'],
      },
      {
        title: 'マーケ改善を開発バックログに積まない',
        body:
          'title、description、内部リンク、FAQ、構造化データのような小さな改善を、開発チームの重いタスクにせずPRとして前に進めます。',
      },
    ],
    comparison: {
      title: 'CTOが確認すべき安全性',
      headers: ['確認項目', '見るべき内容', 'PGAの方針'],
      rows: [
        ['権限', 'repoとAPIのscope', '必要最小限をPoCで確認'],
        ['変更範囲', 'どのファイルを触るか', 'PR差分で可視化'],
        ['戻し方', '失敗時の復旧', 'rollback前提で設計'],
      ],
    },
    workflow: commonWorkflow,
    faq: [
      {
        question: 'PR承認なしにコードは変更されますか？',
        answer: '初期導入ではPR単位の人間承認を前提にします。自動デプロイ範囲は導入時に明確化します。',
      },
      {
        question: 'private repositoryに対応できますか？',
        answer: 'PoC時に権限スコープを確認し、必要最小限のアクセスで設計します。',
      },
      {
        question: 'secretは読み取りますか？',
        answer: 'secretを本文やログに出さない設計を前提に、触れる範囲を導入時に制限します。',
      },
    ],
    related: [
      { label: 'GitHub連携', href: '/growth/integrations/github/' },
      { label: 'MCPとは', href: '/growth/learn/mcp/what-is-mcp/' },
      { label: 'セキュリティ', href: '/growth/security/' },
    ],
  },
  {
    slug: 'startup-seo',
    path: '/growth/startup-seo/',
    title: 'スタートアップSEOの立ち上げ方',
    description:
      'シード期、プレシリーズAのB2B SaaS向けに、SEOの立ち上げ順序、LP、記事、内部リンク、GSC改善を整理します。',
    eyebrow: 'Startup SEO',
    h1: 'スタートアップSEOの立ち上げ方',
    lede:
      'スタートアップSEOは、記事を増やす前に勝てる受け皿を作ることから始まります。mozule growthは、商用LP、ナレッジ、内部リンク、GSC改善を90日単位で回します。',
    primaryKeyword: 'スタートアップ SEO 立ち上げ',
    ctaLabel: '90日SEO立ち上げ診断',
    ctaHref: '/growth/sample-report/',
    schemaType: 'Service',
    sections: [
      {
        title: '採用前にSEOの型を作る',
        body:
          '専任マーケターを採用する前に、必要なLP、検索意図、内部リンク、改善サイクルを整えると、採用後の学習コストも下がります。',
      },
      {
        title: '記事より先にCV受け皿を作る',
        body:
          '初期SEOで失敗しやすいのは、流入を取っても商談につながるページがないことです。まず商用LPと診断CTAを整えます。',
        items: ['トップと商用LP', '方法論とサンプルレポート', 'ナレッジ記事からLPへのリンク'],
      },
    ],
    comparison: {
      title: 'SEO立ち上げの順番',
      headers: ['順番', 'やること', '目的'],
      rows: [
        ['1', '商用LPを作る', 'CV受け皿を用意'],
        ['2', 'ロングテール記事を出す', '初期接触を作る'],
        ['3', 'GSCで改善する', '勝ち筋に寄せる'],
      ],
    },
    workflow: commonWorkflow,
    faq: [
      {
        question: 'シード期でもSEOを始めるべきですか？',
        answer: 'すぐに大型流入を狙うのではなく、導入検討に耐えるLPと検索意図の蓄積から始める価値があります。',
      },
      {
        question: '記事は何本必要ですか？',
        answer: '初期は20-30URLより、商用LPと6-10本の高意図記事を優先します。',
      },
      {
        question: '外注と内製はどちらがよいですか？',
        answer: '初期は仮説検証速度が重要です。外注前に、何を作ればCVに近いかを診断するのが安全です。',
      },
    ],
    related: [
      { label: 'B2B SaaS SEO立ち上げ', href: '/growth/learn/startup-seo/b2b-saas-seo/' },
      { label: 'SEO 90日ロードマップ', href: '/growth/learn/startup-seo/seo-first-90-days/' },
      { label: 'AIグロースエージェント', href: '/growth/ai-growth-agent/' },
    ],
  },
  {
    slug: 'gsc-automation',
    path: '/growth/gsc-automation/',
    title: 'Google Search Console改善優先順位をAIで抽出',
    description:
      'Google Search Consoleの表示回数、CTR、順位、インデックス状況から、改善優先順位とPR化すべき施策をAIが整理します。',
    eyebrow: 'GSC Automation',
    h1: 'Google Search Console改善優先順位をAIで抽出',
    lede:
      'Google Search Consoleは見ても、次にどのURLを直すべきかで止まりがちです。mozule growthは、低CTR、順位下落、表示増クリック低を検知し、改善案へ落とします。',
    primaryKeyword: 'Google Search Console 改善 優先順位',
    ctaLabel: 'GSC改善優先順位を診断',
    ctaHref: '/growth/sample-report/',
    schemaType: 'Service',
    sections: [
      {
        title: 'Signalを改善候補へ変える',
        body:
          '表示回数が増えているのにクリックされない、順位が落ちた、インデックスされない。こうした兆候をURL単位で整理します。',
        items: ['低CTRページ', '順位下落ページ', 'クロール済み未インデックス'],
      },
      {
        title: '修正案をPRに近い粒度で出す',
        body:
          'title、description、FAQ、内部リンク、構造化データのどこを変えるべきかを、実装に近い粒度で提示します。',
      },
    ],
    workflow: commonWorkflow,
    faq: [
      {
        question: 'GSCのどのデータを使いますか？',
        answer: '検索クエリ、ページ、表示回数、クリック、CTR、平均掲載順位、インデックス状況を使います。',
      },
      {
        question: '改善案は自動で公開されますか？',
        answer: '初期は改善案とPRを作り、人間が承認して公開する流れを前提にします。',
      },
      {
        question: 'GA4も使いますか？',
        answer: 'CVや行動指標まで見る場合はGA4も接続し、SEO指標とCVの近さを合わせて優先順位化します。',
      },
    ],
    related: [
      { label: 'Search Console連携', href: '/growth/integrations/google-search-console/' },
      { label: 'SEOリライト優先順位', href: '/growth/learn/seo/seo-rewrite-priority/' },
      { label: 'サンプルレポート', href: '/growth/sample-report/' },
    ],
  },
  {
    slug: 'lp-optimization-ai',
    path: '/growth/lp-optimization-ai/',
    title: 'LP改善AIで仮説検証を高速化',
    description:
      'LP改善AIとして、ファーストビュー、CTA、FAQ、比較表、構造化データを改善し、検証回数を増やします。',
    eyebrow: 'LP Optimization',
    h1: 'LP改善AIで仮説検証を高速化',
    lede:
      'LP改善AIの価値は、きれいな案を出すことではありません。64点の訴求をすばやくShipし、反応を見て次の改善に進めることです。',
    primaryKeyword: 'LP改善 AI',
    ctaLabel: 'LP改善PoCを相談',
    ctaHref: '/growth/#contact',
    schemaType: 'Service',
    sections: [
      {
        title: '改善対象を細かく分ける',
        body:
          'ファーストビュー、CTA、比較表、FAQ、導入フロー、構造化データを分けて見れば、小さな改善PRを連続して出せます。',
      },
      {
        title: 'データで次の訴求を決める',
        body:
          'GSC、GA4、ヒートマップ、フォーム到達率を組み合わせ、次に試すべきコピーと構成を決めます。',
      },
    ],
    workflow: commonWorkflow,
    faq: [
      {
        question: 'LP全体を作り直す必要がありますか？',
        answer: '必ずしも必要ありません。まずはFV、CTA、FAQ、比較表のような部分改善から始められます。',
      },
      {
        question: 'A/Bテストにも使えますか？',
        answer: 'はい。仮説、変更内容、期待指標をセットで整理し、実装と検証のサイクルへ接続します。',
      },
      {
        question: 'デザイン変更もできますか？',
        answer: '既存サイトの実装方式に合わせて、コピー、構成、UI部品の改善PRとして提案します。',
      },
    ],
    related: [
      { label: 'AIグロースエージェント', href: '/growth/ai-growth-agent/' },
      { label: 'PMF検証の打席数', href: '/growth/learn/growth/pmf-test-velocity/' },
      { label: 'GitHub連携', href: '/growth/integrations/github/' },
    ],
  },
];

export const supportPages: GrowthPage[] = [
  {
    slug: 'sample-report',
    path: '/growth/sample-report/',
    title: 'SEO改善レポート サンプル',
    description:
      'mozule growthが出すSignal診断、GSC改善優先順位、PR化候補、AEO観測のサンプルを紹介します。',
    eyebrow: 'Sample Report',
    h1: 'SEO改善レポート サンプル',
    lede:
      '診断で渡すのは、抽象的な提案書ではありません。どのURLを、なぜ、どの順で直すべきか、PR化できる粒度で整理した改善優先順位レポートです。',
    primaryKeyword: 'SEO改善レポート サンプル',
    ctaLabel: '自社版のSignal診断を相談',
    ctaHref: '/growth/#contact',
    schemaType: 'Service',
    sections: [
      {
        title: 'レポートに含めるもの',
        body:
          'GSCの主要Signal、改善候補URL、想定インパクト、実装難易度、PR化候補、AEO定点観測の結果をまとめます。',
        items: ['改善優先順位', 'title/description修正案', '内部リンクとFAQの追加候補'],
      },
      {
        title: 'CxOが判断できる粒度にする',
        body:
          '単なるSEO指標ではなく、何を承認すればよいかがわかる形に整えるため、施策ごとに目的とリスクを明記します。',
      },
    ],
    faq: [
      {
        question: '診断には何が必要ですか？',
        answer: 'GSC、GA4、対象サイトURL、重要CV、現在の優先事業領域があると精度が上がります。',
      },
      {
        question: 'PRサンプルまで作れますか？',
        answer: 'GitHub連携PoCでは、既存サイトに対する改善PRサンプル1本を作る想定です。',
      },
      {
        question: '実名事例がなくても相談できますか？',
        answer: 'はい。初期は匿名PoCやサンプルレポートで、改善余地の確認から始められます。',
      },
    ],
    related: [
      { label: 'GSC改善自動化', href: '/growth/gsc-automation/' },
      { label: 'SEO自動化ツール', href: '/growth/seo-automation/' },
      { label: 'GitHub連携', href: '/growth/integrations/github/' },
    ],
  },
  {
    slug: 'security',
    path: '/growth/security/',
    title: 'AIエージェント導入のセキュリティ',
    description:
      'mozule growthのMCP/GitHub連携における権限、PR承認、secret、監査ログ、rollbackの考え方を説明します。',
    eyebrow: 'Security',
    h1: 'AIエージェント導入のセキュリティ',
    lede:
      'AIエージェントをWebサイト改善に使うとき、最初に確認すべきなのは便利さではなく安全性です。mozule growthはPR承認、権限分離、監査可能性を前提にします。',
    primaryKeyword: 'AIエージェント セキュリティ',
    ctaLabel: '安全な導入範囲を相談',
    ctaHref: '/growth/#contact',
    schemaType: 'Service',
    sections: [
      {
        title: 'PRを安全境界にする',
        body:
          '初期導入では、AIの出力を本番に直接反映しません。PR差分として可視化し、人間が承認した変更だけをShipします。',
      },
      {
        title: '権限を最小化する',
        body:
          'GitHub、GSC、GA4の権限は導入目的ごとに分け、不要な書き込みやsecretアクセスを避けます。',
        items: ['読み取り/書き込み権限の分離', 'private repoの範囲確認', 'ログに機密情報を出さない'],
      },
    ],
    faq: [
      {
        question: '本番へ直接デプロイしますか？',
        answer: '初期導入ではPR承認を前提にし、直接本番変更はしない設計から始めます。',
      },
      {
        question: '権限スコープは確認できますか？',
        answer: 'はい。GitHub、GSC、GA4ごとに必要な権限を導入前に確認します。',
      },
      {
        question: '失敗時に戻せますか？',
        answer: 'PR単位で変更履歴を残し、rollbackできる運用を前提にします。',
      },
    ],
    related: [
      { label: 'MCP GitHub連携', href: '/growth/mcp-github/' },
      { label: 'GitHub連携', href: '/growth/integrations/github/' },
      { label: 'サンプルレポート', href: '/growth/sample-report/' },
    ],
  },
  {
    slug: 'pricing',
    path: '/growth/pricing/',
    title: 'mozule growth料金',
    description:
      'mozule growthの導入、PoC、Design Partner、運用支援の料金設計と、初期相談の進め方を説明します。',
    eyebrow: 'Pricing',
    h1: 'mozule growth料金',
    lede:
      '料金は、PoCで何を検証するか、どの連携まで行うか、運用まで含めるかで変わります。初期はDesign PartnerとPoCを中心に、成果物が明確な形で進めます。',
    primaryKeyword: 'PGA 料金',
    ctaLabel: 'PoCの範囲を相談',
    ctaHref: '/growth/#contact',
    schemaType: 'Service',
    sections: [
      {
        title: '初期PoCで確認すること',
        body:
          '最初から大規模導入せず、GSC改善レポート、GitHub PRサンプル、AEO観測など、価値を確認できる単位で始めます。',
      },
      {
        title: '費用が変わる要素',
        body:
          '対象サイト数、GitHub連携、GSC/GA4接続、記事/LP制作範囲、運用レポート頻度によって変わります。',
      },
    ],
    faq: [
      {
        question: '無料相談はできますか？',
        answer: '初期相談では、対象サイトと検証したいゴールを確認し、PoC範囲を整理します。',
      },
      {
        question: '成果連動ですか？',
        answer: '初期はPoC/導入支援/運用支援の組み合わせを想定します。成果定義は個別に確認します。',
      },
      {
        question: 'Design Partner枠はありますか？',
        answer: '初期導入ではDesign Partnerとして、機能要望を反映しながら進める枠を想定しています。',
      },
    ],
    related: [
      { label: 'サンプルレポート', href: '/growth/sample-report/' },
      { label: 'セキュリティ', href: '/growth/security/' },
      { label: 'GitHub連携', href: '/growth/integrations/github/' },
    ],
  },
  {
    slug: 'methodology',
    path: '/growth/methodology/',
    title: 'SEO/AEO改善方法論',
    description:
      'mozule growthがSEO、AEO、E-E-A-T、構造化データ、内部リンク、GSC改善をどう判断するかを公開します。',
    eyebrow: 'Methodology',
    h1: 'SEO/AEO改善方法論',
    lede:
      'mozule growthの方法論は、AEOをSEOと切り離しません。検索意図、E-E-A-T、構造化データ、内部リンク、GSC改善を、AIが理解しやすい形で統合します。',
    primaryKeyword: 'SEO AEO 方法論',
    ctaLabel: '方法論ベースで診断する',
    ctaHref: '/growth/sample-report/',
    schemaType: 'Service',
    sections: [
      {
        title: 'AEOは最新SEOの延長にある',
        body:
          'AI Overviewで引用されるには、信頼できる情報源、明確な結論、FAQ、構造化データ、内部リンクが必要です。',
      },
      {
        title: '改善はユニーク化、リッチ化、最適化で見る',
        body:
          '重複を避けるユニーク化、低品質を解消するリッチ化、検索意図に合わせて削る最適化を組み合わせます。',
      },
    ],
    faq: [
      {
        question: 'AEOだけを単独で対策しますか？',
        answer: '単独では見ません。SEO基礎、E-E-A-T、構造化データ、内部リンクの延長として扱います。',
      },
      {
        question: 'どのページから改善しますか？',
        answer: 'CVに近い商用LP、表示回数がある低CTRページ、インデックス不良ページから優先します。',
      },
      {
        question: '内部リンクは自動で増やしますか？',
        answer: '関連度が低いリンクは逆効果なので、ピラー/リーフの関係を見て必要なリンクだけを提案します。',
      },
    ],
    related: [
      { label: 'AEO対策', href: '/growth/aeo/' },
      { label: 'SEO自動化', href: '/growth/seo-automation/' },
      { label: '内部リンク自動化', href: '/growth/learn/seo/internal-link-automation/' },
    ],
  },
  {
    slug: 'case-studies',
    path: '/growth/case-studies/',
    title: 'mozule growthケーススタディ',
    description:
      'mozule growthのPoC、GSC改善、PR化、AEO観測などのケーススタディを掲載するページです。',
    eyebrow: 'Case Studies',
    h1: 'mozule growthケーススタディ',
    lede:
      'ケーススタディでは、単なる成果数値だけでなく、どのSignalを見て、どの施策に変え、何を学んだかを公開します。',
    primaryKeyword: 'mozule growth 事例',
    ctaLabel: '自社でPoCを相談',
    ctaHref: '/growth/#contact',
    schemaType: 'Service',
    sections: [
      {
        title: '掲載予定の事例',
        body:
          '初期は匿名PoCも含め、GSC改善、LP改善、AEO観測、GitHub PR化の事例を順次公開します。',
        items: ['GSCから改善PRへ', 'AI Overview引用性の改善', 'シード期SEOロードマップ'],
      },
      {
        title: '数値が弱い段階でも学びを出す',
        body:
          '初期検証では、順位や流入だけでなく、何を判断できるようになったかを成果として扱います。',
      },
    ],
    faq: [
      {
        question: '実名事例はありますか？',
        answer: '公開許諾が取れたものから順次掲載します。初期は匿名事例も扱います。',
      },
      {
        question: 'どんな成果を見ますか？',
        answer: '表示回数、CTR、順位、CV、PR作成数、改善サイクルの速度を見ます。',
      },
      {
        question: 'PoC期間はどれくらいですか？',
        answer: '対象範囲によりますが、初期は2-6週間で価値検証できる範囲を設計します。',
      },
    ],
    related: [
      { label: 'サンプルレポート', href: '/growth/sample-report/' },
      { label: 'スタートアップSEO', href: '/growth/startup-seo/' },
      { label: 'GSC改善自動化', href: '/growth/gsc-automation/' },
    ],
  },
];

export const growthPages = [...commercialPages, ...supportPages];

export const integrationOverview: GrowthPage = {
  slug: 'integrations',
  path: '/growth/integrations/',
  title: 'mozule growth連携',
  description:
    'mozule growthが連携するGitHub、Google Search Console、GA4、Vercelなどの導入範囲とPoC方針をまとめます。',
  eyebrow: 'Integrations',
  h1: 'mozule growth連携',
  lede:
    'mozule growthは、分析ツールと開発ワークフローをつなぎます。まずは必要最小限の権限で、GSCやGitHubから小さくPoCします。',
  primaryKeyword: 'PGA 連携',
  ctaLabel: '連携PoCを相談',
  ctaHref: '/growth/#contact',
  schemaType: 'Service',
  sections: [
    {
      title: 'SignalとShipをつなぐ',
      body:
        'Google Search ConsoleやGA4で見つけた改善候補を、GitHub PRやデプロイワークフローへつなげます。',
      items: ['GitHub', 'Google Search Console', 'Google Analytics 4', 'Vercel'],
    },
  ],
  faq: [
    {
      question: 'すべての連携が必要ですか？',
      answer: 'いいえ。PoCではGSCとGitHubなど、価値検証に必要な最小構成から始めます。',
    },
    {
      question: '権限はどこで確認しますか？',
      answer: '導入前に連携ごとの権限スコープを確認し、不要なアクセスを避けます。',
    },
    {
      question: 'Vercel以外でも使えますか？',
      answer: 'Cloudflare、GitHub Pages、WordPressなど、実装方式に合わせて検証します。',
    },
  ],
  related: [
    { label: 'GitHub連携', href: '/growth/integrations/github/' },
    { label: 'Google Search Console連携', href: '/growth/integrations/google-search-console/' },
    { label: 'セキュリティ', href: '/growth/security/' },
  ],
};

export const integrationPages: GrowthPage[] = [
  {
    slug: 'github',
    path: '/growth/integrations/github/',
    title: 'GitHub連携',
    description:
      'mozule growthのGitHub連携では、SEO/AEO改善案をPR化し、人間承認を挟んで安全にShipします。',
    eyebrow: 'GitHub Integration',
    h1: 'GitHub連携',
    lede:
      'GitHub連携では、AIの改善案をそのまま本番へ流しません。PRとして差分化し、レビュー可能な状態でShipします。',
    primaryKeyword: 'GitHub連携',
    ctaLabel: 'GitHub連携PoCを相談',
    ctaHref: '/growth/#contact',
    schemaType: 'Service',
    sections: [
      {
        title: 'PRで差分を管理する',
        body:
          'title、description、FAQ、内部リンク、構造化データの変更をPRとして出し、承認後に反映します。',
      },
      {
        title: '初期は最小権限で始める',
        body:
          'private repositoryやデプロイ連携は、対象範囲と権限スコープを確認してから進めます。',
      },
    ],
    faq: [
      {
        question: 'GitHub Appで連携しますか？',
        answer: '導入形態に応じてGitHub App/OAuth/手動PRのいずれかを選びます。',
      },
      {
        question: 'レビュー担当者を指定できますか？',
        answer: '既存のCODEOWNERSやレビュー運用に合わせた設計を検討します。',
      },
      {
        question: 'PRサンプルだけ作れますか？',
        answer: 'はい。PoCでは改善PRサンプル1本から検証できます。',
      },
    ],
    related: [
      { label: 'MCP GitHub連携', href: '/growth/mcp-github/' },
      { label: 'セキュリティ', href: '/growth/security/' },
      { label: 'MCPとは', href: '/growth/learn/mcp/what-is-mcp/' },
    ],
  },
  {
    slug: 'google-search-console',
    path: '/growth/integrations/google-search-console/',
    title: 'Google Search Console連携',
    description:
      'Google Search Console連携で、検索クエリ、URL、CTR、順位、インデックス状況から改善候補を抽出します。',
    eyebrow: 'GSC Integration',
    h1: 'Google Search Console連携',
    lede:
      'Google Search Console連携は、mozule growthのSignal検知の起点です。表示回数、CTR、順位、インデックス状況を改善優先順位へ変換します。',
    primaryKeyword: 'Google Search Console 連携',
    ctaLabel: 'GSC診断を相談',
    ctaHref: '/growth/sample-report/',
    schemaType: 'Service',
    sections: [
      {
        title: '改善候補をURL単位で抽出',
        body:
          '表示回数が伸びたがクリックされないURL、順位が落ちたURL、インデックス不良URLを整理します。',
      },
      {
        title: '施策へ落とす',
        body:
          'title修正、FAQ追加、内部リンク、構造化データ、LP改善へ変換します。',
      },
    ],
    faq: [
      {
        question: 'GSCの全データを使いますか？',
        answer: 'PoCでは対象サイトと重要ページに絞り、改善に必要な範囲から確認します。',
      },
      {
        question: 'インデックス状況も見ますか？',
        answer: 'はい。クロール済み未インデックスや重複の兆候も改善対象にします。',
      },
      {
        question: 'AEOにも使えますか？',
        answer: '検索流入の土台を整えたうえで、AI Overview引用に必要な構造へ接続します。',
      },
    ],
    related: [
      { label: 'GSC改善自動化', href: '/growth/gsc-automation/' },
      { label: 'サンプルレポート', href: '/growth/sample-report/' },
      { label: 'SEOリライト優先順位', href: '/growth/learn/seo/seo-rewrite-priority/' },
    ],
  },
  {
    slug: 'google-analytics-4',
    path: '/growth/integrations/google-analytics-4/',
    title: 'GA4連携',
    description:
      'GA4連携で、SEO流入後の行動、CV、導線を確認し、検索順位だけでなく事業成果に近い改善へつなげます。',
    eyebrow: 'GA4 Integration',
    h1: 'GA4連携',
    lede:
      'GA4連携では、SEO流入後の行動とCVを見ます。検索順位だけでなく、どのページが商談や診断につながるかを優先順位に反映します。',
    primaryKeyword: 'GA4連携',
    ctaLabel: 'GA4連携PoCを相談',
    ctaHref: '/growth/#contact',
    schemaType: 'Service',
    sections: [
      {
        title: '検索流入後の行動を見る',
        body:
          '直帰、滞在、CTAクリック、フォーム到達などを見て、SEO施策が事業成果に近いかを判断します。',
      },
      {
        title: 'CVに近いページを優先する',
        body:
          '表示回数だけでなく、CVに近いページやCTA遷移が強いページを改善対象にします。',
      },
    ],
    faq: [
      {
        question: 'GA4は必須ですか？',
        answer: 'SEO診断だけならGSC中心でも始められます。CV評価まで見る場合はGA4連携を推奨します。',
      },
      {
        question: 'イベント設計もできますか？',
        answer: 'CTAクリックやフォーム到達など、改善判断に必要なイベント設計も相談できます。',
      },
      {
        question: '個人情報は扱いますか？',
        answer: 'PoCでは個人情報を扱わない分析範囲から始める方針です。',
      },
    ],
    related: [
      { label: 'GSC改善自動化', href: '/growth/gsc-automation/' },
      { label: 'セキュリティ', href: '/growth/security/' },
      { label: 'サンプルレポート', href: '/growth/sample-report/' },
    ],
  },
  {
    slug: 'vercel',
    path: '/growth/integrations/vercel/',
    title: 'Vercel連携',
    description:
      'Vercel連携で、Web改善PRからPreview、承認、Deployまでの流れを既存ワークフローに合わせて設計します。',
    eyebrow: 'Vercel Integration',
    h1: 'Vercel連携',
    lede:
      'Vercel連携では、Web改善PRのPreviewを確認し、人間承認を経てDeployする流れを既存の開発ワークフローに合わせます。',
    primaryKeyword: 'Vercel連携',
    ctaLabel: 'デプロイ連携を相談',
    ctaHref: '/growth/#contact',
    schemaType: 'Service',
    sections: [
      {
        title: 'Previewで確認してからShip',
        body:
          'LPコピーや構造化データの改善をPR化し、Previewで確認したうえで本番反映します。',
      },
      {
        title: 'Cloudflareや他環境にも対応',
        body:
          'Vercel以外でも、Cloudflare、GitHub Pages、WordPressなど現在の運用に合わせて設計します。',
      },
    ],
    faq: [
      {
        question: 'Vercel以外でも使えますか？',
        answer: 'はい。現在のデプロイ先に合わせて、PRから公開までの導線を設計します。',
      },
      {
        question: 'Preview URLを見て承認できますか？',
        answer: '既存ワークフローが対応していれば、Preview確認後に承認する形で進められます。',
      },
      {
        question: '自動ロールバックできますか？',
        answer: '完全自動化の前に、PRとデプロイ履歴を使った戻し方を設計します。',
      },
    ],
    related: [
      { label: 'GitHub連携', href: '/growth/integrations/github/' },
      { label: 'MCP GitHub連携', href: '/growth/mcp-github/' },
      { label: 'LP改善AI', href: '/growth/lp-optimization-ai/' },
    ],
  },
];

export const comparePages: GrowthPage[] = [
  {
    slug: 'ai-seo-tools',
    path: '/growth/compare/ai-seo-tools/',
    title: 'AI SEOツール比較',
    description:
      'AI SEOツールを、記事生成、分析、実装、AEO、GitHub連携、効果監視の観点で比較します。',
    eyebrow: 'Compare',
    h1: 'AI SEOツール比較',
    lede:
      'AI SEOツール比較では、記事を作れるかだけで判断すると失敗します。改善機会の検知、実装、AEO、効果監視まで見て選ぶ必要があります。',
    primaryKeyword: 'AI SEOツール 比較',
    ctaLabel: 'SEO自動化の違いを見る',
    ctaHref: '/growth/seo-automation/',
    schemaType: 'Article',
    sections: [
      {
        title: '比較軸は生成から実装へ',
        body:
          'SEOのボトルネックは原稿不足だけではありません。改善案がコードやCMSに反映されないことも大きな問題です。',
      },
    ],
    comparison: {
      title: 'AI SEOツールの比較軸',
      headers: ['比較軸', '確認内容', 'mozule growthの見方'],
      rows: [
        ['記事生成', '構成と本文を作れるか', '必要だが主価値ではない'],
        ['分析', 'GSCや順位から機会を見つけるか', 'Signalとして重視'],
        ['実装', 'PRやCMS反映まで進むか', 'Shipを重視'],
        ['検証', '公開後に学習するか', 'Learnまで見る'],
      ],
    },
    faq: [
      {
        question: 'AI SEOツールは記事生成だけで十分ですか？',
        answer: '十分ではありません。商用LP、内部リンク、構造化データ、公開後改善まで見る必要があります。',
      },
      {
        question: 'PGAはAI SEOツールですか？',
        answer: 'SEO改善を扱いますが、より正確にはAIグロースエージェントです。',
      },
      {
        question: '比較時に最初に見るべき項目は？',
        answer: '実装と検証まで進むか、既存ワークフローに接続できるかです。',
      },
    ],
    related: [
      { label: 'SEO自動化ツール', href: '/growth/seo-automation/' },
      { label: 'AEOツール比較', href: '/growth/compare/aeo-tools/' },
      { label: 'GitHub連携', href: '/growth/integrations/github/' },
    ],
  },
  {
    slug: 'aeo-tools',
    path: '/growth/compare/aeo-tools/',
    title: 'AEOツール比較',
    description:
      'AEOツールを、AI Visibility観測、構造化データ、FAQ、SEO改善、実装連携の観点で比較します。',
    eyebrow: 'Compare',
    h1: 'AEOツール比較',
    lede:
      'AEOツール比較では、AI回答の可視化だけでなく、引用されやすいページへ改善できるかが重要です。観測と実装が分断されると成果に届きません。',
    primaryKeyword: 'AEOツール 比較',
    ctaLabel: 'AEO対策を見る',
    ctaHref: '/growth/aeo/',
    schemaType: 'Article',
    sections: [
      {
        title: '可視化だけで終わらせない',
        body:
          'AI回答でブランドが出ないとわかっても、何を直すか、どう実装するかがなければ改善は進みません。',
      },
    ],
    comparison: {
      title: 'AEOツールの比較軸',
      headers: ['比較軸', '確認内容', 'PGAの方針'],
      rows: [
        ['観測', 'AI回答内の露出を見るか', '定点観測する'],
        ['改善', 'FAQ/Schema/本文へ落ちるか', 'PR化する'],
        ['SEO連携', 'GSCとつながるか', 'SEO土台から見る'],
      ],
    },
    faq: [
      {
        question: 'AEOツールは何を比較すべきですか？',
        answer: 'AI回答の観測だけでなく、改善案と実装まで進むかを比較すべきです。',
      },
      {
        question: 'AEOはSEOなしで成立しますか？',
        answer: '成立しにくいです。検索エンジンに正しく認識されるSEO基盤が必要です。',
      },
      {
        question: 'PGAはAEO観測もできますか？',
        answer: '重要クエリでAI回答内にブランドやURLが出るかを定点観測する設計です。',
      },
    ],
    related: [
      { label: 'AEO対策', href: '/growth/aeo/' },
      { label: 'AEOとは', href: '/growth/learn/aeo/what-is-aeo/' },
      { label: 'AI Overview引用', href: '/growth/learn/aeo/ai-overview-citation/' },
    ],
  },
  {
    slug: 'seo-automation-tools',
    path: '/growth/compare/seo-automation-tools/',
    title: 'SEO自動化ツール比較',
    description:
      'SEO自動化ツールを、分析、生成、構造化データ、内部リンク、実装、検証の観点で比較します。',
    eyebrow: 'Compare',
    h1: 'SEO自動化ツール比較',
    lede:
      'SEO自動化ツールは、どこまで自動化するかで価値が変わります。分析で止まるのか、実装まで進むのか、公開後に学習するのかを比較します。',
    primaryKeyword: 'SEO自動化ツール 比較',
    ctaLabel: 'PGAのSEO自動化を見る',
    ctaHref: '/growth/seo-automation/',
    schemaType: 'Article',
    sections: [
      {
        title: '自動化の範囲を定義する',
        body:
          'SEO自動化には、キーワード分析、記事生成、内部リンク、構造化データ、GSC改善、PR実装、効果監視が含まれます。',
      },
    ],
    comparison: {
      title: 'SEO自動化ツールの比較軸',
      headers: ['機能', '一般的な対応', 'PGAの狙い'],
      rows: [
        ['分析', 'レポート出力', '改善優先順位化'],
        ['生成', '記事/見出し作成', '商用LPとFAQも対象'],
        ['実装', '人間が反映', 'GitHub PR化'],
        ['検証', '別ツールで確認', 'Learnへ接続'],
      ],
    },
    faq: [
      {
        question: 'SEO自動化で最も重要な機能は何ですか？',
        answer: '成果に近いのは、改善機会を見つけて実装し、結果を見る一連の流れです。',
      },
      {
        question: '記事生成は不要ですか？',
        answer: '不要ではありません。ただし記事生成だけでは商談やAEOには届きにくいです。',
      },
      {
        question: 'PGAはどんなチーム向けですか？',
        answer: '少人数でWeb獲得を伸ばしたいFounder/CTO/グロース担当向けです。',
      },
    ],
    related: [
      { label: 'SEO自動化ツール', href: '/growth/seo-automation/' },
      { label: 'AI SEOツール比較', href: '/growth/compare/ai-seo-tools/' },
      { label: 'GSC改善自動化', href: '/growth/gsc-automation/' },
    ],
  },
];

export const learnArticles: GrowthPage[] = [
  {
    slug: 'what-is-aeo',
    path: '/growth/learn/aeo/what-is-aeo/',
    title: 'AEOとは？SEOとの違いと始め方',
    description:
      'AEOとは何か、SEOとの違い、AI OverviewやLLM回答に引用されるために必要な実務を解説します。',
    eyebrow: 'Learn / AEO',
    h1: 'AEOとは？SEOとの違い',
    lede:
      'AEOとは、AI回答で発見、理解、引用、推奨されるために情報を整える実務です。SEOの基礎を土台に、結論、FAQ、構造化データ、信頼情報をAIが読みやすくします。',
    primaryKeyword: 'AEOとは',
    ctaLabel: 'AEO対策を見る',
    ctaHref: '/growth/aeo/',
    schemaType: 'Article',
    sections: [
      {
        title: 'AEOはSEOの置き換えではない',
        body:
          '検索エンジンに正しく認識され、ユーザーに役立つ情報であることが前提です。AEOはその情報をAIが引用しやすい形にする実務です。',
      },
      {
        title: '最初に整える項目',
        body:
          '定義、比較表、FAQ、著者情報、構造化データ、内部リンクを優先します。特に冒頭の短い結論はAIにも人間にも効きます。',
      },
    ],
    faq: [
      {
        question: 'AEOは何の略ですか？',
        answer: 'Answer Engine Optimizationの略として使われ、AI回答面で引用されやすくする取り組みを指します。',
      },
      {
        question: 'SEOと何が違いますか？',
        answer: 'SEOは検索結果で評価されるための土台、AEOはAI回答で理解・引用されやすくするための構造化です。',
      },
      {
        question: '最初に何をすべきですか？',
        answer: '重要ページに明確な結論、FAQ、構造化データ、著者/運営者情報を追加します。',
      },
    ],
    related: [
      { label: 'AEO対策', href: '/growth/aeo/' },
      { label: 'AI Overview引用', href: '/growth/learn/aeo/ai-overview-citation/' },
      { label: 'AEOツール比較', href: '/growth/compare/aeo-tools/' },
    ],
  },
  {
    slug: 'ai-overview-citation',
    path: '/growth/learn/aeo/ai-overview-citation/',
    title: 'AI Overviewに引用されるには？',
    description:
      'AI Overviewに引用されるために必要なE-E-A-T、結論、FAQ、構造化データ、内部リンク、SEO基礎施策を解説します。',
    eyebrow: 'Learn / AEO',
    h1: 'AI Overviewに引用されるには？',
    lede:
      'AI Overviewに引用されるには、特別な裏技よりも、信頼できる情報源、明確な結論、FAQ、構造化データ、内部リンクを整えることが重要です。',
    primaryKeyword: 'AI Overview 引用されるには',
    ctaLabel: 'AI Visibility診断を見る',
    ctaHref: '/growth/aeo/',
    schemaType: 'Article',
    sections: [
      {
        title: '引用されやすいページの条件',
        body:
          '上位表示、E-E-A-T、包括性、実用性、読み取りやすい構造が土台になります。ページ単体ではなくサイト全体の信頼性も影響します。',
      },
      {
        title: '実装でやること',
        body:
          '冒頭に短い回答、H2/H3の整理、FAQ、表、信頼できる出典、Article/FAQ/Breadcrumb構造化データを入れます。',
      },
    ],
    faq: [
      {
        question: '検索順位が低くても引用されますか？',
        answer: '可能性はありますが、上位表示とインデックス品質が土台になるため、通常SEOの強化が重要です。',
      },
      {
        question: '構造化データだけで引用されますか？',
        answer: '構造化データは補助です。本文の内容、信頼性、内部リンク、検索意図の充足が必要です。',
      },
      {
        question: 'どんな文章が引用されやすいですか？',
        answer: '短く結論を述べ、手順や比較を明確に分けた文章が引用されやすくなります。',
      },
    ],
    related: [
      { label: 'AEO対策', href: '/growth/aeo/' },
      { label: 'AEOとは', href: '/growth/learn/aeo/what-is-aeo/' },
      { label: '方法論', href: '/growth/methodology/' },
    ],
  },
  {
    slug: 'llmo',
    path: '/growth/learn/aeo/llmo/',
    title: 'LLMOとは？AEO/GEOとの違い',
    description:
      'LLMO、AEO、GEO、AI Visibilityの違いと、B2B SaaSが最初に整えるべきSEO/AEO基礎を整理します。',
    eyebrow: 'Learn / AEO',
    h1: 'LLMOとは？AEO/GEOとの違い',
    lede:
      'LLMOは、LLMにブランドや情報を理解、引用、推奨されやすくする考え方です。AEOやGEOと重なる部分が多く、実務ではSEO基礎と情報構造の整備から始めます。',
    primaryKeyword: 'LLMOとは',
    ctaLabel: 'AEO対策を見る',
    ctaHref: '/growth/aeo/',
    schemaType: 'Article',
    sections: [
      {
        title: '用語より実務を優先する',
        body:
          'LLMO、AEO、GEOは定義が揺れます。重要なのは、AIが理解できる公式情報、比較、FAQ、実績、構造化データを揃えることです。',
      },
      {
        title: 'B2B SaaSが整える情報',
        body:
          '誰向けの何のサービスか、何が違うか、どの実績があるか、どの連携があるかを明確にします。',
      },
    ],
    faq: [
      {
        question: 'LLMOとAEOは違いますか？',
        answer: '厳密な定義は揺れますが、どちらもAI回答に理解されるための情報設計を含みます。',
      },
      {
        question: '専用ツールが必要ですか？',
        answer: '最初はサイト構造、FAQ、構造化データ、公式情報の整備から始めるべきです。',
      },
      {
        question: 'どう計測しますか？',
        answer: '重要プロンプトでブランド名、URL、競合名が出るかを定点観測します。',
      },
    ],
    related: [
      { label: 'AEO対策', href: '/growth/aeo/' },
      { label: 'AEOツール比較', href: '/growth/compare/aeo-tools/' },
      { label: 'AI Overview引用', href: '/growth/learn/aeo/ai-overview-citation/' },
    ],
  },
  {
    slug: 'b2b-saas-seo',
    path: '/growth/learn/startup-seo/b2b-saas-seo/',
    title: 'BtoB SaaS SEO立ち上げで最初にやること',
    description:
      'BtoB SaaSがSEOを立ち上げるときに、記事量産より先に作るべき商用LP、比較ページ、GSC改善導線を整理します。',
    eyebrow: 'Learn / Startup SEO',
    h1: 'BtoB SaaS SEO立ち上げで最初にやること',
    lede:
      'BtoB SaaSのSEO立ち上げでは、記事量産より先に導入検討できる商用LPを作ります。その後、課題KWや比較KWから商用LPへ内部リンクを流します。',
    primaryKeyword: 'BtoB SaaS SEO 立ち上げ',
    ctaLabel: '90日SEO立ち上げ診断',
    ctaHref: '/growth/startup-seo/',
    schemaType: 'Article',
    sections: [
      {
        title: '最初に作るページ',
        body:
          'トップ、商用LP、ユースケースLP、料金、セキュリティ、連携、サンプルレポートを整えます。',
      },
      {
        title: '記事は商用LPを支えるために作る',
        body:
          '記事の役割はPVではなく、検索意図を拾い、商用LPへ導線と評価を渡すことです。',
      },
    ],
    faq: [
      {
        question: 'BtoB SaaSは何本の記事から始めるべきですか？',
        answer: '初期は6-10本の高意図記事と、商用LPの整備を優先します。',
      },
      {
        question: '比較記事は早めに必要ですか？',
        answer: 'Buy意図が強いため早めに作る価値がありますが、薄い比較表だけにはしないよう注意します。',
      },
      {
        question: 'SEOの成果はいつ出ますか？',
        answer: '初期3か月はインデックスと表示回数、3-6か月でロングテール上位化を見ます。',
      },
    ],
    related: [
      { label: 'スタートアップSEO', href: '/growth/startup-seo/' },
      { label: 'SEO 90日ロードマップ', href: '/growth/learn/startup-seo/seo-first-90-days/' },
      { label: 'SEO自動化', href: '/growth/seo-automation/' },
    ],
  },
  {
    slug: 'seo-first-90-days',
    path: '/growth/learn/startup-seo/seo-first-90-days/',
    title: 'SEO立ち上げ90日ロードマップ',
    description:
      'スタートアップがSEOを90日で立ち上げるための、商用LP、記事、内部リンク、GSC改善の順番を整理します。',
    eyebrow: 'Learn / Startup SEO',
    h1: 'SEO立ち上げ90日ロードマップ',
    lede:
      'SEO立ち上げの90日は、商用LPを作る30日、クラスターを作る30日、GSCで改善する30日に分けます。記事量産から始めないことが重要です。',
    primaryKeyword: 'SEO 90日 ロードマップ',
    ctaLabel: '90日SEO診断を相談',
    ctaHref: '/growth/startup-seo/',
    schemaType: 'Article',
    sections: [
      {
        title: '0-30日: 受け皿を作る',
        body: 'トップ、商用LP、信頼ページ、sitemap、構造化データを整えます。',
      },
      {
        title: '31-60日: ロングテールを拾う',
        body: 'Founderの課題KW、AEO定義、比較記事を公開し、商用LPへ内部リンクします。',
      },
      {
        title: '61-90日: GSCで直す',
        body: '表示回数、CTR、順位、インデックス状況を見て、title、FAQ、内部リンクを改善します。',
      },
    ],
    faq: [
      {
        question: '90日で何を成果にしますか？',
        answer: '初期はCVよりも、インデックス、表示回数、Top20 KW、商用LPへの遷移を重視します。',
      },
      {
        question: '記事は毎日出すべきですか？',
        answer: '質と内部リンク設計を優先します。薄い記事を大量に出すより、高意図記事を確実に作ります。',
      },
      {
        question: '商用LPは何本必要ですか？',
        answer: '初期は6本程度を推奨します。SEO自動化、AEO、GSC、MCP、Startup SEO、LP改善が候補です。',
      },
    ],
    related: [
      { label: 'スタートアップSEO', href: '/growth/startup-seo/' },
      { label: 'BtoB SaaS SEO立ち上げ', href: '/growth/learn/startup-seo/b2b-saas-seo/' },
      { label: 'サンプルレポート', href: '/growth/sample-report/' },
    ],
  },
  {
    slug: 'seo-rewrite-priority',
    path: '/growth/learn/seo/seo-rewrite-priority/',
    title: 'SEOリライト優先順位の決め方',
    description:
      'SEOリライトの優先順位を、GSCの表示回数、CTR、順位、CV導線、インデックス状況から決める方法を解説します。',
    eyebrow: 'Learn / SEO',
    h1: 'SEOリライト優先順位の決め方',
    lede:
      'SEOリライトは、古い記事から順番に直すものではありません。表示回数、CTR、順位、CV導線、インデックス状況を見て、成果に近いページから直します。',
    primaryKeyword: 'SEO リライト 優先順位',
    ctaLabel: 'GSC改善優先順位を診断',
    ctaHref: '/growth/gsc-automation/',
    schemaType: 'Article',
    sections: [
      {
        title: '優先すべきページ',
        body:
          '表示回数があるがCTRが低い、順位が11-20位、CVに近い、商用LPへ内部リンクできるページを優先します。',
      },
      {
        title: '直す項目',
        body:
          'title、description、冒頭、FAQ、内部リンク、構造化データ、古い情報を見直します。',
      },
    ],
    faq: [
      {
        question: 'リライトは何から始めますか？',
        answer: 'GSCで表示回数があり、CTRや順位に改善余地があるページから始めます。',
      },
      {
        question: '全文を書き換えるべきですか？',
        answer: '必要とは限りません。title、冒頭、FAQ、内部リンクだけで改善できる場合もあります。',
      },
      {
        question: 'AIでリライトできますか？',
        answer: 'できますが、検索意図と既存順位データを見たうえで、必要箇所に絞るべきです。',
      },
    ],
    related: [
      { label: 'GSC改善自動化', href: '/growth/gsc-automation/' },
      { label: 'SEO自動化', href: '/growth/seo-automation/' },
      { label: '内部リンク自動化', href: '/growth/learn/seo/internal-link-automation/' },
    ],
  },
  {
    slug: 'internal-link-automation',
    path: '/growth/learn/seo/internal-link-automation/',
    title: '内部リンク自動化の考え方',
    description:
      '内部リンク自動化で重要な関連度、ピラー/リーフ構造、アンカーテキスト、商用LPへの評価集約を解説します。',
    eyebrow: 'Learn / SEO',
    h1: '内部リンク自動化の考え方',
    lede:
      '内部リンク自動化は、リンクを増やすことではありません。関連度の高いページ同士をつなぎ、重要な商用LPへ評価とCV導線を集めることです。',
    primaryKeyword: '内部リンク 自動化',
    ctaLabel: 'SEO自動化を見る',
    ctaHref: '/growth/seo-automation/',
    schemaType: 'Article',
    sections: [
      {
        title: '関連度が最重要',
        body:
          '関連度が低いリンクを増やすと、ユーザー体験も検索評価も下がります。ピラー/リーフ構造で必要なリンクだけを設計します。',
      },
      {
        title: '商用LPへ評価を集める',
        body:
          'ナレッジ記事は商用LPを支える役割です。記事から正規の商用LPへ文脈リンクを設置します。',
      },
    ],
    faq: [
      {
        question: '内部リンクは多いほどよいですか？',
        answer: 'いいえ。関連度と文脈が重要です。不要な横リンクは避けます。',
      },
      {
        question: 'アンカーテキストはどう決めますか？',
        answer: 'リンク先の検索意図を表す文節にし、「こちら」のような曖昧な表現は避けます。',
      },
      {
        question: '自動化できますか？',
        answer: '候補抽出は自動化できますが、関連度とCV導線を見て承認する運用が安全です。',
      },
    ],
    related: [
      { label: 'SEO自動化', href: '/growth/seo-automation/' },
      { label: '方法論', href: '/growth/methodology/' },
      { label: 'SEOリライト優先順位', href: '/growth/learn/seo/seo-rewrite-priority/' },
    ],
  },
  {
    slug: 'what-is-mcp',
    path: '/growth/learn/mcp/what-is-mcp/',
    title: 'MCPとは？GitHub連携で何が変わるか',
    description:
      'MCPとは何か、AIエージェントとGitHub、Search Console、開発ワークフローをつなぐ意味を解説します。',
    eyebrow: 'Learn / MCP',
    h1: 'MCPとは？GitHub連携で何が変わるか',
    lede:
      'MCPとは、AIエージェントが外部ツールやデータに接続するための仕組みです。SEO改善では、GSCのSignalをGitHub PRへつなぐ導線として重要です。',
    primaryKeyword: 'MCPとは',
    ctaLabel: 'MCP GitHub連携を見る',
    ctaHref: '/growth/mcp-github/',
    schemaType: 'Article',
    sections: [
      {
        title: 'AIが文脈を持って動ける',
        body:
          'MCPにより、AIは単なるチャットではなく、GSC、GitHub、CMSなどの文脈を読みながら提案できます。',
      },
      {
        title: 'ただし安全境界が必要',
        body:
          '便利さだけでなく、権限、承認、監査ログ、rollbackを設計する必要があります。',
      },
    ],
    faq: [
      {
        question: 'MCPは必須ですか？',
        answer: '完全自動化には有効ですが、初期PoCは手動PRや限定連携から始めることもできます。',
      },
      {
        question: 'GitHubと何がつながりますか？',
        answer: '改善案をPRとして出し、差分をレビューしてからShipできます。',
      },
      {
        question: '安全性はどう担保しますか？',
        answer: '権限最小化、PR承認、監査ログ、rollbackを前提にします。',
      },
    ],
    related: [
      { label: 'MCP GitHub連携', href: '/growth/mcp-github/' },
      { label: 'GitHub連携', href: '/growth/integrations/github/' },
      { label: 'セキュリティ', href: '/growth/security/' },
    ],
  },
  {
    slug: 'search-console-mcp',
    path: '/growth/learn/mcp/search-console-mcp/',
    title: 'Search Console MCPでSEO改善を自動化する方法',
    description:
      'Search Console MCPを使い、GSCのクエリ、URL、CTR、順位からSEO改善案とPR候補を作る考え方を解説します。',
    eyebrow: 'Learn / MCP',
    h1: 'Search Console MCPでSEO改善を自動化する方法',
    lede:
      'Search Console MCPを使うと、GSCの検索データをAIが参照し、改善候補を会話やPR案に変換できます。重要なのは、データ取得後に実装へ接続することです。',
    primaryKeyword: 'Search Console MCP',
    ctaLabel: 'GSC連携を見る',
    ctaHref: '/growth/integrations/google-search-console/',
    schemaType: 'Article',
    sections: [
      {
        title: 'GSCデータをAIが読める形にする',
        body:
          'クエリ、ページ、CTR、順位、期間比較をAIが参照できれば、改善優先順位の整理が速くなります。',
      },
      {
        title: 'PR化まで設計する',
        body:
          '分析だけで止まらず、title修正、FAQ追加、内部リンク追加をPR候補へ落とします。',
      },
    ],
    faq: [
      {
        question: 'Search Console MCPだけでSEOは改善しますか？',
        answer: 'データ取得だけでは改善しません。改善案と実装PRまでつなぐ必要があります。',
      },
      {
        question: 'どのデータが重要ですか？',
        answer: '表示回数、CTR、平均掲載順位、URL別クエリ、期間比較が重要です。',
      },
      {
        question: 'PGAはどう使いますか？',
        answer: 'GSCをSignalとして使い、GitHub PRやLP改善へ接続します。',
      },
    ],
    related: [
      { label: 'Google Search Console連携', href: '/growth/integrations/google-search-console/' },
      { label: 'GSC改善自動化', href: '/growth/gsc-automation/' },
      { label: 'MCP GitHub連携', href: '/growth/mcp-github/' },
    ],
  },
  {
    slug: 'pmf-test-velocity',
    path: '/growth/learn/growth/pmf-test-velocity/',
    title: 'PMF検証で打席数を増やす方法',
    description:
      'PMF検証で重要な打席数を増やすために、64点の施策を速くShipし、SignalからLearnへつなぐ方法を解説します。',
    eyebrow: 'Learn / Growth',
    h1: 'PMF検証で打席数を増やす方法',
    lede:
      'PMF検証では、100点の施策を1か月かけるより、64点の施策を今日出して明日のデータを見る方が学習が速くなります。',
    primaryKeyword: 'PMF 検証 打席数',
    ctaLabel: 'AIグロースエージェントを見る',
    ctaHref: '/growth/ai-growth-agent/',
    schemaType: 'Article',
    sections: [
      {
        title: '打席数は実装速度で決まる',
        body:
          '仮説があっても、LP修正、記事公開、計測設定、デプロイが遅いと検証回数は増えません。',
      },
      {
        title: '64点で出してLearnする',
        body:
          '初期は美しさより、ユーザー反応を見られる十分な品質と速度を優先します。',
      },
    ],
    faq: [
      {
        question: '64点で出すとブランド毀損しませんか？',
        answer: '公開品質は担保しつつ、過剰な完璧主義で学習を止めないという意味です。',
      },
      {
        question: 'どんな施策が打席になりますか？',
        answer: 'LPの訴求変更、FAQ追加、比較表追加、SEO記事、CTA変更などです。',
      },
      {
        question: '効果はどう見ますか？',
        answer: 'GSC、GA4、CTAクリック、CV、AI回答内露出を見ます。',
      },
    ],
    related: [
      { label: 'AIグロースエージェント', href: '/growth/ai-growth-agent/' },
      { label: 'LP改善AI', href: '/growth/lp-optimization-ai/' },
      { label: 'スタートアップSEO', href: '/growth/startup-seo/' },
    ],
  },
];

export const allGrowthPages = [
  ...growthPages,
  integrationOverview,
  ...integrationPages,
  ...comparePages,
  ...learnArticles,
];

export const corporateRoutes = ['/', '/about/', '/services/', '/news/'];
export const learnClusterLabels: Record<string, string> = {
  aeo: 'AEO / AI検索',
  'startup-seo': 'スタートアップSEO',
  seo: 'SEO改善',
  mcp: 'MCP / GitHub',
  growth: 'Growth Loop',
};
export const learnClusterRoutes = [
  '/growth/learn/',
  '/growth/learn/aeo/',
  '/growth/learn/startup-seo/',
  '/growth/learn/seo/',
  '/growth/learn/mcp/',
  '/growth/learn/growth/',
];
export const indexableRoutes = [
  ...corporateRoutes,
  GROWTH_ROOT,
  '/growth/compare/',
  ...learnClusterRoutes,
  ...allGrowthPages.map((page) => page.path),
];
