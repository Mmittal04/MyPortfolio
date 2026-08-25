function DigestApp(){
  const { SiteHeader, TopicTabs, Button, IconButton, Tag } = window.WeeklyDigestDesignSystem_6fb441;
  const [slug,setSlug]=React.useState('finance');
  const [loading,setLoading]=React.useState(false);
  const [errorMode,setErrorMode]=React.useState(false);
  const result=errorMode&&slug==='politics'?window.ERROR_SAMPLE:window.DIGESTS[slug];

  function refresh(){setLoading(true);setTimeout(()=>setLoading(false),1100);}
  React.useEffect(()=>{window.lucide&&window.lucide.createIcons();});

  return (
    <div style={{minHeight:'100vh',background:'var(--surface-page)'}}>
      <SiteHeader
        right={<div style={{display:'flex',gap:'var(--space-2)',alignItems:'center'}}>
          <Button variant="ghost" size="sm" onClick={refresh} iconLeft={<i data-lucide="rotate-cw" style={{width:14,height:14}}></i>}>Refresh</Button>
          <IconButton label="Source repository" variant="outline"><i data-lucide="bird" style={{width:16,height:16}}></i></IconButton>
        </div>} />

      <main style={{maxWidth:'var(--layout-max)',margin:'0 auto',padding:'var(--space-10) var(--layout-gutter) var(--space-24)'}}>
        <div style={{maxWidth:'var(--layout-reading)'}}>
          <h1 style={{font:'var(--type-display)',fontSize:'var(--text-3xl)',color:'var(--text-primary)',margin:'0 0 var(--space-3)',letterSpacing:'var(--tracking-tight)'}}>
            The week, summarised</h1>
          <p style={{font:'var(--type-body)',color:'var(--text-secondary)',margin:0,maxWidth:'var(--measure-prose)'}}>
            An automated pipeline reads the week's coverage across three topics, summarises each article, and pulls out the themes and entities that recur. Published every Monday.</p>
        </div>

        <TopicTabs topics={window.TOPICS} active={slug} onChange={setSlug} style={{marginTop:'var(--space-10)'}} />

        <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 232px',gap:'var(--space-10)',alignItems:'start',marginTop:'var(--space-8)'}}>
          <DigestPanel result={result} loading={loading} />
          <aside style={{position:'sticky',top:'var(--space-6)',display:'grid',gap:'var(--space-6)'}}>
            <div>
              <div style={{font:'var(--type-label)',letterSpacing:'var(--tracking-caps)',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:'var(--space-3)'}}>Recurring themes</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'var(--space-2)'}}>
                {[...new Set((window.DIGESTS[slug].articles||[]).flatMap(a=>a.themes))].map(t=><Tag key={t} tone={slug}>{t}</Tag>)}
                {(window.DIGESTS[slug].articles||[]).length===0&&<span style={{font:'var(--type-ui)',fontSize:'var(--text-xs)',color:'var(--text-muted)'}}>None this week</span>}
              </div>
            </div>
            <div>
              <div style={{font:'var(--type-label)',letterSpacing:'var(--tracking-caps)',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:'var(--space-3)'}}>Digest states</div>
              <div style={{display:'grid',gap:'var(--space-2)'}}>
                <Button variant={loading?'primary':'quiet'} size="sm" onClick={refresh}>Loading</Button>
                <Button variant={errorMode?'primary':'quiet'} size="sm" onClick={()=>{setErrorMode(!errorMode);setSlug('politics');}}>Rate-limited</Button>
                <Button variant="quiet" size="sm" onClick={()=>{setErrorMode(false);setSlug('politics');}}>Empty week</Button>
              </div>
              <p style={{font:'var(--type-ui)',fontSize:'var(--text-2xs)',color:'var(--text-muted)',marginTop:'var(--space-3)',lineHeight:1.5}}>
                Demo controls — not part of the shipped site.</p>
            </div>
          </aside>
        </div>
      </main>

      <footer style={{borderTop:'1px solid var(--border-subtle)',background:'var(--surface-raised)'}}>
        <div style={{maxWidth:'var(--layout-max)',margin:'0 auto',padding:'var(--space-6) var(--layout-gutter)',
          display:'flex',justifyContent:'space-between',font:'var(--type-ui)',fontSize:'var(--text-xs)',color:'var(--text-muted)'}}>
          <span>Maan's Weekly Digest</span>
          <span style={{fontFamily:'var(--font-mono)'}}>Generated from MyPortfolio / 02-weekly-digest-pipeline</span>
        </div>
      </footer>
    </div>
  );
}
window.DigestApp=DigestApp;
