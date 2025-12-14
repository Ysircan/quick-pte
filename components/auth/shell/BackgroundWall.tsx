'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { COLORS, WORDS, type Rarity } from './data';
import { mulberry32 } from './prng';
import Card, { type CardData } from './Card';

function buildLaneCards(seed: number): CardData[] {
  const rnd = mulberry32(seed);
  const pickColor = () => COLORS[Math.floor(rnd() * COLORS.length)];

  const makeCard = (w: string, m: string, r: Rarity, idx: number): CardData => {
    const badgeLeft: 'LIVE' | 'RARE' | 'EPIC' = r === 'EPIC' ? 'EPIC' : r === 'RARE' ? 'RARE' : 'LIVE';
    const leftClass = r === 'RARE' || r === 'EPIC' ? 'pill rare' : 'pill';
    return {
      key: `${seed}-${idx}-${w}`,
      word: w,
      meaning: m,
      rarity: r,
      color: pickColor(),
      badgeLeft,
      leftClass,
      likesK: 60 + Math.floor(rnd() * 120),
      viewsK: 40 + Math.floor(rnd() * 90),
    };
  };

  const result: CardData[] = [];
  let idx = 0;
  for (let i = 0; i < 10; i++) {
    const [w, m, r] = WORDS[(seed + i * 3) % WORDS.length];
    result.push(makeCard(w, m, r, idx++));
  }
  for (let i = 0; i < 10; i++) {
    const [w, m, r] = WORDS[(seed + i * 5 + 7) % WORDS.length];
    result.push(makeCard(w, m, r, idx++));
  }
  return result;
}

export default function BackgroundWall() {
  const laneInnerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const animStateRef = useRef<Array<{ y: number; dir: 1 | -1 }>>([]);
  const rafRef = useRef<number | null>(null);

  const speedFactorRef = useRef(1.0);
  const targetFactorRef = useRef(1.0);

  const lanesData = useMemo(() => {
    const laneCount = 4;
    return Array.from({ length: laneCount }, (_, i) => buildLaneCards(i * 4));
  }, []);

  useEffect(() => {
    const prefersReduce =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReduce) return;

    animStateRef.current = lanesData.map((_, i) => ({
      y: i % 2 ? -220 : -60,
      dir: (i % 2 ? 1 : -1) as 1 | -1,
    }));

    const baseSpeed = 18;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      const speed = speedFactorRef.current;
      const target = targetFactorRef.current;
      speedFactorRef.current = speed + (target - speed) * (1 - Math.pow(0.001, dt));

      laneInnerRefs.current.forEach((inner, idx) => {
        if (!inner) return;
        const st = animStateRef.current[idx];
        const laneSpeed = baseSpeed * (0.9 + idx * 0.12) * speedFactorRef.current;

        st.y += st.dir * laneSpeed * dt;

        const h = inner.scrollHeight;
        if (h > 0) {
          if (st.y > 0) st.y = -h / 2;
          if (st.y < -h / 2) st.y = 0;
        }
        inner.style.transform = `translateY(${st.y}px)`;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [lanesData]);

  return (
    <div className="bgStage" aria-hidden="true">
      <div className="bgWall">
        <div className="spot" />
        <div className="lanes">
          {lanesData.map((cards, i) => {
            const doubled = [...cards, ...cards];
            return (
              <div className="lane" key={`lane-${i}`}>
                <div
                  className="laneInner"
                  ref={(el) => {
                    laneInnerRefs.current[i] = el;
                  }}
                >
                  {doubled.map((c, idx) => (
                    <Card data={{ ...c, key: `${c.key}-d${idx}` }} key={`${c.key}-d${idx}`} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
