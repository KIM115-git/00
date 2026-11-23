/**
 * Cloudflare Pages Function：按短码读取已生成的生日站点配置（GET /api/sites/:id）。
 */

const ID_RE = /^[A-Za-z0-9]{6,16}$/;

export async function onRequestGet({ params, env }) {
  const id = params && params.id ? String(params.id) : "";
  if (!ID_RE.test(id)) {
    return new Response("Not Found", { status: 404 });
  }
  if (!env || !env.SITES) {
    return Response.json(
      { ok: false, error: "KV SITES 未绑定" },
      { status: 503, headers: { "cache-control": "no-store" } }
    );
  }

  const data = await env.SITES.get(id);
  if (!data) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(data, {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
