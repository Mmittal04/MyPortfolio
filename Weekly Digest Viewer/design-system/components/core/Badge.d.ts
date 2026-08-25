import * as React from 'react';

/** Small uppercase status marker — entity chips, "new", run-state labels. */
export interface BadgeProps {
  /** @default "neutral" */
  tone?: 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Badge(props: BadgeProps): JSX.Element;
