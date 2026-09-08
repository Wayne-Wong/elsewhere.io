'use client';
import { Moon, Heart, Sparkles, Leaf } from 'lucide-react';
export const characters = [
  {
    name: 'Rowan',
    description: 'Soft waves · warm tones',
    image: '/elsewhere-avatars.png',
  },
  {
    name: 'Mira',
    description: 'Dark waves · earrings',
    image: '/elsewhere-mira.png',
  },
  {
    name: 'Kai',
    description: 'Textured curls · headphones',
    image: '/elsewhere-kai.png',
  },
];
export const looks = [
  'Everyday',
  'Graduate',
  'Office',
  'Maker',
  'Explorer',
  'Silver years',
];
export type Appearance = { character: number; look: number; charm: number };
export const defaultAppearance: Appearance = {
  character: 0,
  look: -1,
  charm: 0,
};
export function validAppearance(a: unknown): a is Appearance {
  const p = a as Appearance;
  return (
    !!p &&
    Number.isInteger(p.character) &&
    p.character >= 0 &&
    p.character < characters.length &&
    Number.isInteger(p.look) &&
    p.look >= -1 &&
    p.look < 6 &&
    Number.isInteger(p.charm) &&
    p.charm >= 0 &&
    p.charm < 5
  );
}
export const charms = [
  { name: 'None', icon: null },
  { name: 'Moon', icon: Moon },
  { name: 'Heart', icon: Heart },
  { name: 'Stardust', icon: Sparkles },
  { name: 'Leaf', icon: Leaf },
];
export default function Avatar({
  index = 0,
  large = false,
  appearance = defaultAppearance,
}: {
  index?: number;
  large?: boolean;
  appearance?: Appearance;
}) {
  const look = appearance.look < 0 ? index : appearance.look,
    character = characters[appearance.character] || characters[0],
    Charm = charms[appearance.charm]?.icon;
  return (
    <div className={`avatar-wrapper ${large ? 'large' : ''}`}>
      <div
        role="img"
        aria-label={`${character.name}, ${looks[look]} outfit`}
        className={'avatar ' + (large ? 'large' : '')}
        style={{
          backgroundImage: `url('${character.image}')`,
          backgroundPosition: `${look * 20}% center`,
        }}
      />
      {Charm && (
        <span
          className="avatar-charm"
          aria-label={`${charms[appearance.charm].name} charm`}
        >
          <Charm size={21} />
        </span>
      )}
    </div>
  );
}
