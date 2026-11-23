/**
 * Cloudflare Pages Function：保存配置并生成短码地址（POST /api/sites）。
 * 需要在 Cloudflare Pages 项目设置 -> Bindings 中绑定 KV Namespace，变量名填 SITES。
 */

const CHARS = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
const MAX_BYTES = 24 * 1024 * 1024; // Cloudflare KV 单条上限 25 MiB，留出安全余量
const TTL_SECONDS = 60 * 86400; // 默认保存 60 天

function makeId(len = 8) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  let out = "";
  for (let i = 0; i < len; i++) {
    out += CHARS[arr[i] % CHARS.length];
  }
  return out;
}

export async function onRequestPost({ request, env }) {
  if (!env || !env.SITES) {
    return Response.json(
      {
        ok: false,
        error: "尚未绑定 Cloudflare KV（请到 Cloudflare Pages 设置 -> Bindings 添加 KV，变量名填 SITES）",
      },
      { status: 503, headers: { "cache-control": "no-store" } }
    );
  }

  let raw = "";
  try {
    raw = await request.text();
  } catch (e) {
    return Response.json({ ok: false, error: "读取上传数据失败" }, { status: 400 });
  }

  if (!raw || raw.length > MAX_BYTES) {
    return Response.json({ ok: false, error: "too_big" }, { status: 413 });
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return Response.json({ ok: false, error: "配置数据格式异常" }, { status: 400 });
  }

  if (!parsed || !Array.isArray(parsed.segs) || parsed.segs.length === 0) {
    return Response.json({ ok: false, error: "至少需要保留 1 个关卡" }, { status: 400 });
  }

  // 强制关闭编辑模式标记，保证对方打开链接时为纯播放模式
  for (const seg of parsed.segs) {
    if (seg && seg.cfg && typeof seg.cfg === "object") {
      seg.cfg._editMode = false;
    }
  }
  if ("rawState" in parsed) {
    delete parsed.rawState;
  }

  const id = makeId(8);
  await env.SITES.put(id, JSON.stringify(parsed), { expirationTtl: TTL_SECONDS });

  return Response.json(
    { ok: true, id },
    { status: 200, headers: { "cache-control": "no-store" } }
  );
}
