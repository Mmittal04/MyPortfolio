import * as React from 'react';

/**
 * The digest's primary navigation: one tab per topic, underlined in that topic's accent.
 * @startingPoint section="Navigation" subtitle="Topic tab bar with per-topic accents" viewport="700x120"
 */
export interface TopicTabsProps {
  /** In pipeline order — matches `TOPICS` from digest-data.js. */
  topics: { slug: string; name: string }[];
  /** Slug of the selected topic. */
  active: string;
  onChange?: (slug: string) => void;
  style?: React.CSSProperties;
}
export declare function TopicTabs(props: TopicTabsProps): JSX.Element;
