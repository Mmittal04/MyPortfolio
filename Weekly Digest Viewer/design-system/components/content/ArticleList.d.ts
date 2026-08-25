import * as React from 'react';

/** Vertical stack of ArticleCards with the standard 16px rhythm. */
export interface ArticleListProps {
  articles: { title: string; link: string; summary: string; themes?: string[]; entities?: string[] }[];
  topic?: 'technology' | 'finance' | 'politics' | 'neutral';
  /** Show mono index numbers. @default true */
  numbered?: boolean;
  style?: React.CSSProperties;
}
export declare function ArticleList(props: ArticleListProps): JSX.Element;
