export type NoteMod = 'normal' | 'urgent' | 'important';

export type EnergyLevel = 'low' | 'medium' | 'high';

export interface Note {
  id: string;
  title: string;
  content: string;
  mod: NoteMod;
  energy_level: EnergyLevel;
  createdAt: Date;
}

