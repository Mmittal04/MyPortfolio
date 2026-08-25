import React from 'react';

function fmt(iso){
  if(!iso) return null;
  const d=new Date(iso+'T00:00:00');
  return d.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
}

export function DigestMeta({topicName,runDate,count,style}){
  return (
    <div style={{display:'flex',alignItems:'baseline',gap:'var(--space-3)',flexWrap:'wrap',...style}}>
      <h2 style={{font:'var(--type-title)',color:'var(--text-primary)',margin:0,letterSpacing:'var(--tracking-tight)'}}>{topicName}</h2>
      {runDate&&<span style={{font:'var(--type-ui)',fontSize:'var(--text-xs)',color:'var(--text-muted)',
        fontFamily:'var(--font-mono)'}}>{fmt(runDate)}</span>}
      {typeof count==='number'&&<span style={{font:'var(--type-ui)',fontSize:'var(--text-xs)',color:'var(--text-muted)'}}>
        {count} {count===1?'article':'articles'}</span>}
    </div>
  );
}
