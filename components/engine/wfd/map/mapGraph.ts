import { ROWS } from "./mapConfig";
import type { MapEdge, MapGraph, MapNode, NodeKind, Row } from "./mapTypes";

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function rng() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickOne<T>(arr: T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)];
}

function makeKinds(
  count: number,
  c: number,
  f: number,
  m: number
): Exclude<NodeKind, "?" | "BOSS">[] {
  const out: Exclude<NodeKind, "?" | "BOSS">[] = [];
  for (let i = 0; i < c; i++) out.push("C");
  for (let i = 0; i < f; i++) out.push("F");
  for (let i = 0; i < m; i++) out.push("M");
  while (out.length < count) out.push("C");
  return out.slice(0, count);
}

/**
 * 生成规则 v3（按你定稿）：
 * - 1~3 层：无 M，仅 C/F
 *   1~2 层（4点）：3/1、2/2、1/3
 *   3 层（5点）：3/2、2/3、1/4、4/1
 * - 4、7 层（3点）：M ∈ {1,2}
 * - 8 层（3点）：M ∈ {0,1,2}（允许 0；若 0 则必须 C+F 同时存在）
 * - 5~6：自由
 * - 9：自由（2点给两路选择）
 * - 10：BOSS
 * - ?：随机 3 个，覆盖任意非 BOSS（尽量分散楼层）
 */
function applyGenerationRules(graph: MapGraph): MapGraph {
  const rnd = mulberry32(graph.seed);
  const newNodes = graph.nodes.map((n) => ({ ...n }));

  const setFloorKinds = (floor: number, kinds: Exclude<NodeKind, "?" | "BOSS">[]) => {
    const targets = newNodes.filter((n) => n.floor === floor && !n.boss);
    const ks = shuffle(kinds, rnd);
    targets.forEach((n, i) => {
      const k = ks[i] ?? "C";
      n.kind = k;
      n.baseKind = k;
      n.isMystery = false;
    });
  };

  // 1~2
  const floor12Options: Array<[number, number]> = [
    [3, 1],
    [2, 2],
    [1, 3],
  ];
  for (const f of [1, 2]) {
    const [c, fo] = pickOne(floor12Options, rnd);
    setFloorKinds(f, makeKinds(4, c, fo, 0));
  }

  // 3
  const floor3Options: Array<[number, number]> = [
    [3, 2],
    [2, 3],
    [1, 4],
    [4, 1],
  ];
  {
    const [c, fo] = pickOne(floor3Options, rnd);
    setFloorKinds(3, makeKinds(5, c, fo, 0));
  }

  // 4 (M 1..2)
  {
    const m = rnd() < 0.5 ? 1 : 2;
    if (m === 1) setFloorKinds(4, (["C", "F", "M"] as any));
    else {
      const last: Exclude<NodeKind, "?" | "BOSS"> = rnd() < 0.5 ? "C" : "F";
      setFloorKinds(4, (["M", "M", last] as any));
    }
  }

  // 5 自由（不无聊）
  {
    const m = rnd() < 0.35 ? 0 : rnd() < 0.75 ? 1 : 2;
    if (m === 0) {
      const [c, fo] = pickOne(
        [
          [3, 2],
          [2, 3],
        ],
        rnd
      );
      setFloorKinds(5, makeKinds(5, c, fo, 0));
    } else if (m === 1) {
      setFloorKinds(5, makeKinds(5, 2, 2, 1));
    } else {
      const [c, fo] = pickOne(
        [
          [2, 1],
          [1, 2],
        ],
        rnd
      );
      setFloorKinds(5, makeKinds(5, c, fo, 2));
    }
  }

  // 6 自由
  {
    const m = rnd() < 0.45 ? 0 : rnd() < 0.8 ? 1 : 2;
    if (m === 0) {
      const [c, fo] = pickOne(
        [
          [3, 1],
          [2, 2],
          [1, 3],
        ],
        rnd
      );
      setFloorKinds(6, makeKinds(4, c, fo, 0));
    } else if (m === 1) {
      const [c, fo] = pickOne(
        [
          [2, 1],
          [1, 2],
        ],
        rnd
      );
      setFloorKinds(6, makeKinds(4, c, fo, 1));
    } else {
      const [c, fo] = pickOne(
        [
          [1, 1],
          [2, 0],
          [0, 2],
        ],
        rnd
      );
      setFloorKinds(6, makeKinds(4, c, fo, 2));
    }
  }

  // 7 (M 1..2)
  {
    const m = rnd() < 0.55 ? 1 : 2;
    if (m === 1) setFloorKinds(7, (["M", "C", "F"] as any));
    else {
      const last: Exclude<NodeKind, "?" | "BOSS"> = rnd() < 0.5 ? "C" : "F";
      setFloorKinds(7, (["M", "M", last] as any));
    }
  }

  // 8 (M 0..2) 允许 0
  {
    const r = rnd();
    const m = r < 0.35 ? 0 : r < 0.8 ? 1 : 2;
    if (m === 0) {
      const [c, fo] = pickOne(
        [
          [2, 1],
          [1, 2],
        ],
        rnd
      );
      setFloorKinds(8, makeKinds(3, c, fo, 0));
    } else if (m === 1) {
      setFloorKinds(8, (["M", "C", "F"] as any));
    } else {
      const last: Exclude<NodeKind, "?" | "BOSS"> = rnd() < 0.5 ? "C" : "F";
      setFloorKinds(8, (["M", "M", last] as any));
    }
  }

  // 9（2点两路）
  {
    const opts: Array<[Exclude<NodeKind, "?" | "BOSS">, Exclude<NodeKind, "?" | "BOSS">]> = [
      ["C", "F"],
      ["C", "M"],
      ["F", "M"],
    ];
    const [a, b] = pickOne(opts, rnd);
    setFloorKinds(9, ([a, b] as any));
  }

  // 10 boss
  newNodes.forEach((n) => {
    if (n.boss) {
      n.kind = "BOSS";
      n.baseKind = "BOSS";
      n.isMystery = false;
    }
  });

  // 放 3 个 ?（非 boss，尽量分散楼层）
  const candidates = newNodes.filter((n) => !n.boss && n.floor >= 2 && n.floor <= 9);
  const shuffled = shuffle(candidates, rnd);

  const picked: MapNode[] = [];
  const pickedFloors: number[] = [];

  const tryPick = (gap: number) => {
    for (const n of shuffled) {
      if (picked.length >= 3) break;
      if (picked.some((p) => p.id === n.id)) continue;
      if (pickedFloors.some((f) => Math.abs(f - n.floor) < gap)) continue;
      picked.push(n);
      pickedFloors.push(n.floor);
    }
  };

  tryPick(2);
  if (picked.length < 3) tryPick(1);

  picked.slice(0, 3).forEach((n) => {
    n.isMystery = true;
    n.kind = "?";
  });

  return { ...graph, nodes: newNodes };
}

export function buildGraph(sourceRows: Row[] = ROWS, seed: number): MapGraph {
  const nodes: MapNode[] = [];
  const edges: MapEdge[] = [];
  let idCounter = 1;

  // nodes
  sourceRows.forEach((row, rowIndex) => {
    row.xs.forEach((x) => {
      const isBoss = !!row.boss;
      const floor = rowIndex + 1;

      nodes.push({
        id: "n" + idCounter++,
        x,
        y: row.y,
        boss: isBoss,

        floor,
        kind: isBoss ? "BOSS" : "C",
        baseKind: isBoss ? "BOSS" : "C",
        isMystery: false,
      });
    });
  });

  // edges（⚠️ 连接算法不要改动：原样保留）
  for (let i = 1; i < sourceRows.length; i++) {
    const cur = nodes.filter((n) => n.y === sourceRows[i].y);
    const prev = nodes.filter((n) => n.y === sourceRows[i - 1].y);

    // 当前行每个节点至少连上一行最近的一个
    cur.forEach((c) => {
      const sorted = prev
        .map((p) => ({ p, dist: Math.abs(p.x - c.x) }))
        .sort((a, b) => a.dist - b.dist);

      if (sorted[0]) edges.push({ from: sorted[0].p.id, to: c.id });

      if (sorted[1] && sorted[1].dist < 20 && Math.random() < 0.5) {
        edges.push({ from: sorted[1].p.id, to: c.id });
      }
    });

    // 确保上一行每个节点至少有一条出去的边
    prev.forEach((p) => {
      const hasOut = edges.some((e) => e.from === p.id);
      if (!hasOut) {
        const closest = cur
          .map((c) => ({ c, dist: Math.abs(c.x - p.x) }))
          .sort((a, b) => a.dist - b.dist)[0];
        if (closest) edges.push({ from: p.id, to: closest.c.id });
      }
    });
  }

  const childrenMap: Record<string, string[]> = {};
  edges.forEach((e) => {
    if (!childrenMap[e.from]) childrenMap[e.from] = [];
    childrenMap[e.from].push(e.to);
  });

  const bottomRowY = sourceRows[0].y;
  const bottomRowNodes = nodes.filter((n) => n.y === bottomRowY);
  const initialReachableIds = bottomRowNodes.map((n) => n.id);

  const graph: MapGraph = {
    version: 2,
    seed,
    nodes,
    edges,
    childrenMap,
    initialReachableIds,
  };

  return applyGenerationRules(graph);
}
