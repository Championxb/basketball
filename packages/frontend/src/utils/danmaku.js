import { color } from "chart.js/helpers";
import { create } from "danmu";

// 在此处创建一个 manager 实例，如果不传递则会使用默认的配置
export const manager = create({
  trackHeight: "20%",
  speed: 0.3,
  plugin: {
    $createNode(danmaku) {
      // const node = document.createElement("div");
      // node.className = "danmaku-node";
      // node.textContent = danmaku.data;
      // // 基本布局和可被动画控制的定位
      // // node.style.display = "inline-block"; // 确保可测量宽高
      // node.style.position = "absolute"; // 允许库通过 left/top 或 transform 控制位置
      // node.style.pointerEvents = "none";
      // // 视觉样式
      // node.style.color = "#b6cce6ff";
      // node.style.fontWeight = "bold";
      // node.style.fontSize = "32px";
      // node.style.border = "1px solid rgba(255,255,255,0.12)";
      // node.style.padding = "4px 15px";
      // node.style.borderRadius = "32px";
      // node.style.whiteSpace = "nowrap";
      // node.style.overflow = "hidden";
      // node.style.textOverflow = "ellipsis"; // 超出部分显示省略号
      // danmaku.node = node;
      danmaku.node.textContent = danmaku.data;

      // 科幻风格的文字：白色发光效果
      danmaku.node.style.color = "#ffffff";
      danmaku.node.style.fontWeight = "bold";
      danmaku.node.style.fontSize = "30px";
      danmaku.node.style.textShadow = "0 0 5px rgba(2, 213, 250, 1), 0 0 5px rgba(2, 213, 250, 0.8), 0 0 5px rgba(2, 213, 250, 0.6)";
      danmaku.node.style.fontFamily = "Orbitron, DIN, Arial, sans-serif";
      
      // 科幻风格的边框：霓虹青色渐变 + 发光效果
      danmaku.node.style.border = "2px solid transparent";
      danmaku.node.style.backgroundImage = "linear-gradient(rgba(26, 26, 46, 0.9), rgba(22, 33, 62, 0.9)), linear-gradient(90deg, #02d5fa, #03a9f4, #2196f3)";
      danmaku.node.style.backgroundOrigin = "border-box";
      danmaku.node.style.backgroundClip = "padding-box, border-box";
      danmaku.node.style.boxShadow = "0 0 15px rgba(2, 213, 250, 0.6), 0 0 30px rgba(2, 213, 250, 0.3), inset 0 0 10px rgba(2, 213, 250, 0.1)";
      danmaku.node.style.padding = "2px 15px";
      danmaku.node.style.borderRadius = "32px";
      danmaku.node.style.whiteSpace = "nowrap";
      danmaku.node.style.overflow = "hidden";
      danmaku.node.style.textOverflow = "ellipsis"; // 超出部分显示省略号
      danmaku.node.style.letterSpacing = "1px"; // 增加文字间距，增强科技感
    },

    willRender(ref) {
      // console.log(ref.type); // 即将要渲染的弹幕类型
      // console.log(ref.danmaku); // 即将要渲染的弹幕实例
      // 可以在这里做弹幕过滤，例如：屏蔽包含“敏感词”的弹幕
      // if (String(ref.danmaku).includes('敏感词')) ref.prevent = true;
      // console.log("willRender", ref.type, ref.danmaku);
      return ref;
    },
  },
  // .
});
