"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sources = void 0;
const rnf_1 = require("./functions/rnf");
const tags_1 = require("../shared/tags");
const fiop_1 = require("./functions/fiop");
exports.sources = [
    {
        name: 'Российский научный фонд',
        baseURL: 'https://rscf.ru',
        idPrefix: 'РНФ',
        routes: [
            { path: '/contests/', fn: rnf_1.rnfFn, tag: tags_1.Tags.Competitions }
        ],
        logo: 'rnf-logo.png',
    },
    {
        name: 'Фонд инфраструктурных и образовательных программ',
        baseURL: 'https://fiop.site',
        idPrefix: 'ФИОП',
        maxItems: 6,
        routes: [
            { path: '/press-tsentr', fn: fiop_1.fiopFn, tag: tags_1.Tags.News }
        ],
        logo: 'fiop-logo.svg',
    },
];
//# sourceMappingURL=config.js.map