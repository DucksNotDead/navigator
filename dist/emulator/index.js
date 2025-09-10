"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emulate = emulate;
const playwright_1 = require("playwright");
async function createBrowserPage() {
    const browser = await playwright_1.chromium.launch();
    const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        viewport: { width: 1280, height: 800 },
        locale: "ru-RU"
    });
    return { page: await context.newPage(), browser };
}
function emulate(callback) {
    createBrowserPage().then(async ({ page, browser }) => {
        await callback(async (path) => {
            await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60000 });
            return await page.content();
        });
        await browser.close();
    });
}
//# sourceMappingURL=index.js.map