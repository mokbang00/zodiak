export type Period = 'today' | 'tomorrow' | 'week' | 'month' | 'year';
export type ContentState = 'published' | 'unavailable' | 'expired' | 'failed' | 'draft';
export type Scenario = 'normal' | 'unavailable' | 'failed' | 'expired' | 'draft' | 'empty-articles';
export interface Zodiac { slug: string; name: string; asset: string; dateRangeStart: string; dateRangeEnd: string; range: string; element: string; profile: string; }
export interface Forecast { id: string; zodiacSlug: string; period: Period; periodStart: string; periodEnd: string; summary: string; sections: { key: string; heading: string; body: string[] }[]; author: string; publishedAt: string; updatedAt: string; status: ContentState; image: string; }
export interface EditorialArticle { id: string; title: string; url: string; publishedAt: string; image?: string; description: string; category: 'latest' | 'evergreen'; demoDestination: boolean; }
export interface PageConfig { locale: string; timezone: string; referenceDate: string; publisher: string; baseUrl: string; }
