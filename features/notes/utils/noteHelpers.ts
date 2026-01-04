import { EnergyLevel, NoteMod } from '../types';

export const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

export const getModColor = (mod: NoteMod): string => {
    switch (mod) {
        case 'urgent':
            return '#EF4444';
        case 'important':
            return '#F59E0B';
        default:
            return '#6B7280';
    }
};

export const getModText = (mod: NoteMod): string => {
    switch (mod) {
        case 'urgent':
            return 'Acil';
        case 'important':
            return 'Önemli';
        default:
            return 'Normal';
    }
};

export const getEnergyText = (energy: EnergyLevel): string => {
    switch (energy) {
        case 'high':
            return 'Yüksek';
        case 'medium':
            return 'Orta';
        default:
            return 'Düşük';
    }
};

