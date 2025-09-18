import {ParserFunction, ParserFunctionResult} from "../../model";
import {isNotFutureDate, li, lowerFirstIfNotUppercase, normalize, normalizedDate} from "../../utils";

interface RootLink {
	title: string;
	url: string;
}

interface Item {
	id: string;
	title: string;
	cost: string;
	idPrefix: string;
	params: { key: string, value: string }[]
}

const selectors = {
	root: 'a.tn-group',
	title: '.tn-atom',
	product: {
		link: '.js-store-grid-cont > .js-product > a',
		title: '.js-store-prod-name',
		price: '.js-store-prod-price',
		other: '.js-store-prod-charcs',
	},
}

export const atrContestsFn: ParserFunction = async ({ html, getContent, page, parsePage, isFillMode }) => {
	const rootLinks = html.querySelectorAll(selectors.root)
		.map<RootLink|null>(el => {
			const href = el.getAttribute('href');
			if (!href || href.includes('news')) return null

			return {
				title: normalize(el.querySelector(selectors.title)!.rawText),
				url: href.split('/base')[0] + '/contracts'
			}
		})
		.filter(href => href!==null)

	if (!rootLinks.length) return [];

	const items: Item[] = []
	items.push(...[])
	for (const rootLink of rootLinks) {
		await getContent(rootLink?.url);

		await page.waitForSelector(selectors.product.link)

		const categoryContent = await parsePage()

		const productUrls = categoryContent.querySelectorAll(selectors.product.link)
			.map(el => el.getAttribute('href'));

		for (const productUrl of productUrls) {
			if (!productUrl) continue;
			const productEl = await getContent(productUrl)
			const titleText = productEl.querySelector(selectors.product.title)?.rawText;
			const cost = productEl.querySelector(selectors.product.price)?.rawText;
			if (!titleText || !cost) continue;
			const title = 'Конкурсный отбор на разработку ' + lowerFirstIfNotUppercase(titleText);
			const params: Item['params'] = productEl.querySelectorAll(selectors.product.other).map(el => {
				let [key, value] = el.rawText.split(':') as [string, string]
				if (key === 'Начало приема заявок') {
					console.log({value, normalize: normalizedDate(value)})
					value = normalizedDate(value)
				}
				return { key, value }
			})
			const endValue = params.find(p => p.key === 'Окончание приема заявок')
			if (!isFillMode && endValue && isNotFutureDate(endValue.value)) continue;
			items.push({ id: productUrl.split('product/')[1]!, title, cost, params, idPrefix: rootLink?.title })
		}
	}

	return items.map<ParserFunctionResult|null>(({ id, title, cost, params, idPrefix }) => {
		const fromDate = params.find(({ key }) => key === 'Начало приема заявок')?.value
		if (!fromDate) {
			return null
		}
		return {
			id,
			title,
			idPrefix,
			fromDate,
			blocks: [
				li('Сумма гранта', normalize(cost)),
				params.map(({ key, value }) => li(key, value))
			]
		}
	}).filter(i => i !== null)
}