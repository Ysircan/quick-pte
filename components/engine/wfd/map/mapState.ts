import { ROWS } from "./mapConfig";
import type { MapNode, MapState, SerializedMapState } from "./mapTypes";
import { buildGraph } from "./mapGraph";

export const MAP_STORAGE_KEY = "quick-engine-wfd-map-v2";

export function getRowIndex(node: MapNode): number {
  return ROWS.findIndex((r) => r.y === node.y);
}

export function getNodesInRow(nodes: MapNode[], rowIndex: number): MapNode[] {
  const row = ROWS[rowIndex];
  if (!row) return [];
  return nodes.filter((n) => n.y === row.y);
}

export const MAX_ROW_INDEX = ROWS.length - 1;

export function serializeState(state: MapState): SerializedMapState {
  return {
    graph: state.graph,
    currentRow: state.currentRow,
    selectedByRow: state.selectedByRow,
    reachable: Array.from(state.reachable),
    visited: Array.from(state.visited),
    activeEdges: Array.from(state.activeEdges),
  };
}

export function deserializeState(data: SerializedMapState): MapState {
  return {
    graph: data.graph,
    currentRow: data.currentRow,
    selectedByRow: data.selectedByRow,
    reachable: new Set(data.reachable),
    visited: new Set(data.visited),
    activeEdges: new Set(data.activeEdges),
  };
}

export function createInitialState(): MapState {
  const seed = Math.floor(Math.random() * 2_000_000_000);
  const graph = buildGraph(ROWS, seed);
  return {
    graph,
    currentRow: 0,
    selectedByRow: {},
    reachable: new Set(graph.initialReachableIds),
    visited: new Set(),
    activeEdges: new Set(),
  };
}

export function advanceFromNode(
  prev: MapState,
  node: MapNode,
  rowIndex: number,
  parentId: string | null
): MapState {
  const selectedByRow = { ...prev.selectedByRow, [rowIndex]: node.id };

  const visited = new Set(prev.visited);
  visited.add(node.id);

  const activeEdges = new Set(prev.activeEdges);
  if (parentId) activeEdges.add(`${parentId}-${node.id}`);

  const nextRow = rowIndex + 1;
  if (nextRow > MAX_ROW_INDEX) {
    return {
      ...prev,
      selectedByRow,
      visited,
      activeEdges,
      currentRow: rowIndex,
      reachable: new Set(),
    };
  }

  const childIds = prev.graph.childrenMap[node.id] ?? [];
  const nextRowNodes = getNodesInRow(prev.graph.nodes, nextRow).filter((n) =>
    childIds.includes(n.id)
  );
  const reachable = new Set(nextRowNodes.map((n) => n.id));

  return {
    ...prev,
    selectedByRow,
    visited,
    activeEdges,
    currentRow: nextRow,
    reachable,
  };
}
