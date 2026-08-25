import * as React from 'react';

/** Loading placeholder matching ArticleCard's rhythm. Shimmer only — no spinners in this brand. */
export interface SkeletonArticleProps {
  /** How many placeholder cards. @default 3 */
  count?: number;
  style?: React.CSSProperties;
}
export declare function SkeletonArticle(props: SkeletonArticleProps): JSX.Element;
