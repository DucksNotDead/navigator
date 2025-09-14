import {ParserFunction, ParserFunctionResult} from "../../model";
import {link, text} from "../../utils";

interface Item {
	link: string;
	title: string;
	cover: string;
	description: string;
	date: string;
}

const selectors = {
	li: 'li',
	title: '.js-feed-post-title',
	cover: '#feed-cover img',
	closeButton: 'button.js-feed-popup-close',
	text: '.js-feed-post-text .t-redactor__text',
	date: '.js-feed-post-date',
}

export const atrNewsFn: ParserFunction = async ({ page, getContent }) => {
	await page.waitForSelector(selectors.li)

	const listItems = await page.locator(selectors.li).all()

	const links: string[] = []

	for (const listItem of listItems) {
		await listItem.click()

		links.push(page.url())

		await page.locator(selectors.closeButton).click()

		await page.waitForSelector(selectors.li)
	}

	const items: Item[] = []

	for (const link of links) {
		const content = await getContent(link);

		const title = content.querySelector(selectors.title)?.rawText
		const cover = content.querySelector(selectors.cover)?.getAttribute('src')
		const date = content.querySelector(selectors.date)?.rawText

		if (!title || !cover || !date) continue;

		const textBlocks = content.querySelector(selectors.text)!.rawText.split('\n')
			.filter(block => block?.trim().length)
		const description = text(title.length, textBlocks)

		items.push({ link, title, cover, description, date })
	}

	return items.reverse().map<ParserFunctionResult>(({ link: itemLink, title, cover, description, date }) => {
		const id = itemLink.split('post/')[1]!
		return {
			id,
			title,
			blocks: [
				description,
				date,
				link('Посмотреть полностью', itemLink)
			],
			imagePath: cover,
		}
	});
}