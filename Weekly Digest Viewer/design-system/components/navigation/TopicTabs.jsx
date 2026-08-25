import React from 'react';

const ACCENT={technology:'var(--topic-technology)',finance:'var(--topic-finance)',politics:'var(--topic-politics)'};

export function TopicTabs({topics=[],active,onChange,style}){
  return (
    <div role="tablist" style={{display:'flex',gap:'var(--space-6)',borderBottom:'1px solid var(--border-subtle)',...style}}>
      {topics.map((t)=>{
        const on=t.slug===active;
        const accent=ACCENT[t.slug]||'var(--accent-primary)';
        return (
          <button key={t.slug} role="tab" aria-selected={on} onClick={()=>onChange&&onChange(t.slug)}
            style={{appearance:'none',background:'none',border:0,cursor:'pointer',padding:'0 0 12px',
              font:'var(--type-ui)',fontSize:'var(--text-sm)',letterSpacing:'var(--tracking-wide)',
              color:on?'var(--text-primary)':'var(--text-muted)',
              boxShadow:on?'inset 0 -2px 0 '+accent:'none',
              transition:'var(--transition-color)'}}>{t.name}</button>
        );
      })}
    </div>
  );
}
