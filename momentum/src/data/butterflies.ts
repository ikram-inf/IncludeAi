import { Butterfly, RarityTier } from '../types';

export interface SpeciesTemplate {
  species: string;
  description: string;
  rarity: RarityTier;
  primaryColor: string;
  secondaryColor: string;
  wingPattern: 'monarch' | 'swallowtail' | 'morpho' | 'dream' | 'prism';
}

export const BUTTERFLY_SPECIES: SpeciesTemplate[] = [
  {
    species: 'Emerald Monarch',
    description: 'A serene forest butterfly known for its vivid emerald shimmer and steady flight.',
    rarity: 'Common',
    primaryColor: '#10B981',
    secondaryColor: '#34D399',
    wingPattern: 'monarch',
  },
  {
    species: 'Amber Opalwing',
    description: 'Radiates warm golden light reminiscent of peaceful afternoon study sessions.',
    rarity: 'Common',
    primaryColor: '#F59E0B',
    secondaryColor: '#FCD34D',
    wingPattern: 'swallowtail',
  },
  {
    species: 'Sunburst Swallowtail',
    description: 'Bright terracotta and crimson wing edges that flutter with high focus energy.',
    rarity: 'Uncommon',
    primaryColor: '#E37663',
    secondaryColor: '#F87171',
    wingPattern: 'swallowtail',
  },
  {
    species: 'Golden Silkwing',
    description: 'Silky metallic golden wings that dance gracefully in gentle garden breezes.',
    rarity: 'Uncommon',
    primaryColor: '#D97706',
    secondaryColor: '#FBBF24',
    wingPattern: 'monarch',
  },
  {
    species: 'Azure Blue Morpho',
    description: 'An enchanting iridescent blue specimen that shines brightly under sunlight.',
    rarity: 'Rare',
    primaryColor: '#2563EB',
    secondaryColor: '#38BDF8',
    wingPattern: 'morpho',
  },
  {
    species: 'Sage Whisper',
    description: 'Soft pastel sage wings that embody quiet, tranquil focus and mental calm.',
    rarity: 'Rare',
    primaryColor: '#059669',
    secondaryColor: '#A7F3D0',
    wingPattern: 'morpho',
  },
  {
    species: 'Violet Dreamwings',
    description: 'Mystical radiant violet and magenta gradients awarded for deep, uninterrupted flow.',
    rarity: 'Epic',
    primaryColor: '#7C3AED',
    secondaryColor: '#F472B6',
    wingPattern: 'dream',
  },
  {
    species: 'Starlight Prism',
    description: 'A legendary cosmic butterfly that reflects a dazzling prism of rainbow light.',
    rarity: 'Legendary',
    primaryColor: '#EC4899',
    secondaryColor: '#06B6D4',
    wingPattern: 'prism',
  },
];

export function generateRewardButterfly(goal: string, durationMinutes: number): Butterfly {
  // Higher duration gives slightly better chances for rare tiers!
  const roll = Math.random() * 100 + (durationMinutes >= 45 ? 15 : durationMinutes >= 25 ? 5 : 0);

  let allowedRarities: RarityTier[] = ['Common'];
  if (roll > 92) {
    allowedRarities = ['Legendary', 'Epic'];
  } else if (roll > 80) {
    allowedRarities = ['Epic', 'Rare'];
  } else if (roll > 55) {
    allowedRarities = ['Rare', 'Uncommon'];
  } else if (roll > 30) {
    allowedRarities = ['Uncommon', 'Common'];
  }

  const matches = BUTTERFLY_SPECIES.filter(s => allowedRarities.includes(s.rarity));
  const selectedTemplate = matches[Math.floor(Math.random() * matches.length)] || BUTTERFLY_SPECIES[0];

  return {
    id: `bf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    species: selectedTemplate.species,
    description: selectedTemplate.description,
    rarity: selectedTemplate.rarity,
    primaryColor: selectedTemplate.primaryColor,
    secondaryColor: selectedTemplate.secondaryColor,
    wingPattern: selectedTemplate.wingPattern,
    earnedAt: new Date().toISOString(),
    sessionGoal: goal || 'Deep Focus Session',
    sessionDuration: durationMinutes,
    x: 15 + Math.random() * 70, // position 15% to 85%
    y: 20 + Math.random() * 60, // position 20% to 80%
    size: 40 + Math.random() * 20,
  };
}

// Start with an empty garden; butterflies are earned through sessions.
export const INITIAL_BUTTERFLIES: Butterfly[] = [];
