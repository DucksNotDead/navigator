import {send} from "../bot";
import {emulate} from "../emulator";
import {parse, sources} from "../parser";

export function main() {
	emulate(async (emulateCallbackArguments) => {
		console.log('start')
		for (const source of sources) {
			if (source.disabled) continue;
			for (const route of source.routes) {
				const baseURL = route.path.includes('://') ? '' : source.baseURL
				console.log('running', baseURL+route.path+'...')
				const results = await parse({ ...emulateCallbackArguments, source: { ...source, baseURL }, route, isFillMode: false });
				for (const result of results) {
					console.log({ result })
					await send(
						result,
						result.imagePath? result.imagePath : `${__dirname}/../assets/${source.logo}`
					)
					console.log(result.id, 'was sent')
				}
			}
		}
	})
}
