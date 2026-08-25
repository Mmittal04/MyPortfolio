import * as React from 'react';

/** Panel header for one topic's digest: name, run date, article count. */
export interface DigestMetaProps {
  topicName: string;
  /** ISO date from `DigestResult.runDate` (`YYYY-MM-DD`); rendered long-form. */
  runDate?: string | null;
  count?: number;
  style?: React.CSSProperties;
}
export declare function DigestMeta(props: DigestMetaProps): JSX.Element;
