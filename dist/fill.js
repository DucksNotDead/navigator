"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emulator_1 = require("./emulator");
const parser_1 = require("./parser");
const bot_1 = require("./bot");
function shuffle(array) {
    const arr = [...array]; // чтобы не мутировать исходный массив
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        //@ts-ignore
        [arr[i], arr[j]] = [arr[j], arr[i]]; // обмен местами
    }
    return arr;
}
(0, emulator_1.emulate)(async (getContent) => {
    console.log('start fill');
    const items = [];
    for (const source of parser_1.sources) {
        if (source.disabled)
            continue;
        for (const route of source.routes) {
            console.log('running', source.baseURL + route.path + '...');
            const results = await (0, parser_1.parse)({ getContent, source, route, isFillMode: true });
            for (const result of results) {
                items.push({
                    msg: result,
                    mediaURL: result.imagePath ? result.imagePath : `${__dirname}/../assets/${source.logo}`
                });
                console.log(result.id, 'pushed');
            }
        }
    }
    console.log('shuffle...');
    for (const item of shuffle(items)) {
        await (0, bot_1.send)(item.msg, item.mediaURL);
        console.log(item.msg.id, 'was send');
    }
});
//# sourceMappingURL=fill.js.map