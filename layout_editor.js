(function(){
  "use strict";
  if (window.__LE_INIT) return;
  window.__LE_INIT = true;

  var CFG = window.CFG || {};
  var LCFG = CFG._layout || { overrides: {}, added: [] };
  var overrides = LCFG.overrides || {};
  var added = (LCFG.added || []).slice();
  var editMode = !!CFG._editMode;
  var selectedId = null;

  var NAME_MAP = {
    "o/closed.webp": "第1关·米奇信封生日封面",
    "open_cover": "第1关·米奇信封生日封面",
    "k/flags.webp": "米奇头三角拉旗",
    "fused/bunting.webp": "顶部米奇拉旗",
    "c/bunting.webp": "顶部米奇拉旗",
    "c/mickey_stand.webp": "左下角经典米奇",
    "c/cat.webp": "纸条贴纸·魔法师米奇",
    "c/cakest.webp": "纸条贴纸·米妮蝴蝶结",
    "c/hat.webp": "蛋糕顶·米奇魔法帽",
    "c/stick.webp": "蛋糕蜡烛",
    "c/flame.webp": "蜡烛火苗",
    "c/title.webp": "结尾手写标题",
    "k/starGoldBig.webp": "贴纸·手绘黑米奇头",
    "k/crown.webp": "贴纸·米奇吹喇叭",
    "k/starDenim.webp": "贴纸·米妮波点蝴蝶结",
    "k/starNavy.webp": "贴纸·魔法米奇全身",
    "k/hatY.webp": "贴纸·魔法师米奇头像",
    "k/fav.webp": "字牌·米奇 HAPPY BIRTH",
    "k/hbs.webp": "字牌·米奇 HAPPY BIRTH",
    "k/hbk.webp": "字牌·Happy Birthday",
    "k/starBlue.webp": "贴纸·米奇白手套",
    "k/starGold.webp": "贴纸·米妮波点裙",
    "k/starRed.webp": "贴纸·米奇红短裤",
    "k/starFelt.webp": "贴纸·经典站姿米奇",
    "k/starDoodle.webp": "贴纸·米奇大黄鞋",
    "k/cupcake.webp": "贴纸·米奇巧克力雪糕",
    "k/heart.webp": "贴纸·黄蓝米奇气球",
    "k/bow.webp": "贴纸·米妮蝴蝶结",
    "k/bear.webp": "贴纸·经典米奇",
    "k/disco.webp": "贴纸·米奇三色气球",
    "k/discoR.webp": "贴纸·马卡龙气球束",
    "k/cstar.webp": "贴纸·城堡拍立得",
    "k/cstar2.webp": "贴纸·小飞象",
    "n/cake.webp": "生日蛋糕",
    "n/S2.webp": "年龄数字·手绘红2",
    "n/S1.webp": "年龄数字·银色1",
    "d/hatA.webp": "左帽子·米奇魔法帽",
    "d/hatB.webp": "右帽子·红条纹派对帽",
    "d/hat1.webp": "道具·米奇魔法帽",
    "d/hat2.webp": "道具·米妮蝴蝶结",
    "d/cam.webp": "宝丽来拍立得相机",
    "d/photo.webp": "拍立得内寿星照片",
    "d/creamcake.webp": "奶油生日蛋糕",
    "d/mugs.webp": "干杯啤酒杯",
    "d/body.webp": "礼盒盒身",
    "d/lid.webp": "礼盒盒盖",
    "d/band.webp": "礼盒丝带",
    "d/bow.webp": "礼盒蝴蝶结",
    "d/dd0.webp": "涂鸦·黄蓝米奇气球",
    "d/dd2.webp": "涂鸦·手绘米奇头",
    "d/dd3.webp": "涂鸦·米妮蝴蝶结",
    "d/dd6.webp": "涂鸦·米奇白手套",
    "d/dd7.webp": "涂鸦·米奇红短裤",
    "d/dd9.webp": "涂鸦·米奇黄鞋",
    "d/dd11.webp": "涂鸦·魔法师米奇",
    "f/can.webp": "富士胶卷罐",
    "f/leader.webp": "胶卷片头",
    "e/plane.webp": "旅行小飞机",
    "e/boarding.webp": "登机牌底图",
    "e/ticket.webp": "机票底图",
    "e/passport.webp": "护照封面",
    "r/train.webp": "旅行小火车",
    "q11/ticket.webp": "米奇生日刮刮乐底卡",
    "q11/love.webp": "米奇复古老虎机",
    "q11/lv_stick.webp": "老虎机拉杆",
    "q11/lv_knob.webp": "老虎机红球头",
    "q11/mickey_badge.webp": "奖券米奇探头立绘"
  };

  function getStage(){
    return document.getElementById("stage") || document.getElementById("wrap");
  }

  function shortSrc(u){
    if (!u) return "";
    if (u.indexOf("data:") === 0) return "自定义上传图片";
    if (u.indexOf("blob:") === 0) return "相机相框合成层";
    try {
      var a = document.createElement("a"); a.href = u;
      return (a.pathname || "").replace(/^\/+/, "");
    } catch (e) { return u; }
  }

  function friendlyName(el, aid, rel){
    if (el.dataset.customName) return el.dataset.customName;
    if (NAME_MAP[rel]) return NAME_MAP[rel];
    if (el.dataset.n === "frame") return "相机相框与封面照";
    if (el.dataset.n === "cake") return "生日蛋糕";
    if (el.dataset.n && el.dataset.n.indexOf("num") === 0) return "年龄气球数字 (" + el.dataset.n.replace("num", "#") + ")";
    if (el.alt) return el.alt;
    return rel || aid;
  }

  function isSkippedImg(img){
    if (!img || img.tagName !== "IMG") return true;
    if (img.classList.contains("base") || img.classList.contains("full") || img.classList.contains("burst")) return true;
    var hf = img.closest && img.closest(".half2");
    if (hf && hf.style.visibility === "hidden") return true;
    var rel = shortSrc(img.getAttribute("src") || img.src);
    if (rel === "e/world.webp" || rel === "e/china.webp" || rel === "f/chev.webp") return true;
    if (img.closest && (img.closest(".hint") || img.closest(".le-ui"))) return true;
    return false;
  }

  /* 为舞台上的每个可编辑素材分配稳定的 data-aid，并记录初始基准角度 */
  function scanAssets(){
    var st = getStage();
    if (!st) return [];
    var imgs = Array.prototype.slice.call(st.querySelectorAll("img"));
    var counts = {};
    var list = [];
    imgs.forEach(function(im){
      if (isSkippedImg(im)) return;
      var aid = im.dataset.aid;
      var rel = shortSrc(im.dataset.origSrc || im.getAttribute("src") || im.src);
      if (!im.dataset.origSrc) im.dataset.origSrc = rel || im.src;
      if (!aid) {
        var key = im.dataset.assetId || im.dataset.n || rel || "img";
        counts[key] = (counts[key] || 0) + 1;
        aid = counts[key] > 1 ? key + "__" + counts[key] : key;
        im.dataset.aid = aid;
      }
      if (im.dataset.baseRot === undefined) {
        im.dataset.baseRot = String(parseFloat(im.style.rotate) || 0);
      }
      if (im.dataset.baseZ === undefined) {
        var cz = im.style.zIndex || getComputedStyle(im).zIndex;
        im.dataset.baseZ = (!cz || cz === "auto") ? "1" : String(cz);
      }
      applyOverrideToEl(im, aid);
      var ov = overrides[aid] || {};
      list.push({
        id: aid,
        name: friendlyName(im, aid, rel),
        src: ov.src || im.getAttribute("src") || im.src,
        dx: ov.dx || 0,
        dy: ov.dy || 0,
        s: ov.s != null ? ov.s : 1,
        r: ov.r || 0,
        z: ov.z != null ? ov.z : +(im.dataset.baseZ || 20),
        hide: !!ov.hide,
        custom: im.classList.contains("custom-asset")
      });
    });
    return list;
  }

  function applyOverrideToEl(el, aid){
    var st = getStage();
    if (!st || !el) return;
    var ov = overrides[aid];
    if (!ov) {
      if (!el.classList.contains("custom-asset")) {
        el.style.marginLeft = "";
        el.style.marginTop = "";
        el.style.scale = "";
        if (el.dataset.baseRot !== undefined) {
          var br0 = parseFloat(el.dataset.baseRot) || 0;
          el.style.rotate = br0 ? br0 + "deg" : "";
        }
        if (el.dataset.origDisplay !== undefined) el.style.display = el.dataset.origDisplay;
      }
      return;
    }
    if (el.dataset.origDisplay === undefined) el.dataset.origDisplay = el.style.display || "";
    el.style.display = ov.hide ? "none" : el.dataset.origDisplay;
    if (ov.src && el.getAttribute("src") !== ov.src) {
      el.src = ov.src;
      el.style.objectFit = "contain";
    }
    var W = st.clientWidth || 1, H = st.clientHeight || 1;
    el.style.marginLeft = ((ov.dx || 0) * W / 100) + "px";
    el.style.marginTop = ((ov.dy || 0) * H / 100) + "px";
    el.style.scale = String(ov.s != null ? ov.s : 1);
    var br = parseFloat(el.dataset.baseRot) || 0;
    var totR = br + (ov.r || 0);
    el.style.rotate = totR ? totR + "deg" : "0deg";
    if (ov.z != null) el.style.zIndex = String(ov.z);
  }

  function syncAddedDOM(){
    var st = getStage();
    if (!st) return;
    var existing = {};
    Array.prototype.slice.call(st.querySelectorAll("img.custom-asset")).forEach(function(im){
      existing[im.dataset.aid] = im;
    });
    added.forEach(function(item){
      var im = existing[item.id];
      if (!im) {
        im = document.createElement("img");
        im.className = "custom-asset";
        im.dataset.aid = item.id;
        im.dataset.customName = item.name || "自定义米奇贴纸";
        im.dataset.baseRot = "0";
        im.dataset.baseZ = String(item.z || 45);
        im.alt = item.name || "";
        im.draggable = false;
        im.style.position = "absolute";
        im.style.objectFit = "contain";
        im.style.filter = "drop-shadow(0 4px 8px rgba(40,25,10,.2))";
        st.appendChild(im);
      }
      delete existing[item.id];
      im.src = (overrides[item.id] && overrides[item.id].src) || item.src;
      im.style.left = (item.x != null ? item.x : 38) + "%";
      im.style.top = (item.y != null ? item.y : 32) + "%";
      im.style.width = (item.w != null ? item.w : 16) + "%";
      im.style.height = "auto";
      im.style.zIndex = String((overrides[item.id] && overrides[item.id].z != null) ? overrides[item.id].z : (item.z || 45));
      applyOverrideToEl(im, item.id);
    });
    Object.keys(existing).forEach(function(k){ existing[k].remove(); });
  }

  function refreshAll(){
    syncAddedDOM();
    var list = scanAssets();
    updateSelectionBox();
    notifyParent(list, false);
    return list;
  }

  function notifyParent(list, save){
    if (window.parent === window) return;
    try {
      window.parent.postMessage({
        leSync: 1,
        assets: list || scanAssets(),
        overrides: overrides,
        added: added,
        selectedId: selectedId,
        editMode: editMode,
        save: !!save
      }, "*");
    } catch (e) {}
  }

  /* ============ 舞台内可视化选中框与浮动工具栏 ============ */
  var uiRoot = null, selBox = null, toolbar = null;
  function ensureUI(){
    var st = getStage();
    if (!st) return;
    if (uiRoot && uiRoot.parentNode === st) return;
    if (!document.getElementById("le-style")) {
      var css = document.createElement("style");
      css.id = "le-style";
      css.textContent =
        ".le-mode img[data-aid]{pointer-events:auto!important;cursor:move!important}" +
        ".le-mode img[data-aid]:hover{outline:2px dashed rgba(200,50,42,.75);outline-offset:2px}" +
        ".le-ui{position:absolute;inset:0;pointer-events:none;z-index:9990;display:none}" +
        ".le-mode .le-ui{display:block}" +
        ".le-banner{position:absolute;left:50%;top:8px;transform:translateX(-50%);background:rgba(28,20,16,.88);color:#fff8ee;padding:5px 14px;border-radius:999px;font:600 12px/1.3 -apple-system,BlinkMacSystemFont,sans-serif;white-space:nowrap;pointer-events:auto;display:flex;align-items:center;gap:8px;box-shadow:0 4px 14px rgba(0,0,0,.28)}" +
        ".le-banner button{border:0;background:#c8322a;color:#fff;border-radius:999px;padding:3px 10px;font:600 11px/1.2 inherit;cursor:pointer}" +
        ".le-banner button.sec{background:rgba(255,255,255,.18)}" +
        ".le-box{position:absolute;border:2px solid #c8322a;box-shadow:0 0 0 1px rgba(255,255,255,.85),0 4px 14px rgba(200,50,42,.25);border-radius:4px;pointer-events:none;display:none}" +
        ".le-box.on{display:block}" +
        ".le-h{position:absolute;width:14px;height:14px;background:#fff;border:2.5px solid #c8322a;border-radius:50%;pointer-events:auto;box-shadow:0 1px 4px rgba(0,0,0,.3)}" +
        ".le-h.nw{left:-8px;top:-8px;cursor:nwse-resize}" +
        ".le-h.ne{right:-8px;top:-8px;cursor:nesw-resize}" +
        ".le-h.sw{left:-8px;bottom:-8px;cursor:nesw-resize}" +
        ".le-h.se{right:-8px;bottom:-8px;cursor:nwse-resize}" +
        ".le-h.rot{left:50%;top:-26px;transform:translateX(-50%);background:#ffcf48;cursor:grab;width:16px;height:16px}" +
        ".le-h.rot::after{content:'';position:absolute;left:50%;top:14px;width:2px;height:10px;background:#c8322a;transform:translateX(-50%)}" +
        ".le-bar{position:absolute;left:50%;bottom:-42px;transform:translateX(-50%);background:rgba(26,20,17,.94);color:#fff;border-radius:999px;padding:4px 8px;display:flex;align-items:center;gap:4px;pointer-events:auto;white-space:nowrap;box-shadow:0 6px 16px rgba(0,0,0,.35);font:600 11px/1 -apple-system,sans-serif}" +
        ".le-bar.top{bottom:auto;top:-62px}" +
        ".le-bar button{border:0;background:rgba(255,255,255,.14);color:#fff;border-radius:999px;padding:5px 8px;font:inherit;cursor:pointer}" +
        ".le-bar button:hover{background:#c8322a}" +
        ".le-bar button.pri{background:#c8322a}" +
        ".le-bar button.del{background:rgba(220,60,50,.35);color:#ffb4ae}";
      document.head.appendChild(css);
    }
    uiRoot = document.createElement("div");
    uiRoot.className = "le-ui";
    uiRoot.innerHTML =
      '<div class="le-banner">' +
        '<span>✎ 自由排版模式：点选任意素材可拖动、四角缩放、顶部旋转</span>' +
        '<button type="button" class="sec" data-act="add">+ 加米奇贴纸</button>' +
        '<button type="button" class="sec" data-act="reveal">展开本关全部元素</button>' +
        '<button type="button" data-act="done">完成排版</button>' +
      '</div>' +
      '<div class="le-box">' +
        '<i class="le-h nw" data-h="scale" title="拖动缩放"></i>' +
        '<i class="le-h ne" data-h="scale" title="拖动缩放"></i>' +
        '<i class="le-h sw" data-h="scale" title="拖动缩放"></i>' +
        '<i class="le-h se" data-h="scale" title="拖动缩放"></i>' +
        '<i class="le-h rot" data-h="rot" title="拖动旋转"></i>' +
        '<div class="le-bar">' +
          '<button type="button" class="pri" data-act="replace">换素材</button>' +
          '<button type="button" data-act="s-" title="缩小">－</button>' +
          '<button type="button" data-act="s+" title="放大">＋</button>' +
          '<button type="button" data-act="r-" title="左转">↺</button>' +
          '<button type="button" data-act="r+" title="右转">↻</button>' +
          '<button type="button" data-act="z+" title="上移/置顶">置顶⇈</button>' +
          '<button type="button" data-act="z-" title="下移一层">下移↓</button>' +
          '<button type="button" class="del" data-act="del" title="隐藏或删除">🗑</button>' +
        '</div>' +
      '</div>';
    st.appendChild(uiRoot);
    selBox = uiRoot.querySelector(".le-box");
    toolbar = uiRoot.querySelector(".le-bar");

    uiRoot.addEventListener("pointerdown", function(e){
      var actEl = e.target.closest && e.target.closest("[data-act]");
      if (actEl) {
        e.stopPropagation();
        e.preventDefault();
        runAction(actEl.getAttribute("data-act"));
        return;
      }
      var hEl = e.target.closest && e.target.closest("[data-h]");
      if (hEl && selectedId) {
        e.stopPropagation();
        e.preventDefault();
        startHandleDrag(e, hEl.getAttribute("data-h"));
      }
    });
  }

  function getElByAid(aid){
    var st = getStage();
    if (!st || !aid) return null;
    var imgs = st.querySelectorAll("img[data-aid]");
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i].dataset.aid === aid) return imgs[i];
    }
    return null;
  }

  function ensureOv(aid){
    if (!overrides[aid]) {
      var el = getElByAid(aid);
      overrides[aid] = {
        dx: 0, dy: 0, s: 1, r: 0,
        z: el ? +(el.dataset.baseZ || 20) : 20,
        src: null, hide: false
      };
    }
    return overrides[aid];
  }

  function updateSelectionBox(){
    ensureUI();
    if (!selBox) return;
    var st = getStage(), el = getElByAid(selectedId);
    if (!editMode || !st || !el || el.style.display === "none") {
      selBox.classList.remove("on");
      return;
    }
    var sr = st.getBoundingClientRect(), er = el.getBoundingClientRect();
    if (er.width < 2 || er.height < 2) {
      selBox.classList.remove("on");
      return;
    }
    var left = er.left - sr.left, top = er.top - sr.top;
    selBox.style.left = left + "px";
    selBox.style.top = top + "px";
    selBox.style.width = er.width + "px";
    selBox.style.height = er.height + "px";
    selBox.classList.add("on");
    if (toolbar) {
      toolbar.classList.toggle("top", top + er.height > sr.height - 52);
      var bw = toolbar.offsetWidth || 260;
      var idealCenter = er.width / 2;
      var minCenter = 8 + bw / 2 - left;
      var maxCenter = sr.width - 8 - bw / 2 - left;
      var clampedCenter = Math.max(minCenter, Math.min(maxCenter, idealCenter));
      toolbar.style.left = clampedCenter + "px";
    }
  }

  /* 展开当前关卡的所有隐藏/待出场元素，方便一次性排版 */
  function revealStageElements(){
    var st = getStage();
    if (!st) return;
    /* 第 1 关：如果还在礼物包装封面 (.gate)，隐藏包装并让所有 .pc 贴纸直接入场 */
    var gate = st.querySelector(".gate");
    if (gate) gate.style.display = "none";
    var pcs = st.querySelectorAll(".pc");
    if (pcs.length) {
      Array.prototype.forEach.call(pcs, function(p){
        p.classList.remove("gone");
        p.classList.add("in");
        p.style.opacity = "1";
      });
    }
    /* 第 8 关：如果还在贴纸条阶段，调用 showAll() 把所有纸条和贴纸摆好 */
    if (typeof window.showAll === "function") {
      try { window.showAll(); } catch (e) {}
    }
    setTimeout(refreshAll, 120);
  }

  function runAction(act){
    if (act === "done") {
      setEditMode(false);
      return;
    }
    if (act === "add") {
      if (window.parent !== window) window.parent.postMessage({ lePickAsset: { mode: "add" } }, "*");
      return;
    }
    if (act === "reveal") {
      revealStageElements();
      return;
    }
    if (!selectedId) return;
    var ov = ensureOv(selectedId);
    var el = getElByAid(selectedId);
    if (act === "replace") {
      if (window.parent !== window) window.parent.postMessage({ lePickAsset: { mode: "replace", aid: selectedId } }, "*");
      return;
    }
    if (act === "s+") ov.s = Math.min(4, Math.round(((ov.s || 1) + 0.12) * 100) / 100);
    else if (act === "s-") ov.s = Math.max(0.15, Math.round(((ov.s || 1) - 0.12) * 100) / 100);
    else if (act === "r+") ov.r = ((ov.r || 0) + 12);
    else if (act === "r-") ov.r = ((ov.r || 0) - 12);
    else if (act === "z+") {
      var maxZ = 40;
      scanAssets().forEach(function(a){ if (a.z > maxZ) maxZ = a.z; });
      ov.z = maxZ + 2;
    } else if (act === "z-") {
      ov.z = Math.max(1, (ov.z || 20) - 3);
    } else if (act === "del") {
      var isAdded = added.some(function(a){ return a.id === selectedId; });
      if (isAdded) {
        added = added.filter(function(a){ return a.id !== selectedId; });
        delete overrides[selectedId];
        if (el) el.remove();
        selectedId = null;
      } else {
        ov.hide = true;
        selectedId = null;
      }
    }
    if (el && selectedId) applyOverrideToEl(el, selectedId);
    var list = scanAssets();
    updateSelectionBox();
    notifyParent(list, true);
  }

  function setEditMode(on){
    editMode = !!on;
    document.documentElement.classList.toggle("le-mode", editMode);
    ensureUI();
    if (!editMode) {
      selectedId = null;
    }
    refreshAll();
  }

  /* ============ 舞台内拖拽移动 / 缩放 / 旋转手势 ============ */
  var dragState = null;

  function startHandleDrag(ev, kind){
    var st = getStage(), el = getElByAid(selectedId);
    if (!st || !el) return;
    var ov = ensureOv(selectedId);
    var er = el.getBoundingClientRect();
    var cx = er.left + er.width / 2, cy = er.top + er.height / 2;
    var d0 = Math.max(12, Math.hypot(ev.clientX - cx, ev.clientY - cy));
    var a0 = Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180 / Math.PI;
    dragState = {
      kind: kind,
      aid: selectedId,
      el: el,
      cx: cx,
      cy: cy,
      d0: d0,
      a0: a0,
      s0: ov.s != null ? ov.s : 1,
      r0: ov.r || 0
    };
  }

  document.addEventListener("pointerdown", function(ev){
    if (!editMode) return;
    var st = getStage();
    if (!st || !st.contains(ev.target)) return;
    if (ev.target.closest && ev.target.closest(".le-ui")) return;

    /* 暂停关卡原本的点击/拖拽交互，优先做素材排版 */
    ev.stopImmediatePropagation();
    ev.preventDefault();

    var im = ev.target.closest && ev.target.closest("img[data-aid]");
    if (!im) {
      /* 如果点在透明区域，用坐标反查最顶层的可编辑 img */
      var imgs = Array.prototype.slice.call(st.querySelectorAll("img[data-aid]"));
      var hits = imgs.filter(function(el){
        if (el.style.display === "none") return false;
        var r = el.getBoundingClientRect();
        return ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
      });
      hits.sort(function(a, b){
        var za = +(a.style.zIndex || getComputedStyle(a).zIndex || 0);
        var zb = +(b.style.zIndex || getComputedStyle(b).zIndex || 0);
        return zb - za;
      });
      im = hits[0] || null;
    }

    if (!im) {
      selectedId = null;
      updateSelectionBox();
      notifyParent( null, false);
      return;
    }

    selectedId = im.dataset.aid;
    var ov = ensureOv(selectedId);
    dragState = {
      kind: "move",
      aid: selectedId,
      el: im,
      x0: ev.clientX,
      y0: ev.clientY,
      dx0: ov.dx || 0,
      dy0: ov.dy || 0,
      sw: st.clientWidth || 1,
      sh: st.clientHeight || 1
    };
    updateSelectionBox();
    notifyParent(null, false);
  }, true);

  window.addEventListener("pointermove", function(ev){
    if (!editMode || !dragState) return;
    ev.stopImmediatePropagation();
    ev.preventDefault();
    var d = dragState, ov = ensureOv(d.aid);
    if (d.kind === "move") {
      ov.dx = Math.round((d.dx0 + (ev.clientX - d.x0) / d.sw * 100) * 100) / 100;
      ov.dy = Math.round((d.dy0 + (ev.clientY - d.y0) / d.sh * 100) * 100) / 100;
    } else if (d.kind === "scale") {
      var dist = Math.max(8, Math.hypot(ev.clientX - d.cx, ev.clientY - d.cy));
      ov.s = Math.max(0.15, Math.min(4.5, Math.round((d.s0 * dist / d.d0) * 100) / 100));
    } else if (d.kind === "rot") {
      var ang = Math.atan2(ev.clientY - d.cy, ev.clientX - d.cx) * 180 / Math.PI;
      ov.r = Math.round(d.r0 + (ang - d.a0));
    }
    applyOverrideToEl(d.el, d.aid);
    updateSelectionBox();
  }, true);

  function endPointer(ev){
    if (!editMode || !dragState) return;
    ev.stopImmediatePropagation();
    dragState = null;
    var list = scanAssets();
    updateSelectionBox();
    notifyParent(list, true);
  }
  window.addEventListener("pointerup", endPointer, true);
  window.addEventListener("pointercancel", endPointer, true);

  /* 拦截 editMode 下的 click，防止触发关卡跳关 */
  document.addEventListener("click", function(ev){
    if (!editMode) return;
    var st = getStage();
    if (st && st.contains(ev.target) && !(ev.target.closest && ev.target.closest(".le-ui"))) {
      ev.stopImmediatePropagation();
      ev.preventDefault();
    }
  }, true);

  /* ============ 接收父窗口配置台的排版/替换指令 ============ */
  window.addEventListener("message", function(ev){
    var d = ev.data;
    if (!d) return;
    if (d.leSetMode !== undefined) {
      setEditMode(!!d.leSetMode);
    } else if (d.leSelect !== undefined) {
      if (!editMode) setEditMode(true);
      selectedId = d.leSelect;
      updateSelectionBox();
      notifyParent(null, false);
    } else if (d.leUpdateAsset) {
      var u = d.leUpdateAsset, aid = u.aid;
      var ov = ensureOv(aid);
      ["dx", "dy", "s", "r", "z", "src", "hide"].forEach(function(k){
        if (u[k] !== undefined) ov[k] = u[k];
      });
      var el = getElByAid(aid);
      if (el) applyOverrideToEl(el, aid);
      var list = scanAssets();
      updateSelectionBox();
      notifyParent(list, true);
    } else if (d.leAddAsset) {
      var item = d.leAddAsset;
      added.push(item);
      if (!editMode) setEditMode(true);
      selectedId = item.id;
      var list2 = refreshAll();
      notifyParent(list2, true);
    } else if (d.leResetAll) {
      overrides = {};
      added = [];
      var st = getStage();
      if (st) {
        Array.prototype.slice.call(st.querySelectorAll("img.custom-asset")).forEach(function(im){ im.remove(); });
        Array.prototype.slice.call(st.querySelectorAll("img[data-aid]")).forEach(function(im){
          if (im.dataset.origSrc) im.src = im.dataset.origSrc;
          im.style.marginLeft = "";
          im.style.marginTop = "";
          im.style.scale = "";
          var br = parseFloat(im.dataset.baseRot) || 0;
          im.style.rotate = br ? br + "deg" : "";
          if (im.dataset.baseZ) im.style.zIndex = im.dataset.baseZ;
          if (im.dataset.origDisplay !== undefined) im.style.display = im.dataset.origDisplay;
        });
      }
      selectedId = null;
      var list3 = refreshAll();
      notifyParent(list3, true);
    } else if (d.leReveal) {
      revealStageElements();
    } else if (d.leQuery) {
      refreshAll();
    }
  });

  /* 过关后轻点画面空白处即可平滑跳到下一关（不影响拖拽、按钮与合影手机锁屏点击） */
  var segDoneAt = 0;
  var blankTap = null;
  function hookSegDone(){
    if (typeof window.segDone === "function" && !window.segDone.__leHooked) {
      var origSegDone = window.segDone;
      var wrapped = function(){
        if (!segDoneAt) segDoneAt = Date.now();
        return origSegDone.apply(this, arguments);
      };
      wrapped.__leHooked = true;
      window.segDone = wrapped;
    }
  }
  window.addEventListener("pointerdown", function(ev){
    if (editMode || window.parent === window || !window.__sd) { blankTap = null; return; }
    if (!segDoneAt) segDoneAt = Date.now() - 1000;
    if (ev.target && ev.target.closest && ev.target.closest("button, a, input, textarea, [data-keep-tap], .kids-phone, .le-ui")) {
      blankTap = null;
      return;
    }
    blankTap = { x: ev.clientX, y: ev.clientY, t: Date.now() };
  }, true);
  window.addEventListener("pointerup", function(ev){
    var bt = blankTap;
    blankTap = null;
    if (!bt || editMode || window.parent === window || !window.__sd) return;
    if (Date.now() - segDoneAt < 350) return;
    var dist = Math.hypot(ev.clientX - bt.x, ev.clientY - bt.y);
    var dur = Date.now() - bt.t;
    if (dist < 12 && dur < 500) {
      try { window.parent.postMessage({ nextSeg: 1 }, "*"); } catch (e) {}
    }
  }, true);
  window.addEventListener("pointercancel", function(){ blankTap = null; }, true);

  /* 监听舞台 DOM 变化，当关卡动态插入贴纸/图片时自动应用排版覆盖 */
  function startObserver(){
    hookSegDone();
    var st = getStage();
    if (!st) { setTimeout(startObserver, 80); return; }
    ensureUI();
    if (editMode) document.documentElement.classList.add("le-mode");
    refreshAll();
    var moT = 0;
    var mo = new MutationObserver(function(muts){
      var relevant = muts.some(function(m){
        return Array.prototype.some.call(m.addedNodes || [], function(n){
          return n.nodeType === 1 && !n.classList.contains("le-ui") && (n.tagName === "IMG" || (n.querySelector && n.querySelector("img")));
        });
      });
      if (relevant) {
        clearTimeout(moT);
        moT = setTimeout(refreshAll, 60);
      }
    });
    mo.observe(st, { childList: true, subtree: true });
    window.addEventListener("resize", function(){
      setTimeout(refreshAll, 120);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startObserver);
  } else {
    setTimeout(startObserver, 40);
  }
})();
