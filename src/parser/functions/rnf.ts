import {Link, ParserFunction} from "../model";
import {comma, li, link, pureText} from "../utils";

const selectors = {
	row: '.classification-table-row',
	statusSuccess: '.contest-status > .contest-success',
	status: '.contest-status'
}

export const rnfFn: ParserFunction = async ({ html, source, isFillMode }) => {
	const statusesLength = html
		.querySelectorAll(isFillMode ? selectors.status : selectors.statusSuccess)
		.map(el => el.rawText).length;
	if (!statusesLength) { return [] }

	const rows = html
		.querySelectorAll(selectors.row)
		.filter((_, i) => i <= statusesLength)
	if (!rows.length) { return [] }

	const names: string[] = []
	const values: string[][] = []
	const submitLinks: (string|null)[] = []
	const docsLinks: Link[][] = []
	let idIndex: number|null = null
	let nameIndex: number|null = null
	let statusIndex: number|null = null
	let submitIndex: number|null = null
	let docsIndex: number|null = null

	rows.forEach((row, rowIndex) => {
		for (const colIndex in row.children) {
			const col = row.children[colIndex]!
			const colNumber = Number(colIndex)
			const realRowIndex = rowIndex - 1
			let text = pureText(col.rawText.replace('*', ''))

			if (!rowIndex) {
				if (text.toLowerCase().includes('статус')) {
					statusIndex = colNumber
				} else if (text.toLowerCase().includes('приём заявок')) {
					submitIndex = colNumber
				} else if (text.toLowerCase().includes('документы')) {
					docsIndex = colNumber
				} else if (text.toLowerCase().includes('№')) {
					idIndex = colNumber
				} else if (text.toLowerCase().includes('наименование')) {
					nameIndex = colNumber
				}

				names.push(text)
			}
			else {
				if (colNumber >= names.length) continue;
				else if (colNumber === submitIndex) {
					text = text.toLowerCase().replace(' подать заявку', '')
					let href: string | null | undefined = col.querySelector('a')?.attributes['href']
					href = href ? pureText(href) : isFillMode ? "https://ias.rscf.ru/" : null
					submitLinks[realRowIndex] = href
				}
				else if (colNumber === docsIndex) {
					const links = col.querySelectorAll('a')
					for (const link of links) {
						const href = link.attributes['href']
						if (!href) continue;
						const title = pureText(link.rawText)
						if (!docsLinks[realRowIndex]) docsLinks[realRowIndex] = []
						docsLinks[realRowIndex].push({ title, href: pureText(source.baseURL + href) })
					}
				}

				if (!values[realRowIndex]) values[realRowIndex] = []
				values[realRowIndex][colNumber] = text
			}
		}
	})

	const freeIndexes = names.map((_, index) => {
		if ([
			idIndex,
			nameIndex,
			statusIndex,
			docsIndex,
		].includes(index)) return null

		return index
	}).filter(index => index !== null)

	return values.reverse().map((value, valueIndex) => {
		return {
			id: value[idIndex!]!,
			title: value[nameIndex!]!,
			blocks: [
				freeIndexes.map(index => {
					const key = names[index]!
					const keyValue = value[index]!
					return li(key, keyValue)
				}),
				li('Подать заявку', submitLinks[valueIndex]!),
				comma(
					...(docsLinks[valueIndex]!).map(({ title, href }) => link(title, href))
				),
			],
		}
	})
}