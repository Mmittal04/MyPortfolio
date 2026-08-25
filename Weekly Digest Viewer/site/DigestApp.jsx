function waitForDigestData(){
  return new Promise((resolve)=>{
    if(window.__digestData) return resolve(window.__digestData);
    const id=setInterval(()=>{
      if(window.__digestData){clearInterval(id);resolve(window.__digestData);}
    },20);
  });
}

function DigestApp(){
  const { SiteHeader, TopicTabs, Button, IconButton, Tag } = window.WeeklyDigestDesignSystem_6fb441;
  const [topics,setTopics]=React.useState([]);
  const [slug,setSlug]=React.useState(null);
  const [digests,setDigests]=React.useState(null); // null while the current load is in flight
  const [loadToken,setLoadToken]=React.useState(0); // bump to force a fresh (uncached) reload

  React.useEffect(()=>{
    let cancelled=false;
    // digest-data.js is an ES module; index.html bridges its exports onto
    // window.__digestData via a native <script type="module"> so this
    // Babel-transpiled component never has to `import()` it directly (see
    // the comment in index.html for why that breaks under in-browser Babel).
    waitForDigestData().then(({TOPICS,loadAllDigests})=>{
      if(cancelled) return null;
      setTopics(TOPICS);
      setSlug((s)=>s||TOPICS[0].slug);
      return loadAllDigests(loadToken>0?{force:true}:undefined);
    }).then((result)=>{
      if(cancelled||!result) return;
      setDigests(result);
    }).catch((err)=>{
      // digest-data.js itself never throws (failures come back as
      // status:'error' per topic) -- this only fires if the module or the
      // dynamic import itself fails to load at all.
      if(cancelled) return;
      console.error('Failed to load digest-data.js', err);
    });
    return ()=>{cancelled=true;};
  },[loadToken]);

  React.useEffect(()=>{window.lucide&&window.lucide.createIcons();});

  function refresh(){setDigests(null);setLoadToken((k)=>k+1);}

  const result = digests && slug ? digests[slug] : null;
  const activeTopic = topics.find((t)=>t.slug===slug);
  const themes = result&&result.status==='ready' ? [...new Set(result.articles.flatMap((a)=>a.themes))] : [];

  return (
    <div style={{minHeight:'100vh',background:'var(--surface-page)'}}>
      <SiteHeader
        right={<div style={{display:'flex',gap:'var(--space-2)',alignItems:'center'}}>
          <Button variant="ghost" size="sm" onClick={refresh} iconLeft={<i data-lucide="rotate-cw" style={{width:14,height:14}}></i>}>Refresh</Button>
          <IconButton label="Source repository" variant="outline"
            onClick={()=>window.open('https://github.com/Mmittal04/MyPortfolio','_blank','noopener')}>
            <i data-lucide="bird" style={{width:16,height:16}}></i></IconButton>
        </div>} />

      <main style={{maxWidth:'var(--layout-max)',margin:'0 auto',padding:'var(--space-10) var(--layout-gutter) var(--space-24)'}}>
        <div style={{maxWidth:'var(--layout-reading)'}}>
          <h1 style={{font:'var(--type-display)',fontSize:'var(--text-3xl)',color:'var(--text-primary)',margin:'0 0 var(--space-3)',letterSpacing:'var(--tracking-tight)'}}>
            The week, summarised</h1>
          <p style={{font:'var(--type-body)',color:'var(--text-secondary)',margin:0,maxWidth:'var(--measure-prose)'}}>
            An automated pipeline reads the week's coverage across three topics, summarises each article, and pulls out the themes and entities that recur. Published every Sunday.</p>
        </div>

        {topics.length>0&&<TopicTabs topics={topics} active={slug} onChange={setSlug} style={{marginTop:'var(--space-10)'}} />}

        <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 232px',gap:'var(--space-10)',alignItems:'start',marginTop:'var(--space-8)'}}>
          {activeTopic&&(
            <DigestPanel
              result={result||{topic:activeTopic,status:'ready',runDate:null,articles:[],error:null}}
              loading={!result} />
          )}
          <aside style={{position:'sticky',top:'var(--space-6)',display:'grid',gap:'var(--space-6)'}}>
            <div>
              <div style={{font:'var(--type-label)',letterSpacing:'var(--tracking-caps)',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:'var(--space-3)'}}>Recurring themes</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'var(--space-2)'}}>
                {themes.map((t)=><Tag key={t} tone={slug}>{t}</Tag>)}
                {result&&themes.length===0&&<span style={{font:'var(--type-ui)',fontSize:'var(--text-xs)',color:'var(--text-muted)'}}>None this week</span>}
              </div>
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
