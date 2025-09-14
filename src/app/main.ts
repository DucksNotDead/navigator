import {send} from "../bot";
import {emulate} from "../emulator";
import {parse, sources} from "../parser";
import {svg2Png} from "../shared/svg2png";

export function main() {
	emulate(async (emulateCallbackArguments) => {
		console.log('start')
		for (const source of sources) {
			if (source.disabled) continue;
			for (const route of source.routes) {
				const baseURL = route.path.includes('://') ? '' : source.baseURL
				console.log('running', baseURL+route.path+'...')
				const results = await parse({ ...emulateCallbackArguments, source: { ...source, baseURL }, route, isFillMode: false });
				let index = 0;
				for (const result of results) {
					console.log({ result })
					const image = result.imagePath? result.imagePath : `${__dirname}/../../assets/${source.logo}`
					await send(
						result,
						image.includes('.svg') ? await svg2Png(image) : image,
						index
					)
					console.log(result.id, 'was sent')
					index++
				}
			}
		}
	})
}
