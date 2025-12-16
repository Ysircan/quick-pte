import type { MapNode, NodeKind } from "./mapTypes";

export function physicalNodeStyle(
  n: MapNode,
  isInteractive: boolean,
  isMuted: boolean
): React.CSSProperties {
  const ink = "#111";

  // 基础奶油黄（实体感）
  let top = "rgba(255, 248, 214, 0.95)";
  let mid = "rgba(255, 231, 154, 0.95)";
  let bot = "rgba(255, 210, 90, 0.95)";

  if (n.kind === "M") {
    // 警告：橙红偏色，但仍实体材质
    top = "rgba(255, 240, 210, 0.95)";
    mid = "rgba(255, 204, 120, 0.95)";
    bot = "rgba(255, 150, 70, 0.92)";
  } else if (n.kind === "?") {
    // 神秘：淡紫奶油
    top = "rgba(245, 238, 255, 0.95)";
    mid = "rgba(216, 199, 255, 0.92)";
    bot = "rgba(170, 140, 255, 0.82)";
  } else if (n.kind === "BOSS") {
    // Boss：压迫红（仍实体）
    top = "rgba(255, 226, 220, 0.95)";
    mid = "rgba(255, 166, 150, 0.92)";
    bot = "rgba(255, 90, 70, 0.82)";
  } else if (n.kind === "F") {
    // F：稍微偏纸一点（轻区分）
    top = "rgba(250, 248, 235, 0.95)";
    mid = "rgba(235, 228, 200, 0.95)";
    bot = "rgba(220, 210, 175, 0.95)";
  }

  const hardShadow = isMuted ? `4px 4px 0 rgba(17,17,17,.55)` : `6px 6px 0 ${ink}`;
  const hintRing = isInteractive ? "0 0 0 3px rgba(255,255,255,.10)" : "0 0 0 0 rgba(0,0,0,0)";

  const innerHi = "inset 0 2px 0 rgba(255,255,255,.55)";
  const innerLo = "inset 0 -3px 0 rgba(0,0,0,.16)";
  const innerCore = "inset 0 0 10px rgba(0,0,0,.10)";

  return {
    border: `3px solid ${ink}`,
    background: `radial-gradient(circle at 35% 30%, ${top} 0%, ${mid} 48%, ${bot} 100%)`,
    boxShadow: `${hardShadow}, ${hintRing}, ${innerHi}, ${innerLo}, ${innerCore}`,
    opacity: isMuted ? 0.62 : 1,
    filter: isMuted ? "saturate(.85)" : "none",
  };
}

export function nodeTextStyle(kind: NodeKind, isMuted: boolean): React.CSSProperties {
  const ink = "#111";
  const baseShadow = "0 1px 0 rgba(255,255,255,.35), 0 2px 0 rgba(0,0,0,.25)";
  const glow =
    kind === "M"
      ? "0 0 10px rgba(255, 140, 60, .35)"
      : kind === "?"
        ? "0 0 10px rgba(160, 120, 255, .35)"
        : kind === "BOSS"
          ? "0 0 10px rgba(255, 90, 70, .30)"
          : "0 0 8px rgba(0,0,0,.08)";

  return {
    color: ink,
    opacity: isMuted ? 0.8 : 0.95,
    textShadow: `${baseShadow}, ${glow}`,
  };
}
