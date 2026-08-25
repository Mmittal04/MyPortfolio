import * as React from 'react';

/**
 * Primary action control. Clay fill for the one real action on a view; secondary
 * and ghost for everything else.
 * @startingPoint section="Core" subtitle="Button variants, sizes and states" viewport="700x150"
 */
export interface ButtonProps {
  /** Visual weight. @default "primary" */
  variant?: 'primary' | 'secondary' | 'ghost' | 'quiet';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Renders as an <a> when set. */
  href?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
