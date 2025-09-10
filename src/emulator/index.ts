import {chromium} from "playwright";
import {EmulateCallback} from "./model";

async function createBrowserPage() {
	const browser = await chromium.launch();

	const context = await browser.newContext({
		userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
		viewport: { width: 1280, height: 800 },
		locale: "ru-RU"
	});

	return { page: await context.newPage(), browser };
}

export function emulate(callback: EmulateCallback) {
	createBrowserPage().then(async ({ page, browser }) => {
		await callback(async (path) => {
			await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60000 });
			return await page.content();
		})

		await browser.close();
	})
}