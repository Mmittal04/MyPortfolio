import React from 'react';

const tones={
  neutral:{bg:'var(--surface-sunken)',fg:'var(--text-secondary)',bd:'transparent'},
  technology:{bg:'var(--topic-technology-soft)',fg:'var(--indigo-700)',bd:'transparent'},
  finance:{bg:'var(--topic-finance-soft)',fg:'var(--teal-700)',bd:'transparent'},
  politics:{bg:'var(--topic-politics-soft)',fg:'var(--clay-800)',bd:'transparent'},
  outline:{bg:'transparent',fg:'var(--text-secondary)',bd:'var(--border-subtle)'}
};

export function Tag({tone='neutral',size='md',style,children,...rest}){
  const t=tones[tone]||tones.neutral;
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:'var(--space-1)',
      font:'var(--type-ui)',fontSize:size==='sm'?'var(--text-2xs)':'var(--text-xs)',
      padding:size==='sm'?'2px 8px':'3px 10px',borderRadius:'var(--radius-pill)',
      background:t.bg,color:t.fg,border:'1px solid '+t.bd,...style}} {...rest}>{children}</span>
  );
}
