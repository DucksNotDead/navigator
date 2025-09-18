import {
	DateCollage,
	ParsePageFunction,
	ParserFunctionArguments,
	ParserFunctionResult,
	ParserResult,
	ParserSourceRoute
} from "./model";
import htmlParser from "node-html-parser"
import {sources} from "./config";
import {b, normalize, snake, sortByDatesFn, tags, v} from "./utils";
import {GetContentFunction} from "../emulator/model";

interface Args extends Omit<ParserFunctionArguments, 'html'|'getContent'|'parsePage'> {
	route: ParserSourceRoute;
	getContent: GetContentFunction;
}

export async function parse({ source, getContent: globalGetContent, route, isFillMode, ...other }: Args): Promise<ParserResult[]> {
	const getContent = async (path: string) => {
		const content = await globalGetContent(path)
		return htmlParser.parse(content)
	}
	const parsePage: ParsePageFunction = async () => htmlParser(await other.page.content());
	const results = await route.fn({
		html: await getContent(source.baseURL + route.path),
		getContent,
		source,
		isFillMode,
		parsePage,
		...other,
	})

	const resultsSortFn = (a: ParserFunctionResult, b: ParserFunctionResult) =>
		sortByDatesFn(a, b, 'fromDate')
	results.sort(resultsSortFn)

	return results.filter(({ fromDate }) => {
		const [, , year] = fromDate.split('.').map(Number) as DateCollage
		return year >= 2025
	}).map(({ id: resultId, title, fromDate, blocks, tags: resultTags, imagePath }) => {
		const id = snake(source.idPrefix, ...(route.idPrefix ?? []), resultId)
		const reducedMainBlocks = [[b(title)], ...blocks]
			.reduce<string[]>((state, item) => [
				...state,
				...(typeof item === "string" ? [item] : item),
				''
			], []);
		return {
			id,
			content: v(
				...reducedMainBlocks.map(str => normalize(str)),
				tags(route.tag, ...(resultTags ?? []), source.name)
			),
			imagePath,
			fromDate
		}
	});
}

export { sources }