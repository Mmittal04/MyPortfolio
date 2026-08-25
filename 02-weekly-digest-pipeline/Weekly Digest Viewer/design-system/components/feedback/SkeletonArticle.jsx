import React from 'react';

const bar=(w,h,mb)=>({width:w,height:h,marginBottom:mb,borderRadius:'var(--radius-xs)',
  background:'linear-gradient(90deg,var(--sand-200) 0%,var(--sand-100) 50%,var(--sand-200) 100%)',
  backgroundSize:'200% 100%',animation:'wd-shimmer 1.4s var(--ease-in-out) infinite'});

export function SkeletonArticle({count=3,style}){
  return (
    <div style={{display:'grid',gap:'var(--space-4)',...style}}>
      <style>{'@keyframes wd-shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}'}</style>
      {Array.from({length:count}).map((_,i)=>(
        <div key={i} style={{background:'var(--surface-card)',border:'1px solid var(--border-hairline)',
          borderRadius:'var(--radius-md)',padding:'var(--space-6)',boxShadow:'var(--shadow-card)'}}>
          <div style={bar('64px','10px','var(--space-3)')} />
          <div style={bar('70%','18px','var(--space-3)')} />
          <div style={bar('100%','12px','var(--space-2)')} />
          <div style={bar('88%','12px','var(--space-4)')} />
          <div style={{display:'flex',gap:'var(--space-2)'}}>
            <div style={bar('72px','20px',0)} /><div style={bar('96px','20px',0)} />
          </div>
        </div>
      ))}
    </div>
  );
}
