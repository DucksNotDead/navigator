import {chromium} from "playwright";
import {EmulateCallback, EmulateCallbackArguments, EmulatorInstance} from "./model";
import {beforeRun} from "./beforeRun";

async function createBrowserPage(): Promise<EmulatorInstance> {
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
		const functions: EmulateCallbackArguments = {
			getContent: async (path) => {
				await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60000 });
				return await page.content();
			},
			download: async (selector) => {
				const [ download ] = await Promise.all([
					page.waitForEvent("download"),
					page.locator(selector).click(),
				]);

				return {
					url: download.url(),
					filename: download.suggestedFilename(),
				}
			},
			page,
		}

		await beforeRun({ browser, ...functions });

		await callback(functions)

		await browser.close();
	})
}