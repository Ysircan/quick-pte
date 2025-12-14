'use client';

import type { ColorClass, Rarity } from './data';

export type CardData = {
  key: string;
  word: string;
  meaning: string;
  rarity: Rarity;
  color: ColorClass;
  badgeLeft: 'LIVE' | 'RARE' | 'EPIC';
  leftClass: string;
  likesK: number;
  viewsK: number;
};

export default function Card({ data }: { data: CardData }) {
  return (
    <div className={`card ${data.color}`}>
      <div className="meta">
        <span className={data.leftClass}>{data.badgeLeft}</span>
        <span className="pill drop">DROP</span>
      </div>
      <div className="title">{data.word}</div>
      <div className="meaning">{data.meaning}</div>
      <div className="stats">
        <span>♥ {data.likesK}K</span>
        <span>↻ {data.viewsK}K</span>
      </div>
    </div>
  );
}
