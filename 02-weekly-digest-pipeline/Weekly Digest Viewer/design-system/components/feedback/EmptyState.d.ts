import * as React from 'react';

/** For `status: 'empty'` — a quiet, non-alarming panel. Never styled as an error. */
export interface EmptyStateProps {
  /** @default "No new articles this week." */
  title?: string;
  detail?: string;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function EmptyState(props: EmptyStateProps): JSX.Element;
