import React from 'react';
import { Card } from '../core/Card.jsx';
import { Tag } from '../core/Tag.jsx';

export function ArticleCard({article,topic='neutral',index,feedUrl,style}){
  const {title,link,summary,themes=[],entities=[]}=article||{};
  const source=feedUrl||article&&article.feedUrl||link;
  const openSource=()=>{if(source)window.open(source,'_blank','noopener');};
  return (
    <Card as="article" interactive accent={topic!=='neutral'?'var(--topic-'+topic+')':undefined}
      onDoubleClick={openSource} title="Double-click to open the source feed" style={style}>
      {typeof index==='number'&&<div style={{font:'var(--type-label)',fontFamily:'var(--font-mono)',
        letterSpacing:'var(--tracking-wide)',color:'var(--text-muted)',marginBottom:'var(--space-2)'}}>
        {String(index+1).padStart(2,'0')}</div>}
      <h3 style={{margin:'0 0 var(--space-3)',font:'var(--type-headline)',fontSize:'var(--text-lg)',color:'var(--text-primary)'}}>
        <a href={link} target="_blank" rel="noopener" style={{color:'inherit',textDecoration:'none'}}>{title}</a>
      </h3>
      <p style={{margin:'0 0 var(--space-4)',font:'var(--type-body)',color:'var(--text-body)',maxWidth:'var(--measure-prose)'}}>{summary}</p>
      {(themes.length>0||entities.length>0)&&(
        <div style={{display:'flex',flexWrap:'wrap',gap:'var(--space-2)',alignItems:'center'}}>
          {themes.map((t)=><Tag key={t} tone={topic}>{t}</Tag>)}
          {entities.length>0&&<span style={{font:'var(--type-ui)',fontSize:'var(--text-2xs)',color:'var(--text-muted)',marginLeft:'var(--space-1)'}}>
            {entities.join(' · ')}</span>}
        </div>
      )}
    </Card>
  );
}
