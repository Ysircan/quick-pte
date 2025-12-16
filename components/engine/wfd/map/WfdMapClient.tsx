"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { MapState, SerializedMapState } from "./mapTypes";
import { physicalNodeStyle, nodeTextStyle } from "./mapUi";
import {
  MAP_STORAGE_KEY,
  advanceFromNode,
  createInitialState,
  deserializeState,
  getRowIndex,
  serializeState,
} from "./mapState";
import styles from "./wfdMap.module.css";

export default function WfdMapClient() {
  const [hp] = useState(3);
  const router = useRouter();

  const mapRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [state, setState] = useState<MapState | null>(null);

  // init load
  useEffect(() => {
    const raw = window.localStorage.getItem(MAP_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as SerializedMapState;
        if ((parsed as any)?.graph?.version !== 2) throw new Error("Old map version");
        setState(deserializeState(parsed));
        return;
      } catch {
        // recreate
      }
    }
    const initial = createInitialState();
    setState(initial);
    window.localStorage.setItem(MAP_STORAGE_KEY, JSON.stringify(serializeState(initial)));
  }, []);

  // persist
  useEffect(() => {
    if (!state) return;
    window.localStorage.setItem(MAP_STORAGE_KEY, JSON.stringify(serializeState(state)));
  }, [state]);

  // draw lines
  useEffect(() => {
    if (!state) return;

    const { graph, activeEdges } = state;
    const { nodes, edges } = graph;

    const mapEl = mapRef.current;
    const svgEl = svgRef.current;
    if (!mapEl || !svgEl) return;

    const drawLines = () => {
      const w = mapEl.clientWidth;
      const h = mapEl.clientHeight;

      while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);

      edges.forEach((e) => {
        const from = nodes.find((n) => n.id === e.from);
        const to = nodes.find((n) => n.id === e.to);
        if (!from || !to) return;

        const key = `${e.from}-${e.to}`;
        const isActive = activeEdges.has(key);

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", ((from.x / 100) * w).toString());
        line.setAttribute("y1", ((from.y / 100) * h).toString());
        line.setAttribute("x2", ((to.x / 100) * w).toString());
        line.setAttribute("y2", ((to.y / 100) * h).toString());
        line.setAttribute(
          "class",
          isActive ? `${styles.edge} ${styles.edgeActive}` : styles.edge
        );

        svgEl.appendChild(line);
      });
    };

    drawLines();
    window.addEventListener("resize", drawLines);
    return () => window.removeEventListener("resize", drawLines);
  }, [state]);

  if (!state) {
    return (
      <main
        style={{
          margin: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111",
          color: "#fff",
        }}
      >
        Loading map.
      </main>
    );
  }

  const { graph, currentRow, selectedByRow, reachable, visited } = state;
  const { nodes } = graph;

  const handleNodeClick = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const rowIndex = getRowIndex(node);
    if (rowIndex !== currentRow) return;
    if (!reachable.has(node.id)) return;

    const parentId = rowIndex > 0 ? selectedByRow[rowIndex - 1] ?? null : null;
    const newState = advanceFromNode(state, node, rowIndex, parentId);
    setState(newState);

    const params = new URLSearchParams();
    params.set("node", node.id);
    params.set("kind", node.kind);
    if (node.isMystery) params.set("mystery", "1");
    params.set("floor", String(node.floor));

    router.push(`/engine/wfd/play?${params.toString()}`);
  };

  const resetMap = () => {
    const fresh = createInitialState();
    setState(fresh);
    window.localStorage.setItem(MAP_STORAGE_KEY, JSON.stringify(serializeState(fresh)));
  };

  return (
    <main
      style={{
        margin: 0,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111",
      }}
    >
      <div className={styles.map} ref={mapRef}>
        <div className={styles.hpBar}>
          <span>❤️ x{hp}</span>
          <span className={styles.hpBarSmall}>MAP 1 • seed {graph.seed}</span>
        </div>

        <svg ref={svgRef} className={styles.svg} />

        {nodes.map((n) => {
          const rowIndex = getRowIndex(n);
          const isVisited = visited.has(n.id);
          const isCurrentRow = rowIndex === currentRow;
          const hasChosenInRow = selectedByRow[rowIndex] != null;
          const isChosen = selectedByRow[rowIndex] === n.id;
          const isReachable = reachable.has(n.id);

          const isInteractive = !isVisited && !isChosen && isCurrentRow && isReachable;
          const isMuted = !isVisited && !isChosen && (!isInteractive || rowIndex > currentRow);

          const cls = [
            styles.node,
            n.kind === "BOSS" ? styles.boss : "",
            isChosen ? styles.nodeChosen : "",
            !isChosen && isVisited ? styles.nodeVisited : "",
            !isChosen && !isVisited && isCurrentRow && isReachable ? styles.nodeActive : "",
            rowIndex < currentRow || hasChosenInRow ? styles.nodeDisabled : "",
            rowIndex > currentRow ? styles.nodeFuture : "",
          ]
            .filter(Boolean)
            .join(" ");

          const centerText = n.kind === "BOSS" ? "BOSS" : n.kind;

          return (
            <div
              key={n.id}
              className={cls}
              style={{
                left: `${n.x}%`,
                top: `${n.y}%`,
                // 你要的：UNLOCK 也永远是实体
                ...physicalNodeStyle(n, isInteractive, isMuted),
                transform:
                  n.kind === "BOSS"
                    ? "translate(-50%,-50%) scale(1.35)"
                    : "translate(-50%,-50%)",
              }}
              onClick={() => handleNodeClick(n.id)}
              title={
                n.kind === "?"
                  ? `? (base ${n.baseKind}) • floor ${n.floor}`
                  : `${n.kind} • floor ${n.floor}`
              }
            >
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                  fontSize: n.kind === "BOSS" ? 10 : 16,
                  fontWeight: 900,
                  letterSpacing: n.kind === "BOSS" ? 0.6 : 1,
                  userSelect: "none",
                  pointerEvents: "none",
                  ...nodeTextStyle(n.kind, isMuted),
                }}
              >
                {centerText}
              </span>
            </div>
          );
        })}

        <div className={styles.foot}>
          <button type="button" className={styles.footBtn} onClick={resetMap}>
            R
          </button>
          <button type="button" className={styles.footBtn} data-map="1">
            1
          </button>
          <button type="button" className={`${styles.footBtn} ${styles.locked}`} data-map="2">
            2
          </button>
          <button type="button" className={`${styles.footBtn} ${styles.locked}`} data-map="3">
            3
          </button>

          <span className={styles.legend}>C / F / M / ? / BOSS</span>
        </div>
      </div>
    </main>
  );
}
