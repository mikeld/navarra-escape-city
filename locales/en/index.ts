
import { common } from './common';
import { places } from './places';
import { quiz } from './quiz';
import { enigmas } from './enigmas';

export default {
    ...common,
    ...places,
    ...quiz,
    enigmas: {
        ...(common.enigmas || {}),
        ...enigmas
    },
    history: {},
    characters: {},
    ega98: {},
    extended: {},
    auth: {},
    profile: {}
};
