import {ParserSource} from "./model";
import {rnfFn} from "./functions/rnf";
import {Tags} from "../shared/tags";
import {fiopFn} from "./functions/fiop";

export const sources: ParserSource[] = [
	{
		name: 'Российский научный фонд',
		baseURL: 'https://rscf.ru',
		idPrefix: 'РНФ',
		routes: [
			{ path: '/contests/', fn: rnfFn, tag: Tags.Grants }
		],
		logo: 'rnf-logo.png',
	},
	{
		name: 'Фонд инфраструктурных и образовательных программ',
		baseURL: 'https://fiop.site',
		idPrefix: 'ФИОП',
		maxItems: 6,
		routes: [
			{ path: '/press-tsentr', fn: fiopFn, tag: Tags.News }
		],
		logo: 'fiop-logo.svg',
	},
]