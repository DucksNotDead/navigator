import {ParserFunction} from "../model";
import {link, text} from "../utils";

interface Card {
	title: string;
	cover: string;
	url: string;
}

interface Item extends Card {
	id: string;
	description: string;
	date: string;
}

const selectors = {
	card: '.grants-box a',
	title: 'h3',
	date: '.post-date-day',
	body: '.post-body p:not(:has(a))',
}

export const minobrFn: ParserFunction = async ({ html, getContent, source: { baseURL } }) => {
	const cards = html.querySelectorAll(selectors.card).map<Card|null>(el => {
		const title = el.querySelector(selectors.title)?.rawText
		const cover = el.getAttribute('style')?.split('url(')[1]?.split(')')[0]
		const url = el.getAttribute('href')

		if (!title || !cover || !url) return null

		return { title, cover, url }
	}).filter(c => !!c)

	const items: Item[] = []

	for (const card of cards) {
		const url = baseURL + card?.url
		const content = await getContent(url)
		const id = card?.url.split('ELEMENT_ID=')[1]?.split('&')[0]!

		const date = content.querySelector(selectors.date)?.rawText!
		const textBlocks = content.querySelectorAll(selectors.body)
			.map(el => el.rawText)
			.filter(el => el.trim().length)

		const description = text(card?.title.length, textBlocks)

		items.push({ ...card, id, description, date, url, cover: baseURL + card?.cover })
	}

	return items.reverse().map(({ id, title, url, cover, description, date }) => ({
		id,
		title,
		blocks: [
			description,
			date,
			link('Посмотреть полностью', url)
		],
		imagePath: cover,
	}))
}