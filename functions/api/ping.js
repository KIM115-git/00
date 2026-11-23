/**
 * Cloudflare Pages Function：健康检查接口（GET /api/ping）。
 * 用于让前端第 9 关「生成地址」卡片自动检测当前站点是否已启用后端上传能力。
 */
export async function onRequestGet({ env }) {
  return Response.json(
    {
      ok: true,
      mode: "cloudflare",
      kvReady: Boolean(env && env.SITES),
    },
    {
      headers: {
        "cache-control": "no-store",
      },
    }
  );
}
