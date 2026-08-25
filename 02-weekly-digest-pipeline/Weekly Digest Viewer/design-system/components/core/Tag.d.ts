import * as React from 'react';

/** Pill label for a digest theme. Topic tones tint with that topic's accent. */
export interface TagProps {
  /** @default "neutral" */
  tone?: 'neutral' | 'technology' | 'finance' | 'politics' | 'outline';
  /** @default "md" */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Tag(props: TagProps): JSX.Element;
