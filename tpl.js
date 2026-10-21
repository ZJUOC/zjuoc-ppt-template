// ZJUOC 内训 PPT 模板：主题、三种版式（封面 / 小封面 / 内容页）和绘图 helper
// 用法：const tpl = require("./tpl"); const t = await tpl.setup(pres, { footer: "某某 · 第 N 次内训" });
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const md = require("react-icons/md");

const F = "Microsoft YaHei";
const C = {
  NAVY: "0A2E5C", BLUE: "0A55A6", TEAL: "13878F", PURPLE: "6A4C9C", ORANGE: "E07B12", GOLD: "F2A65A",
  INK: "1F2A37", MUTED: "5B6B7C", FAINT: "8A97A6", TINT: "EEF4FA", LINE: "D5DEE8", CARD: "F6F9FC",
  ICE: "C9D8EA", PALE: "DCE7F3", NAVY2: "123E73",
};
const THEME = {
  name: "ZJUOC 内训", headFontFace: F, bodyFontFace: F,
  colors: { dk1: C.INK, lt1: "FFFFFF", dk2: C.NAVY, lt2: C.TINT, accent1: C.BLUE, accent2: C.TEAL, accent3: C.PURPLE, accent4: C.ORANGE, accent5: "3B7DD8", accent6: "7A8A9C", hlink: C.BLUE, folHlink: C.PURPLE },
};
const LOGO_SRC = path.join(__dirname, "assets/logo.jpg"); // 协会高清 logo（白底圆形）

// 圆形透明底 logo，深色背景上也能用
async function roundLogo(out) {
  const S = 800;
  const mask = Buffer.from(`<svg width="${S}" height="${S}"><circle cx="${S / 2}" cy="${S / 2}" r="${S / 2}" fill="#fff"/></svg>`);
  const buf = await sharp(LOGO_SRC).resize(S, S, { fit: "contain", background: "#ffffff" }).flatten({ background: "#ffffff" })
    .composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
  fs.writeFileSync(out, buf);
  return out;
}

async function setup(pres, opt = {}) {
  // fontBump：24 磅以下的字整体加大 2 磅（10 磅及以下加 1.5 磅），大标题和大数字不变
  const FS = (v) => (!opt.fontBump || v == null || v >= 24 ? v : v + (v <= 10 ? 1.5 : 2));
  const footer = opt.footer || "浙江大学学生海洋机器人协会 · 内训";
  pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
  pres.theme = { headFontFace: F, bodyFontFace: F };
  const LOGO = await roundLogo(path.join(__dirname, "logo_round.png"));

  // ---------- 版式 ----------
  // 封面：深蓝底，左侧标题，右侧留给主视觉
  pres.defineSlideMaster({
    title: "封面",
    background: { color: C.NAVY },
    objects: [
      { image: { x: 0.75, y: 0.6, w: 0.95, h: 0.95, path: LOGO } },
      { text: { text: "浙江大学学生海洋机器人协会", options: { x: 1.9, y: 0.82, w: 5.3, h: 0.5, fontSize: 14, color: C.ICE, fontFace: F, margin: 0, valign: "middle" } } },
      { placeholder: { options: { name: "title", type: "title", x: 0.75, y: 2.05, w: 6.6, h: 1.25, fontSize: 46, bold: true, color: "FFFFFF", fontFace: F, align: "left", valign: "middle", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 0.75, y: 3.4, w: 5.7, h: 1.2, fontSize: FS(16), color: C.PALE, fontFace: F, align: "left", valign: "top", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "meta", type: "body", x: 0.75, y: 6.35, w: 6.2, h: 0.45, fontSize: FS(13), color: C.ICE, fontFace: F, align: "left", valign: "middle", margin: 0 }, text: "" } },
    ],
  });
  // 小封面（章节页）：左侧深蓝色块放章节号，右侧标题 + 一句引导问题
  pres.defineSlideMaster({
    title: "小封面",
    background: { color: "FFFFFF" },
    objects: [
      { rect: { x: 0, y: 0, w: 4.6, h: 7.5, fill: { color: C.NAVY }, line: { color: C.NAVY } } },
      { text: { text: "PART", options: { x: 0.75, y: 1.95, w: 3, h: 0.4, fontSize: 14, bold: true, color: "8FB0D6", charSpacing: 6, fontFace: F, margin: 0 } } },
      { placeholder: { options: { name: "num", type: "body", x: 0.7, y: 2.35, w: 3.6, h: 1.75, fontSize: 96, bold: true, color: C.GOLD, fontFace: F, align: "left", valign: "top", margin: 0 }, text: "" } },
      { image: { x: 0.75, y: 6.25, w: 0.55, h: 0.55, path: LOGO } },
      { text: { text: footer, options: { x: 5.3, y: 7.05, w: 6, h: 0.28, fontSize: 10, color: C.FAINT, fontFace: F, margin: 0 } } },
      { rect: { x: 5.3, y: 2.15, w: 0.9, h: 0.08, fill: { color: C.GOLD }, line: { color: C.GOLD } } },
      { placeholder: { options: { name: "title", type: "title", x: 5.3, y: 2.4, w: 7.4, h: 1.05, fontSize: 36, bold: true, color: C.NAVY, fontFace: F, align: "left", valign: "middle", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: 5.3, y: 3.55, w: 7.2, h: 1.1, fontSize: FS(18), color: C.MUTED, fontFace: F, align: "left", valign: "top", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 12.23, y: 7.05, w: 0.5, h: 0.28, fontSize: 10, color: C.FAINT, fontFace: F, align: "right" },
  });
  // 内容页：左上 logo + 标题，底部页脚和页码
  pres.defineSlideMaster({
    title: "内容页",
    background: { color: "FFFFFF" },
    objects: [
      { image: { x: 0.5, y: 0.31, w: 0.7, h: 0.7, path: LOGO } },
      { text: { text: footer, options: { x: 0.6, y: 7.05, w: 6, h: 0.28, fontSize: 10, color: C.FAINT, fontFace: F, margin: 0 } } },
      { placeholder: { options: { name: "title", type: "title", x: 1.38, y: 0.33, w: 7.6, h: 0.66, fontSize: 28, bold: true, color: C.NAVY, fontFace: F, align: "left", valign: "middle", margin: 0 }, text: "" } },
    ],
    slideNumber: { x: 12.23, y: 7.05, w: 0.5, h: 0.28, fontSize: 10, color: C.FAINT, fontFace: F, align: "right" },
  });

  // ---------- 素材 ----------
  async function pic(file, w, h, o = {}) {
    let img = sharp(file).rotate();
    if (o.extract) img = img.extract(o.extract);
    if (o.flop) img = img.flop();
    if (o.png) { // 保留透明底
      const buf = await img.resize(Math.round(w * 160), Math.round(h * 160), { fit: o.fit || "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
      return "image/png;base64," + buf.toString("base64");
    }
    img = img.flatten({ background: o.bg || "#ffffff" }).resize(Math.round(w * 160), Math.round(h * 160), {
      fit: o.fit || "cover", position: o.position || "centre", background: o.bg || "#ffffff",
    });
    const buf = await img.jpeg({ quality: 86 }).toBuffer();
    return "image/jpeg;base64," + buf.toString("base64");
  }
  async function icon(name, color, px = 256) {
    const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(md[name], { color: "#" + color, size: px }));
    const buf = await sharp(Buffer.from(svg)).png().toBuffer();
    return "image/png;base64," + buf.toString("base64");
  }
  // 透明底渲染图：裁掉空白后按比例放进 (x,y,w,h)，返回锚点（u 从左、v 从下的归一化坐标）在页面上的位置
  async function render(s, file, x, y, w, h, anchors = {}, o = {}) {
    const meta = await sharp(file).metadata();
    const { data, info } = await sharp(file).trim().png().toBuffer({ resolveWithObject: true });
    const sc = Math.min(w / info.width, h / info.height);
    const dw = info.width * sc, dh = info.height * sc;
    const dx = x + (o.align === "left" ? 0 : (w - dw) / 2), dy = y + (o.valign === "top" ? 0 : (h - dh) / 2);
    const buf = await sharp(data).resize(Math.round(dw * 180)).png().toBuffer();
    s.addImage({ data: "image/png;base64," + buf.toString("base64"), x: dx, y: dy, w: dw, h: dh, altText: o.alt || "" });
    const pos = {};
    for (const k of Object.keys(anchors)) {
      const [u, v] = anchors[k];
      pos[k] = [dx + (u * meta.width + (info.trimOffsetLeft || 0)) * sc, dy + ((1 - v) * meta.height + (info.trimOffsetTop || 0)) * sc];
    }
    return pos;
  }

  // ---------- 绘图 helper ----------
  // run 里的 "\n" 会让 pptxgenjs 在段落中间写出多余的 <a:pPr>，所以拆成 breakLine run
  function runs(text) {
    if (!Array.isArray(text)) return text;
    const out = [];
    text.forEach((r) => {
      const parts = String(r.text).split("\n");
      parts.forEach((p, k) => {
        const opt = Object.assign({}, r.options);
        if (opt.fontSize) opt.fontSize = FS(opt.fontSize);
        if (k < parts.length - 1) opt.breakLine = true;
        if (p !== "" || k < parts.length - 1) out.push({ text: p, options: opt });
      });
    });
    return out;
  }
  function T(s, text, o) {
    const oo = Object.assign({ fontFace: F, color: C.INK, fontSize: 14, margin: 0, valign: "top", isTextBox: true }, o);
    oo.fontSize = FS(oo.fontSize);
    s.addText(runs(text), oo);
  }
  function box(s, x, y, w, h, text, o = {}) {
    s.addText(runs(text), {
      shape: o.shape || pres.shapes.ROUNDED_RECTANGLE, rectRadius: o.radius ?? 0.08,
      x, y, w, h, fill: { color: o.fill || C.TINT }, line: o.line || { color: o.fill || C.TINT, width: 0.75 },
      fontFace: o.font || F, fontSize: FS(o.size || 14), bold: o.bold || false, color: o.color || C.INK,
      align: o.align || "center", valign: o.valign || "middle", margin: (o.margin ?? 0.08) * 72, isTextBox: true, // 文字边距单位是磅
      shadow: o.shadow ? { type: "outer", color: "000000", opacity: 0.12, blur: 6, offset: 2, angle: 90 } : undefined,
      paraSpaceAfter: o.gap, objectName: o.name,
    });
  }
  function card(s, x, y, w, h, o = {}) {
    box(s, x, y, w, h, "", Object.assign({ fill: C.CARD, line: { color: C.LINE, width: 0.75 } }, o));
  }
  function arrow(s, x1, y1, x2, y2, o = {}) {
    s.addShape(pres.shapes.LINE, {
      x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
      flipH: x2 < x1, flipV: y2 < y1,
      line: { color: o.color || C.MUTED, width: o.width || 1.75, dashType: o.dash || "solid", endArrowType: o.noHead ? undefined : "triangle", beginArrowType: o.both ? "triangle" : undefined },
    });
  }
  async function photo(s, file, x, y, w, h, caption, o = {}) {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: o.bg ? o.bg.replace("#", "") : "FFFFFF" }, line: { color: C.LINE, width: 0.75 },
      shadow: { type: "outer", color: "000000", opacity: 0.1, blur: 5, offset: 2, angle: 90 } });
    s.addImage({ data: await pic(file, w, h, o), x, y, w, h, altText: caption || o.alt || "" });
    if (caption) T(s, caption, { x, y: y + h + 0.06, w, h: 0.28, fontSize: 10, color: C.MUTED });
  }
  async function iconCircle(s, name, x, y, d, bg, fg = "FFFFFF") {
    s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: bg }, line: { color: bg } });
    const p = d * 0.22;
    s.addImage({ data: await icon(name, fg), x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p });
  }
  // 内容页标题 + 右上角章节标签
  function header(s, title, tag) {
    s.addText(title, { placeholder: "title" });
    if (tag) T(s, tag, { x: 9.1, y: 0.47, w: 3.65, h: 0.4, fontSize: 12, color: C.FAINT, align: "right", valign: "middle" });
  }
  function bullets(items, o = {}) {
    return items.map((t, i) => {
      const base = { bullet: o.bullet === false ? false : { indent: 14 }, breakLine: i < items.length - 1, paraSpaceAfter: o.gap ?? 6 };
      if (Array.isArray(t)) return t.map((r, j) => ({ text: r.text, options: Object.assign({}, r.options, j === 0 ? base : {}, j === t.length - 1 ? { breakLine: i < items.length - 1 } : { breakLine: false }) }));
      return [{ text: t, options: base }];
    }).flat();
  }
  // 小封面：章节号、标题、引导问题，下方一排主题标签
  function sectionSlide(sl, num, title, question, chips = []) {
    sl.addText(num, { placeholder: "num" });
    sl.addText(title, { placeholder: "title" });
    sl.addText(question, { placeholder: "body" });
    let x = 5.3;
    chips.forEach((c) => {
      const w = 0.42 + c.length * 0.2;
      box(sl, x, 5.0, w, 0.46, c, { fill: C.TINT, color: C.NAVY, size: 13, radius: 0.23, margin: 0.05 });
      x += w + 0.18;
    });
  }

  return { F, C, THEME, LOGO, pic, icon, render, runs, T, box, card, arrow, photo, iconCircle, header, bullets, sectionSlide };
}

// pptxgenjs 只写主题的西文字体，配色固定是 Office 默认：换成模板色板，中文字体也写进主题
function themeXml(xml, th) {
  const keys = ["dk1", "lt1", "dk2", "lt2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "hlink", "folHlink"];
  const scheme = `<a:clrScheme name="${th.name}">` + keys.map((k) => `<a:${k}><a:srgbClr val="${th.colors[k]}"/></a:${k}>`).join("") + "</a:clrScheme>";
  return xml
    .replace(/<a:clrScheme\b[\s\S]*?<\/a:clrScheme>/, scheme)
    .replace(/(<a:theme\b[^>]*?\bname=")[^"]*"/, `$1${th.name}"`)
    .replace(/(<a:majorFont>[\s\S]*?<a:ea typeface=")[^"]*"/, `$1${th.headFontFace}"`)
    .replace(/(<a:minorFont>[\s\S]*?<a:ea typeface=")[^"]*"/, `$1${th.bodyFontFace}"`);
}

// 写文件后：套主题色、修 pptxgenjs 的两处 XML 问题；传 potx 时另存 .potx
async function finish(pres, out, o = {}) {
  await pres.writeFile({ fileName: out });
  const JSZip = require("jszip");
  let zip = await JSZip.loadAsync(fs.readFileSync(out));
  zip.file("ppt/theme/theme1.xml", themeXml(await zip.file("ppt/theme/theme1.xml").async("string"), THEME));
  for (const name of Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))) {
    let xml = await zip.file(name).async("string");
    const ids = [...xml.matchAll(/<p:cNvPr id="(\d+)"/g)].map((m) => +m[1]);
    const max = Math.max(...ids);
    // pptxgenjs 会在多 run 段落的后续 run 前重复写 <a:pPr>，只有第一个合法
    xml = xml.replace(/(<\/a:r>|<a:br\/>|<a:br>[\s\S]*?<\/a:br>)<a:pPr\b[^>]*?(?:\/>|>[\s\S]*?<\/a:pPr>)/g, "$1");
    // 版式页码占位符的 id 可能与页面形状撞号
    xml = xml.replace(/<p:cNvPr id="\d+" name="Slide Number Placeholder/, `<p:cNvPr id="${max + 1}" name="Slide Number Placeholder`);
    zip.file(name, xml);
  }
  // PowerPoint 比 XSD 校验更严：GUID 只认大写；不要指向不存在部件的 Override；不要目录条目
  const guidUp = (x) => x.replace(/\{[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\}/g, (g) => g.toUpperCase());
  zip.file("ppt/presentation.xml", guidUp(await zip.file("ppt/presentation.xml").async("string")));
  for (const name of Object.keys(zip.files).filter((n) => /^ppt\/slide(Master|Layout)s\/[^/]+\.xml$/.test(n))) {
    zip.file(name, (await zip.file(name).async("string")).replace(/(type="slidenum">[\s\S]*?<a:t>)null(<\/a:t>)/g, "$1\u2039#\u203A$2"));
  }
  let ctx = await zip.file("[Content_Types].xml").async("string");
  ctx = ctx.replace(/<Override PartName="\/([^"]+)"[^>]*\/>/g, (m, part) => (zip.files[part] ? m : ""));
  zip.file("[Content_Types].xml", ctx);
  const clean = new JSZip();
  const names = Object.keys(zip.files).filter((n) => !zip.files[n].dir).sort((a, b) => (a === "[Content_Types].xml" ? -1 : b === "[Content_Types].xml" ? 1 : 0));
  for (const n of names) clean.file(n, await zip.file(n).async("nodebuffer"), { createFolders: false });
  zip = clean;
  fs.writeFileSync(out, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  if (o.potx) {
    let ct = await zip.file("[Content_Types].xml").async("string");
    ct = ct.replace("application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml", "application/vnd.openxmlformats-officedocument.presentationml.template.main+xml");
    zip.file("[Content_Types].xml", ct);
    fs.writeFileSync(o.potx, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  }
}

module.exports = { setup, finish, F, C, THEME };
