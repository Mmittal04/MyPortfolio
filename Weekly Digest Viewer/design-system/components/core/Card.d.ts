import * as React from 'react';

/** Warm off-white panel with a hairline border and a soft two-layer shadow. */
export interface CardProps {
  /** @default "div" */
  as?: keyof JSX.IntrinsicElements;
  /** @default "var(--space-6)" */
  padding?: string;
  /** Lifts 1px and deepens its shadow on hover. */
  interactive?: boolean;
  /** Optional 3px left edge — pass a topic accent token to colour-code by topic. */
  accent?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Card(props: CardProps): JSX.Element;
