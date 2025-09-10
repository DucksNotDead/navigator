"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emulator_1 = require("./emulator");
const parser_1 = require("./parser");
const bot_1 = require("./bot");
(0, emulator_1.emulate)(async (getContent) => {
    console.log('start');
    for (const source of parser_1.sources) {
        if (source.disabled)
            continue;
        for (const route of source.routes) {
            console.log('running', source.baseURL + route.path + '...');
            const results = await (0, parser_1.parse)({ getContent, source, route, isFillMode: false });
            for (const result of results) {
                await (0, bot_1.send)(result, result.imagePath ? result.imagePath : `${__dirname}/../assets/${source.logo}`);
                console.log(result.id, 'was sended');
            }
        }
    }
});
//# sourceMappingURL=index.js.map