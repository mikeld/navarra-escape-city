
import { common } from './common';
import { places } from './places';
import { quiz } from './quiz';
import { enigmas } from './enigmas';
import { glossary } from './glossary';

export default {
    ...common,
    ...places,
    ...quiz,
    ...enigmas,
    ...glossary,
    // Placeholders o valores por defecto para el resto
    history: {},
    characters: {},
    ega98: {},
    extended: {},
    auth: {},
    profile: {}
};
