import React from 'react';

const base={font:'var(--type-ui)',display:'inline-flex',alignItems:'center',justifyContent:'center',gap:'var(--space-2)',borderRadius:'var(--radius-sm)',border:'1px solid transparent',cursor:'pointer',transition:'var(--transition-color),var(--transition-raise)',textDecoration:'none',whiteSpace:'nowrap'};
const sizes={sm:{padding:'6px 12px',fontSize:'var(--text-xs)'},md:{padding:'9px 16px',fontSize:'var(--text-sm)'},lg:{padding:'12px 22px',fontSize:'var(--text-base)'}};
const variants={
  primary:{background:'var(--accent-primary)',color:'var(--text-inverse)',borderColor:'var(--accent-primary)'},
  secondary:{background:'var(--surface-card)',color:'var(--text-primary)',borderColor:'var(--border-subtle)',boxShadow:'var(--shadow-card)'},
  ghost:{background:'transparent',color:'var(--text-accent)'},
  quiet:{background:'var(--surface-sunken)',color:'var(--text-body)'}
};
const hovers={
  primary:{background:'var(--accent-primary-hover)',borderColor:'var(--accent-primary-hover)'},
  secondary:{borderColor:'var(--border-strong)',boxShadow:'var(--shadow-raised)'},
  ghost:{background:'var(--surface-accent-soft)'},
  quiet:{background:'var(--sand-300)'}
};

export function Button({variant='primary',size='md',disabled=false,href,iconLeft,iconRight,onClick,style,children,...rest}){
  const [hover,setHover]=React.useState(false);
  const [press,setPress]=React.useState(false);
  const s={...base,...sizes[size],...variants[variant],...(hover&&!disabled?hovers[variant]:null),
    ...(press&&!disabled?{transform:'translateY(1px)'}:null),
    ...(disabled?{opacity:.45,cursor:'not-allowed',boxShadow:'none'}:null),...style};
  const Tag=href&&!disabled?'a':'button';
  return (
    <Tag href={href} onClick={disabled?undefined:onClick} disabled={Tag==='button'?disabled:undefined} style={s}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>{setHover(false);setPress(false);}}
      onMouseDown={()=>setPress(true)} onMouseUp={()=>setPress(false)} {...rest}>
      {iconLeft}{children}{iconRight}
    </Tag>
  );
}
