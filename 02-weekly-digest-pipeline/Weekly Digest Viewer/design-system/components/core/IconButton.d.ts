import * as React from 'react';

/** Square icon-only control. `label` is required — it becomes the accessible name and tooltip. */
export interface IconButtonProps {
  label: string;
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** @default "ghost" */
  variant?: 'ghost' | 'outline' | 'solid';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  /** The glyph — a Lucide <i data-lucide> or inline SVG. */
  children?: React.ReactNode;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
