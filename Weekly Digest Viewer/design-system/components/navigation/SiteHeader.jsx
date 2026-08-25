import React from 'react';

export function SiteHeader({title="Maan's Weekly Digest",tagline,right,style}){
  return (
    <header style={{borderBottom:'1px solid var(--border-subtle)',background:'var(--surface-raised)',...style}}>
      <div style={{maxWidth:'var(--layout-max)',margin:'0 auto',padding:'var(--space-5) var(--layout-gutter)',
        display:'flex',alignItems:'baseline',gap:'var(--space-4)'}}>
        <span style={{font:'var(--type-headline)',color:'var(--text-primary)',letterSpacing:'var(--tracking-tight)'}}>{title}</span>
        {tagline&&<span style={{font:'var(--type-ui)',fontSize:'var(--text-xs)',color:'var(--text-muted)'}}>{tagline}</span>}
        <span style={{flex:1}} />
        {right}
      </div>
    </header>
  );
}
