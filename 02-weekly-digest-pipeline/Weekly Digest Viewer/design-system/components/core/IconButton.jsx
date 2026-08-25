import React from 'react';

export function IconButton({label,size='md',variant='ghost',disabled=false,onClick,style,children,...rest}){
  const [hover,setHover]=React.useState(false);
  const dim=size==='sm'?28:size==='lg'?44:36;
  const bg=variant==='solid'?'var(--accent-primary)':variant==='outline'?'var(--surface-card)':'transparent';
  return (
    <button aria-label={label} title={label} onClick={disabled?undefined:onClick} disabled={disabled}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{width:dim,height:dim,display:'inline-flex',alignItems:'center',justifyContent:'center',
        borderRadius:'var(--radius-sm)',cursor:disabled?'not-allowed':'pointer',opacity:disabled?.4:1,
        border:variant==='outline'?'1px solid var(--border-subtle)':'1px solid transparent',
        background:hover&&!disabled?(variant==='solid'?'var(--accent-primary-hover)':'var(--surface-sunken)'):bg,
        color:variant==='solid'?'var(--text-inverse)':'var(--text-secondary)',
        transition:'var(--transition-color)',...style}} {...rest}>
      {children}
    </button>
  );
}
