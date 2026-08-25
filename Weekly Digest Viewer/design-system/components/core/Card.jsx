import React from 'react';

export function Card({as='div',padding='var(--space-6)',interactive=false,accent,style,children,...rest}){
  const [hover,setHover]=React.useState(false);
  const El=as;
  return (
    <El onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{background:'var(--surface-card)',border:'1px solid var(--border-hairline)',
        borderLeft:accent?'3px solid '+accent:'1px solid var(--border-hairline)',
        borderRadius:'var(--radius-md)',padding,
        boxShadow:interactive&&hover?'var(--shadow-raised)':'var(--shadow-card)',
        transform:interactive&&hover?'translateY(-1px)':'none',
        transition:'var(--transition-raise)',...style}} {...rest}>{children}</El>
  );
}
