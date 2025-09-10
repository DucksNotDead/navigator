"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snake = snake;
exports.camel = camel;
exports.pureText = pureText;
exports.b = b;
exports.v = v;
exports.li = li;
exports.link = link;
exports.comma = comma;
exports.tags = tags;
exports.normalize = normalize;
function snake(...args) {
    return args.map(str => str.replaceAll(' ', '_')).join('_');
}
function camel(str) {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}
function pureText(str) {
    return str
        .replace(/\s+/g, ' ')
        .trim();
}
function b(str) {
    return `<b>${str}</b>`;
}
function v(...args) {
    return args.join('\n');
}
function li(key, value) {
    return `${b(`${key}:`)}\n– ${value}`;
}
function link(title, href) {
    return `<a href="${href}">${title}</a>`;
}
function comma(...args) {
    return args.join(', ');
}
function tags(...args) {
    return args.map(str => `#${snake(str)}`).join(' ');
}
function normalize(str) {
    return str
        .split('\n')
        .map(s => s.trim())
        .join('\n')
        .replaceAll('\t', '')
        .replace(/&nbsp;/g, ' ');
}
//# sourceMappingURL=utils.js.map