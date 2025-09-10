"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sources = void 0;
exports.parse = parse;
const node_html_parser_1 = __importDefault(require("node-html-parser"));
const config_1 = require("./config");
Object.defineProperty(exports, "sources", { enumerable: true, get: function () { return config_1.sources; } });
const utils_1 = require("./utils");
async function parse({ source, getContent: globalGetContent, route, isFillMode }) {
    const getContent = async (path) => {
        const content = await globalGetContent(path);
        return node_html_parser_1.default.parse(content);
    };
    const results = await route.fn({
        html: await getContent(source.baseURL + route.path),
        source,
        getContent,
        isFillMode
    });
    return results.map(({ id: resultId, title, blocks, tags: resultTags, imagePath }) => {
        const id = (0, utils_1.snake)(source.idPrefix, ...(route.idPrefix ?? []), resultId);
        const reducedMainBlocks = [[(0, utils_1.b)(title)], ...blocks]
            .reduce((state, item) => [
            ...state,
            ...(typeof item === "string" ? [item] : item),
            ''
        ], []);
        return {
            id,
            content: (0, utils_1.v)(...reducedMainBlocks.map(str => (0, utils_1.normalize)(str)), (0, utils_1.tags)(route.tag, ...(resultTags ?? []), source.name)),
            imagePath
        };
    });
}
//# sourceMappingURL=index.js.map