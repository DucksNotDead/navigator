"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rnfFn = void 0;
const utils_1 = require("../utils");
const selectors = {
    row: '.classification-table-row',
    statusSuccess: '.contest-status > .contest-success',
    status: '.contest-status'
};
const rnfFn = async ({ html, source, isFillMode }) => {
    const statusesLength = html
        .querySelectorAll(isFillMode ? selectors.status : selectors.statusSuccess)
        .map(el => el.rawText).length;
    if (!statusesLength) {
        return [];
    }
    const rows = html
        .querySelectorAll(selectors.row)
        .filter((_, i) => i <= statusesLength);
    if (!rows.length) {
        return [];
    }
    const names = [];
    const values = [];
    const submitLinks = [];
    const docsLinks = [];
    let idIndex = null;
    let nameIndex = null;
    let statusIndex = null;
    let submitIndex = null;
    let docsIndex = null;
    rows.forEach((row, rowIndex) => {
        for (const colIndex in row.children) {
            const col = row.children[colIndex];
            const colNumber = Number(colIndex);
            const realRowIndex = rowIndex - 1;
            let text = (0, utils_1.pureText)(col.rawText.replace('*', ''));
            if (!rowIndex) {
                if (text.toLowerCase().includes('статус')) {
                    statusIndex = colNumber;
                }
                else if (text.toLowerCase().includes('приём заявок')) {
                    submitIndex = colNumber;
                }
                else if (text.toLowerCase().includes('документы')) {
                    docsIndex = colNumber;
                }
                else if (text.toLowerCase().includes('№')) {
                    idIndex = colNumber;
                }
                else if (text.toLowerCase().includes('наименование')) {
                    nameIndex = colNumber;
                }
                names.push(text);
            }
            else {
                if (colNumber >= names.length)
                    continue;
                else if (colNumber === submitIndex) {
                    text = text.toLowerCase().replace(' подать заявку', '');
                    let href = col.querySelector('a')?.attributes['href'];
                    href = href ? (0, utils_1.pureText)(href) : null;
                    submitLinks[realRowIndex] = href;
                }
                else if (colNumber === docsIndex) {
                    const links = col.querySelectorAll('a');
                    for (const link of links) {
                        const href = link.attributes['href'];
                        if (!href)
                            continue;
                        const title = (0, utils_1.pureText)(link.rawText);
                        if (!docsLinks[realRowIndex])
                            docsLinks[realRowIndex] = [];
                        docsLinks[realRowIndex].push({ title, href: (0, utils_1.pureText)(source.baseURL + href) });
                    }
                }
                if (!values[realRowIndex])
                    values[realRowIndex] = [];
                values[realRowIndex][colNumber] = text;
            }
        }
    });
    const freeIndexes = names.map((_, index) => {
        if ([
            idIndex,
            nameIndex,
            statusIndex,
            docsIndex,
        ].includes(index))
            return null;
        return index;
    }).filter(index => index !== null);
    return values.reverse().map((value, valueIndex) => {
        return {
            id: value[idIndex],
            title: value[nameIndex],
            blocks: [
                freeIndexes.map(index => {
                    const key = names[index];
                    const keyValue = value[index];
                    return (0, utils_1.li)(key, keyValue);
                }),
                (0, utils_1.li)('Подать заявку', submitLinks[valueIndex]),
                (0, utils_1.comma)(...(docsLinks[valueIndex]).map(({ title, href }) => (0, utils_1.link)(title, href))),
            ],
        };
    });
};
exports.rnfFn = rnfFn;
//# sourceMappingURL=rnf.js.map