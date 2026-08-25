import React from 'react';

export function Divider({label,spacing='var(--space-6)',style}){
  if(!label) return <hr style={{border:0,borderTop:'1px solid var(--border-subtle)',margin:spacing+' 0',...style}} />;
  return (
    <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)',margin:spacing+' 0',...style}}>
      <span style={{font:'var(--type-label)',letterSpacing:'var(--tracking-caps)',textTransform:'uppercase',color:'var(--text-muted)'}}>{label}</span>
      <span style={{flex:1,height:1,background:'var(--border-subtle)'}} />
    </div>
  );
}
