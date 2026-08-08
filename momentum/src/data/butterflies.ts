import { Butterfly, RarityTier } from '../types';

export interface SpeciesTemplate {
  species: string;
  description: string;
  rarity: RarityTier;
  primaryColor: string;
  secondaryColor: string;
  wingPattern: 'monarch' | 'swallowtail' | 'morpho' | 'dream' | 'prism';
  discoveryHint?: string;
}

export const BUTTERFLY_SPECIES: SpeciesTemplate[] = [
  {
    species: 'Emerald Monarch',
    description: 'A serene forest butterfly known for its vivid emerald shimmer and steady flight.',
    rarity: 'Common',
    primaryColor: '#10B981',
    secondaryColor: '#34D399',
    wingPattern: 'monarch',
    discoveryHint: 'Complete any focus session of 10+ minutes.',
  },
  {
    species: 'Amber Opalwing',
    description: 'Radiates warm golden light reminiscent of peaceful afternoon study sessions.',
    rarity: 'Common',
    primaryColor: '#F59E0B',
    secondaryColor: '#FCD34D',
    wingPattern: 'swallowtail',
    discoveryHint: 'Complete a quick 15-minute study burst.',
  },
  {
    species: 'Rosewood Drifter',
    description: 'A gentle wanderer with dusty rose wings, perfect for warming up a study streak.',
    rarity: 'Common',
    primaryColor: '#F0A8A0',
    secondaryColor: '#FBC7C0',
    wingPattern: 'swallowtail',
    discoveryHint: 'Complete a morning focus session.',
  },
  {
    species: 'Meadow Larkwing',
    description: 'A cheerful yellow-green flutterer often spotted during short, steady focus bursts.',
    rarity: 'Common',
    primaryColor: '#84CC16',
    secondaryColor: '#D9F99D',
    wingPattern: 'monarch',
    discoveryHint: 'Complete a session with a High priority task.',
  },
  {
    species: 'Sunburst Swallowtail',
    description: 'Bright terracotta and crimson wing edges that flutter with high focus energy.',
    rarity: 'Uncommon',
    primaryColor: '#E37663',
    secondaryColor: '#F87171',
    wingPattern: 'swallowtail',
    discoveryHint: 'Focus for 25+ minutes without pausing.',
  },
  {
    species: 'Golden Silkwing',
    description: 'Silky metallic golden wings that dance gracefully in gentle garden breezes.',
    rarity: 'Uncommon',
    primaryColor: '#D97706',
    secondaryColor: '#FBBF24',
    wingPattern: 'monarch',
    discoveryHint: 'Complete 2 consecutive focus sessions.',
  },
  {
    species: 'Coral Driftwing',
    description: 'Playful coral-toned wings that flicker with the energy of a productive afternoon.',
    rarity: 'Uncommon',
    primaryColor: '#FB7185',
    secondaryColor: '#FDA4AF',
    wingPattern: 'swallowtail',
    discoveryHint: 'Break down a task into micro-steps.',
  },
  {
    species: 'Teal Lanternmoth',
    description: 'A cool teal specimen that seems to glow faintly after long evening study sessions.',
    rarity: 'Uncommon',
    primaryColor: '#0D9488',
    secondaryColor: '#5EEAD4',
    wingPattern: 'monarch',
    discoveryHint: 'Complete an evening study session.',
  },
  {
    species: 'Azure Blue Morpho',
    description: 'An enchanting iridescent blue specimen that shines brightly under sunlight.',
    rarity: 'Rare',
    primaryColor: '#2563EB',
    secondaryColor: '#38BDF8',
    wingPattern: 'morpho',
    discoveryHint: 'Complete a 30+ minute deep focus session.',
  },
  {
    species: 'Sage Whisper',
    description: 'Soft pastel sage wings that embody quiet, tranquil focus and mental calm.',
    rarity: 'Rare',
    primaryColor: '#059669',
    secondaryColor: '#A7F3D0',
    wingPattern: 'morpho',
    discoveryHint: 'Park a thought distraction during a timer.',
  },
  {
    species: 'Indigo Nightglow',
    description: 'Deep indigo wings flecked with silver, drawn out by deep uninterrupted work.',
    rarity: 'Rare',
    primaryColor: '#4338CA',
    secondaryColor: '#A5B4FC',
    wingPattern: 'morpho',
    discoveryHint: 'Complete a session with 2+ completed micro-steps.',
  },
  {
    species: 'Copper Emberwing',
    description: 'Fiery copper wings that seem to smolder gently, a sign of a hard-won study win.',
    rarity: 'Rare',
    primaryColor: '#C2410C',
    secondaryColor: '#FDBA74',
    wingPattern: 'swallowtail',
    discoveryHint: 'Complete a 40+ minute focus session.',
  },
  {
    species: 'Frostglass Wanderer',
    description: 'A rare pale-blue specimen with wings like etched glass, earned through icy focus.',
    rarity: 'Rare',
    primaryColor: '#7DD3FC',
    secondaryColor: '#E0F2FE',
    wingPattern: 'morpho',
    discoveryHint: 'Focus for 45+ minutes on a single goal.',
  },
  {
    species: 'Violet Dreamwings',
    description: 'Mystical radiant violet and magenta gradients awarded for deep, uninterrupted flow.',
    rarity: 'Epic',
    primaryColor: '#7C3AED',
    secondaryColor: '#F472B6',
    wingPattern: 'dream',
    discoveryHint: 'Complete 3+ focus sessions in one day.',
  },
  {
    species: 'Orchid Reverie',
    description: 'Dreamy orchid-purple gradients that shimmer during moments of deep concentration.',
    rarity: 'Epic',
    primaryColor: '#9333EA',
    secondaryColor: '#F0ABFC',
    wingPattern: 'dream',
    discoveryHint: 'Complete a High priority task.',
  },
  {
    species: 'Solstice Phoenixwing',
    description: 'An epic sunset-hued specimen said to appear only after a truly focused day.',
    rarity: 'Epic',
    primaryColor: '#EA580C',
    secondaryColor: '#FDE047',
    wingPattern: 'dream',
    discoveryHint: 'Complete a 50+ minute long session.',
  },
  {
    species: 'Starlight Prism',
    description: 'A legendary cosmic butterfly that reflects a dazzling prism of rainbow light.',
    rarity: 'Legendary',
    primaryColor: '#EC4899',
    secondaryColor: '#06B6D4',
    wingPattern: 'prism',
    discoveryHint: 'Achieve maximum flow score in long sessions.',
  },
  {
    species: 'Aurora Veilwing',
    description: 'A legendary specimen whose wings ripple like the northern lights across the sky.',
    rarity: 'Legendary',
    primaryColor: '#22D3EE',
    secondaryColor: '#A78BFA',
    wingPattern: 'prism',
    discoveryHint: 'Unlock 5+ unique species in your sanctuary.',
  },
];

export function generateRewardButterfly(goal: string, durationMinutes: number): Butterfly {
  // Higher duration gives slightly better chances for rare tiers!
  const roll = Math.random() * 100 + (durationMinutes >= 45 ? 18 : durationMinutes >= 25 ? 8 : 0);

  let allowedRarities: RarityTier[] = ['Common'];
  if (roll > 90) {
    allowedRarities = ['Legendary', 'Epic'];
  } else if (roll > 75) {
    allowedRarities = ['Epic', 'Rare'];
  } else if (roll > 50) {
    allowedRarities = ['Rare', 'Uncommon'];
  } else if (roll > 25) {
    allowedRarities = ['Uncommon', 'Common'];
  }

  const matches = BUTTERFLY_SPECIES.filter(s => allowedRarities.includes(s.rarity));
  const template = matches[Math.floor(Math.random() * matches.length)] || BUTTERFLY_SPECIES[0];

  // Guarantee valid non-null species name
  const speciesName = (template && template.species) ? template.species : 'Golden Monarch';
  const descriptionText = (template && template.description) ? template.description : 'A beautiful focus reward butterfly.';
  const rarityTier = (template && template.rarity) ? template.rarity : 'Common';
  const primaryCol = (template && template.primaryColor) ? template.primaryColor : '#D99B38';
  const secondaryCol = (template && template.secondaryColor) ? template.secondaryColor : '#FCD34D';
  const patternStyle = (template && template.wingPattern) ? template.wingPattern : 'monarch';

  return {
    id: `bf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    species: speciesName,
    description: descriptionText,
    rarity: rarityTier,
    primaryColor: primaryCol,
    secondaryColor: secondaryCol,
    wingPattern: patternStyle,
    earnedAt: new Date().toISOString(),
    sessionGoal: goal || 'Deep Focus Session',
    sessionDuration: durationMinutes,
    x: 10 + Math.random() * 80, // position 10% to 90%
    y: 15 + Math.random() * 70, // position 15% to 85%
    size: 46 + Math.random() * 18,
  };
}

// Initial starter butterflies - empty so the user starts fresh
export const INITIAL_BUTTERFLIES: Butterfly[] = [];
