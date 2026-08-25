function DigestPanel({result,loading}){
  const { DigestMeta, ArticleList, EmptyState, ErrorNotice, SkeletonArticle, Button, Divider } = window.WeeklyDigestDesignSystem_6fb441;
  const slug=result.topic.slug;
  if(loading) return (
    <div>
      <DigestMeta topicName={result.topic.name} />
      <div style={{marginTop:'var(--space-6)'}}><SkeletonArticle count={3} /></div>
    </div>
  );
  return (
    <div>
      <DigestMeta topicName={result.topic.name} runDate={result.runDate}
        count={result.status==='ready'?result.articles.length:undefined} />
      <Divider spacing="var(--space-5)" />
      {result.status==='ready'&&<ArticleList articles={result.articles} topic={slug} />}
      {result.status==='empty'&&<EmptyState detail={'The pipeline ran and found nothing new for '+result.topic.name.toLowerCase()+' this week.'}
        action={<Button variant="secondary" size="sm">Browse last week</Button>} />}
      {result.status==='error'&&<ErrorNotice kind={result.error.kind} message={result.error.message}
        action={<Button variant="secondary" size="sm">Try again</Button>} />}
    </div>
  );
}
window.DigestPanel=DigestPanel;
