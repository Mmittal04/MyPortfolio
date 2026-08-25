import React from 'react';

export function Badge({tone='neutral',style,children,...rest}){
  const map={neutral:['var(--text-secondary)','var(--border-subtle)'],accent:['var(--clay-700)','var(--clay-300)'],
    info:['var(--indigo-600)','var(--indigo-300)'],success:['var(--teal-600)','var(--teal-300)'],
    warning:['var(--amber-500)','var(--amber-500)'],danger:['var(--rust-600)','var(--rust-600)']};
  const [fg,bd]=map[tone]||map.neutral;
  return <span style={{display:'inline-flex',alignItems:'center',gap:'6px',font:'var(--type-label)',
    letterSpacing:'var(--tracking-caps)',textTransform:'uppercase',padding:'3px 8px',
    borderRadius:'var(--radius-xs)',color:fg,border:'1px solid '+bd,background:'transparent',...style}} {...rest}>{children}</span>;
}
