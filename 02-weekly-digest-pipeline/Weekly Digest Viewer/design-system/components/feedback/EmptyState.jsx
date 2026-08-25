import React from 'react';

export function EmptyState({title='No new articles this week.',detail,action,style}){
  return (
    <div style={{border:'1px dashed var(--border-strong)',borderRadius:'var(--radius-md)',
      background:'var(--surface-raised)',padding:'var(--space-10) var(--space-6)',textAlign:'center',...style}}>
      <p style={{margin:0,font:'var(--type-headline)',fontSize:'var(--text-md)',color:'var(--text-secondary)'}}>{title}</p>
      {detail&&<p style={{margin:'var(--space-2) 0 0',font:'var(--type-ui)',fontSize:'var(--text-sm)',color:'var(--text-muted)'}}>{detail}</p>}
      {action&&<div style={{marginTop:'var(--space-5)'}}>{action}</div>}
    </div>
  );
}
