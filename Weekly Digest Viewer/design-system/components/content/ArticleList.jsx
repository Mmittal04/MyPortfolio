import React from 'react';
import { ArticleCard } from './ArticleCard.jsx';

export function ArticleList({articles=[],topic='neutral',numbered=true,style}){
  return (
    <div style={{display:'grid',gap:'var(--space-4)',...style}}>
      {articles.map((a,i)=><ArticleCard key={a.link||i} article={a} topic={topic} index={numbered?i:undefined} feedUrl={a.feedUrl} />)}
    </div>
  );
}
