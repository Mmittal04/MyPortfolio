import * as React from 'react';

/** Hairline rule, optionally with a small uppercase section label on the left. */
export interface DividerProps {
  label?: string;
  /** Vertical margin. @default "var(--space-6)" */
  spacing?: string;
  style?: React.CSSProperties;
}
export declare function Divider(props: DividerProps): JSX.Element;
