import * as React from 'react';

/** For `status: 'error'` — shows `error.message` verbatim, tinted by `error.kind`. */
export interface ErrorNoticeProps {
  /** From `DigestResult.error.kind`. @default "network" */
  kind?: 'not_found' | 'rate_limited' | 'network';
  /** From `DigestResult.error.message` — pass it through unedited. */
  message: string;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function ErrorNotice(props: ErrorNoticeProps): JSX.Element;
