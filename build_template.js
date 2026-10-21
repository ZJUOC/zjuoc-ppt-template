// 生成「内训PPT模板」：封面、目录、小封面、内容页示例 + 规范页
// 用法：node build_template.js [输出目录]，默认输出到 dist/
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const tpl = require("./tpl");
const DIR = process.argv[2] || path.join(__dirname, "dist");
fs.mkdirSync(DIR, { recursive: true });

const pres = new pptxgen();
pres.title = "内训PPT模板";
pres.author = "浙江大学学生海洋机器人协会";
pres.company = "浙江大学学生海洋机器人协会";

(async () => {
  const t = await tpl.setup(pres, { footer: "课程名称 · 第 N 次内训" });
  const { C, T, box, card, iconCircle, header, bullets, sectionSlide } = t;
  const add = (m, sec) => { pres.addSection({ title: sec }); return pres.addSlide({ masterName: m, sectionTitle: sec }); };

  { // 封面
    const s = add("封面", "封面");
    s.addShape(pres.shapes.OVAL, { x: 7.0, y: 0.85, w: 5.9, h: 5.9, fill: { color: C.NAVY2 }, line: { color: C.NAVY2 } });
    box(s, 7.95, 2.95, 4.0, 1.6, "右侧放主视觉\n（透明底渲染图或裁成圆形的照片）", { fill: C.NAVY2, color: C.ICE, size: 14 });
    s.addText("课程名称", { placeholder: "title" });
    s.addText("一句话说明这次内训讲什么、用什么案例", { placeholder: "body" });
    s.addText("第 N 次内训　·　2026 年 X 月", { placeholder: "meta" });
    s.addNotes("封面版式「封面」：标题、副标题、日期三个占位符。不写主讲人。");
  }
  { // 目录
    const s = pres.addSlide({ masterName: "内容页", sectionTitle: "封面" });
    header(s, "今天的路线");
    for (let i = 0; i < 6; i++) {
      const x = 0.6 + (i % 3) * 4.115, y = 1.35 + Math.floor(i / 3) * 2.75;
      card(s, x, y, 3.9, 2.5);
      T(s, "0" + (i + 1), { x: x + 0.3, y: y + 0.22, w: 1.5, h: 0.75, fontSize: 36, bold: true, color: C.BLUE, valign: "middle" });
      T(s, "第 " + (i + 1) + " 部分标题", { x: x + 0.3, y: y + 1.0, w: 3.4, h: 0.45, fontSize: 18, bold: true, color: C.NAVY, valign: "middle" });
      T(s, "这一部分要回答的问题？", { x: x + 0.3, y: y + 1.5, w: 3.35, h: 0.8, fontSize: 13, color: C.MUTED });
    }
    s.addNotes("目录：每部分一张卡片，标题 + 一个引导问题。部分少于 6 个时删掉多余卡片。");
  }
  { // 小封面
    const s = add("小封面", "章节示例");
    sectionSlide(s, "01", "章节标题", "这一部分要回答的问题？", ["主题一", "主题二", "主题三"]);
    s.addNotes("小封面版式「小封面」：章节号、标题、引导问题三个占位符；下方主题标签按需增删。");
  }
  { // 内容页：图文
    const s = pres.addSlide({ masterName: "内容页", sectionTitle: "章节示例" });
    header(s, "内容页：左图右文", "01 章节标题");
    box(s, 0.6, 1.3, 6.0, 4.6, "图片区\n照片加细边框和轻阴影；图注 10 pt 灰色写在图下", { fill: C.TINT, color: C.MUTED, size: 14 });
    T(s, "要点标题", { x: 7.0, y: 1.3, w: 5.7, h: 0.4, fontSize: 16, bold: true, color: C.NAVY, valign: "middle" });
    T(s, bullets(["一页只讲一件事", "正文 13–16 pt，至少 12 pt", "少写句子，多放实物照片、框图、数据"], { gap: 8 }), { x: 7.0, y: 1.85, w: 5.7, h: 2.2, fontSize: 15 });
    box(s, 7.0, 4.6, 5.73, 1.3, [{ text: "结论框  ", options: { bold: true, color: C.GOLD } }, { text: "深蓝底白字，放这一页最想让大家记住的一句话" }], { fill: C.NAVY, color: "FFFFFF", align: "left", margin: 0.2, size: 15 });
    s.addNotes("内容页版式「内容页」：只有标题占位符，右上角的章节标签用 header() 写。讲稿写在备注里，不写在页面上。");
  }
  { // 内容页：卡片
    const s = pres.addSlide({ masterName: "内容页", sectionTitle: "章节示例" });
    header(s, "内容页：三张卡片", "01 章节标题");
    const c = [["MdOpenWith", "运动控制", C.BLUE], ["MdWaterDrop", "防水", C.TEAL], ["MdAccountTree", "决策", C.PURPLE]];
    for (let i = 0; i < 3; i++) {
      const x = 0.6 + i * 4.115;
      card(s, x, 1.3, 3.9, 3.6);
      await iconCircle(s, c[i][0], x + 0.25, 1.5, 0.7, c[i][2]);
      T(s, c[i][1], { x: x + 1.1, y: 1.55, w: 2.7, h: 0.6, fontSize: 17, bold: true, color: c[i][2], valign: "middle" });
      T(s, bullets(["要点一", "要点二", "要点三"], { gap: 8 }), { x: x + 0.3, y: 2.45, w: 3.4, h: 2.3, fontSize: 14 });
    }
    T(s, "卡片：浅灰底 F6F9FC + 细边框 D5DEE8；图标放在彩色圆里", { x: 0.6, y: 5.3, w: 12, h: 0.4, fontSize: 13, color: C.MUTED });
    s.addNotes("三栏卡片，常用于并列的三件事。");
  }
  { // 规范
    const s = pres.addSlide({ masterName: "内容页", sectionTitle: "章节示例" });
    header(s, "模板规范：颜色与字号", "使用说明");
    const cols = [["NAVY", C.NAVY, "主色：封面、标题、结论框"], ["BLUE", C.BLUE, "运动控制 / 强调"], ["TEAL", C.TEAL, "防水"], ["PURPLE", C.PURPLE, "决策"], ["ORANGE", C.ORANGE, "警示、教训"], ["GOLD", C.GOLD, "深色底上的强调字"]];
    cols.forEach((r, i) => {
      const x = 0.6 + (i % 3) * 4.115, y = 1.3 + Math.floor(i / 3) * 1.25;
      box(s, x, y, 1.0, 1.0, "", { fill: r[1], radius: 0.1 });
      T(s, r[0] + "  " + r[1], { x: x + 1.15, y: y + 0.12, w: 2.7, h: 0.35, fontSize: 13, bold: true, color: C.NAVY, fontFace: "Consolas" });
      T(s, r[2], { x: x + 1.15, y: y + 0.5, w: 2.7, h: 0.4, fontSize: 12, color: C.MUTED });
    });
    const f = [["页标题", "28 pt 粗体，深蓝"], ["小封面标题", "36 pt 粗体；章节号 96 pt 金色"], ["卡片标题", "15–18 pt 粗体"], ["正文", "13–16 pt，最小 12 pt"], ["图注 / 来源", "9–11 pt 灰色"], ["字体", "微软雅黑（主题字体，不用单独设置）"]];
    f.forEach((r, i) => {
      const y = 4.0 + i * 0.47;
      box(s, 0.6, y, 2.2, 0.4, r[0], { fill: C.NAVY, color: "FFFFFF", bold: true, size: 12, radius: 0.04 });
      box(s, 2.9, y, 5.0, 0.4, r[1], { fill: C.CARD, line: { color: C.LINE, width: 0.75 }, size: 12, align: "left", margin: 0.12, radius: 0.04 });
    });
    box(s, 8.3, 4.0, 4.43, 2.75, [{ text: "怎样用\n", options: { bold: true, color: C.GOLD, fontSize: 15 } }, { text: "PowerPoint：开始 → 新建幻灯片，选「封面 / 小封面 / 内容页」三种版式\n脚本生成：require(\"tpl.js\")，setup() 后用 masterName 选版式", options: { fontSize: 12 } }], { fill: C.NAVY, color: "FFFFFF", align: "left", valign: "top", margin: 0.2 });
    s.addNotes("颜色对应三大功能：蓝 = 运动控制，青 = 防水，紫 = 决策，整学期保持一致。");
  }
  await tpl.finish(pres, path.join(DIR, "内训PPT模板.pptx"), { potx: path.join(DIR, "内训PPT模板.potx") });
  console.log("ok");
})().catch((e) => { console.error(e); process.exit(1); });
