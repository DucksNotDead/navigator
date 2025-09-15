import {ParserSource} from "./model";
import {rnfFn} from "./functions/rnf";
import {Tags} from "../shared/tags";
import {fiopFn} from "./functions/fiop";
import {atrNewsFn} from "./functions/atr/atr-news";
import {atrContestsFn} from "./functions/atr/atr-contests";
import {minobrFn} from "./functions/minobr";

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
	{
		name: 'АНО Агентство по технологическому развитию',
		baseURL: 'https://atr.gov.ru',
		idPrefix: 'АТР',
		routes: [
			{ path: '/', fn: atrContestsFn, tag: Tags.Grants, idPrefix: Tags.Grants },
			{ path: '/news', fn: atrNewsFn, tag: Tags.News, idPrefix: Tags.News },
		],
		logo: 'atr-logo.png',
	},
	{
		name: 'Министерство науки и высшего образования РФ',
		baseURL: 'https://minobrnauki.gov.ru',
		idPrefix: 'МИНОБР',
		routes: [
			{ path: '/grants/grants', fn: minobrFn, tag: Tags.Grants, idPrefix: Tags.Grants },
		],
		logo: 'minobr-logo.png',
	},
]