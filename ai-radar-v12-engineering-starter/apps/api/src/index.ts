export interface Env { DB?: D1Database }
const json = (value: unknown, status=200) => new Response(JSON.stringify(value), {status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
export default {
 async fetch(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname==='/api/v1/health' && request.method==='GET') return json({ok:true, environment:'preview', databaseConfigured:!!env.DB});
  // Only read-only public data endpoints are exposed by this starter.
  if (url.pathname==='/api/v1/articles' && request.method==='GET') {
   if (!env.DB) return json({error:'staging_database_not_configured'},503);
   const limit=Math.min(50,Math.max(1,Number(url.searchParams.get('limit')||20)||20));
   const result=await env.DB.prepare('SELECT id, title, summary, url, source_id, language, published_at FROM articles WHERE published = 1 ORDER BY published_at DESC LIMIT ?').bind(limit).all();
   return json({items:result.results});
  }
  if (request.method!=='GET'&&request.method!=='HEAD') return json({error:'write_methods_disabled_until_auth_implemented'},403);
  return json({error:'not_found'},404);
 }
} satisfies ExportedHandler<Env>;
