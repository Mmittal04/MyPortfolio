import * as React from 'react';

/**
 * One article from a digest: title (links to the source), summary, themes, entities.
 * Double-clicking the card opens the feed it was summarised from.
 * @startingPoint section="Content" subtitle="Digest article card with themes and entities" viewport="700x300"
 */
export interface ArticleCardProps {
  article: {
    title: string;
    link: string;
    summary: string;
    themes?: string[];
    entities?: string[];
    /** Optional source feed URL; used by the double-click shortcut. */
    feedUrl?: string;
  };
  /** Topic slug — drives the accent edge and tag tint. @default "neutral" */
  topic?: 'technology' | 'finance' | 'politics' | 'neutral';
  /** Zero-based position; renders a mono "01" index when set. */
  index?: number;
  /** Feed opened on double-click. Falls back to `article.feedUrl`, then `article.link`. */
  feedUrl?: string;
  style?: React.CSSProperties;
}
export declare function ArticleCard(props: ArticleCardProps): JSX.Element;
