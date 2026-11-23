/**
 * Cloudflare Pages Function：兼容旧埋点请求，静默返回 204 避免 404/405。
 */
export async function onRequestPost() {
  return new Response(null, { status: 204 });
}
