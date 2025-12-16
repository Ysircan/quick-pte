export type NodeKind = "C" | "F" | "M" | "?" | "BOSS";

export type MapNode = {
  id: string;
  x: number; // %
  y: number; // %
  boss: boolean;

  floor: number; // 1..10
  kind: NodeKind; // 展示：C/F/M/?/BOSS
  baseKind: Exclude<NodeKind, "?">; // ? 覆盖前的真实类型
  isMystery: boolean;
};

export type MapEdge = { from: string; to: string };

export type Row = { y: number; xs: number[]; boss?: boolean };

export type MapGraph = {
  version: 2;
  seed: number;

  nodes: MapNode[];
  edges: MapEdge[];
  childrenMap: Record<string, string[]>;
  initialReachableIds: string[];
};

export type MapState = {
  graph: MapGraph;
  currentRow: number;
  selectedByRow: Record<number, string | null>;
  reachable: Set<string>;
  visited: Set<string>;
  activeEdges: Set<string>; // "from-to"
};

export type SerializedMapState = {
  graph: MapGraph;
  currentRow: number;
  selectedByRow: Record<number, string | null>;
  reachable: string[];
  visited: string[];
  activeEdges: string[];
};
