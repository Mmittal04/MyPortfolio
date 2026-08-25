import React from 'react';
import { Badge } from '../core/Badge.jsx';

const KIND_LABEL={not_found:'Not published yet',rate_limited:'Rate limited',network:'Network'};

export function ErrorNotice({kind='network',message,action,style}){
  const soft=kind==='rate_limited';
  return (
    <div role="status" style={{border:'1px solid '+(soft?'var(--status-notice-fg)':'var(--status-error-fg)'),
      background:soft?'var(--status-notice-bg)':'var(--status-error-bg)',borderRadius:'var(--radius-md)',
      padding:'var(--space-5) var(--space-6)',display:'flex',gap:'var(--space-4)',alignItems:'flex-start',...style}}>
      <Badge tone={soft?'warning':'danger'} style={{flex:'0 0 auto',marginTop:2}}>{KIND_LABEL[kind]||'Error'}</Badge>
      <div>
        <p style={{margin:0,font:'var(--type-body)',fontSize:'var(--text-sm)',color:'var(--text-body)'}}>{message}</p>
        {action&&<div style={{marginTop:'var(--space-3)'}}>{action}</div>}
      </div>
    </div>
  );
}
