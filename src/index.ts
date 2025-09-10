import {emulate} from "./emulator";
import {parse, sources} from "./parser";
import {send} from "./bot";

emulate(async getContent => {
	console.log('start')
	for (const source of sources) {
		if (source.disabled) continue;
		for (const route of source.routes) {
			console.log('running', source.baseURL+route.path+'...')
			const results = await parse({ getContent, source, route, isFillMode: false });
			for (const result of results) {
				await send(
					result,
					result.imagePath? result.imagePath : `${__dirname}/../assets/${source.logo}`
					)
				console.log(result.id, 'was sended')
			}
		}
	}
})
