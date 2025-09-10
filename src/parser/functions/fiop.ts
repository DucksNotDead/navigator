import {ParserFunction} from "../model";
import {link, text} from "../utils";

interface Item {
	title: string;
	description: string;
	imageURL: string | undefined;
	href: string;
	tag: string;
}

const selectors = {
	image: '.newsCard__image',
	wrapper: '.newsCard__wrap',
	title: '.newsCard__head',
	date: '.newsCard__date',
	tag: '.newsCard__type-caption',
	source: '.newsCard__source',
	text: '.formatedText:first-child p:not([class])'
}

export const fiopFn: ParserFunction = async ({ html, getContent, source, isFillMode }) => {
	const items: Item[] = []

	const elements = html
		.querySelectorAll(selectors.wrapper)
		.filter((_, i) => i < (isFillMode ? 24 : source.maxItems ?? 6))

	for (const element of elements) {
		const imageEl = element.querySelector(selectors.image)
		const href = imageEl?.attributes['href']
		if (!imageEl || !href) continue;

		const { image, wrapper, ...keys } = selectors;
		for (const key in keys) {
			keys[key as keyof typeof keys] = element.querySelector(selectors[key as keyof typeof selectors])?.rawText!
		}

		const imageURL =  source.baseURL + imageEl.querySelector('span')?.attributes['style']?.split('url(')[1]?.replace(');', '')

		const innerContent = await getContent(href)
		const textBlocks = innerContent
			.querySelectorAll(selectors.text)
			.filter(el => el.rawText.trim().length)
			.map(el => el.rawText);
		const description = text(keys.title.length, textBlocks)

		items.push({
			title: keys.title,
			tag: keys.tag,
			description,
			href,
			imageURL,
		})
	}

	return items.reverse().map(({ title, tag, href, description, imageURL }) => {
		const ids = href.split('/').filter(path => path.length)
		const id = ids[ids.length - 1]!

		return {
			id,
			title,
			blocks: [
				description,
				link('Посмотреть полностью', href)
			],
			imagePath: imageURL,
			tags: [tag]
		}
	})
}