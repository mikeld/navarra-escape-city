
import React from 'react';
import { PlaceWithKeys } from '../data/places';
import { HistoryHub } from './history/HistoryHub';

import { Character } from '../types';

interface HistorySectionProps {
    onBack: () => void;
    places: PlaceWithKeys[];
    characters?: Character[]; // Optional to avoid breaking other usages if any, though we should pass it.
    initialView?: 'CHARACTERS' | 'PLACES';
}

export const HistorySection: React.FC<HistorySectionProps> = (props) => {
    return <HistoryHub {...props} characters={props.characters || []} />;
};
