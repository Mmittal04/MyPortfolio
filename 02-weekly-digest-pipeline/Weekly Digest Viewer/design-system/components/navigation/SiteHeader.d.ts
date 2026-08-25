import * as React from 'react';

/**
 * Site masthead. The brand has no logo mark — the name is set in Literata as the mark.
 * @startingPoint section="Navigation" subtitle="Masthead with wordmark and tagline" viewport="700x110"
 */
export interface SiteHeaderProps {
  /** @default "Maan's Weekly Digest" */
  title?: string;
  tagline?: string;
  /** Right-aligned slot — usually an IconButton or a small Button. */
  right?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function SiteHeader(props: SiteHeaderProps): JSX.Element;
