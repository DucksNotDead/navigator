import {send} from "../bot";
import {emulate} from "../emulator";
import {parse, sources} from "../parser";
import {svg2Png} from "../shared/svg2png";
import {ParserResult} from "../parser/model";

type MainResult = Pick<ParserResult, 'fromDate'> & { sendFn: (index: number) => Promise<void> }

export function main(isFillMode: boolean = false): Promise<MainResult[]> {
	return new Promise(resolve => {
		emulate(async (emulateCallbackArguments) => {
			console.log('start')
			const returnResults: MainResult[] = []
			for (const source of sources) {
				if (source.disabled) continue;
				for (const route of source.routes) {
					const baseURL = route.path.includes('://') ? '' : source.baseURL
					console.log('running', baseURL+route.path+'...')
					const results = await parse({
						...emulateCallbackArguments,
						source: { ...source, baseURL },
						route,
						isFillMode
					});
					let index = 0;
					for (const result of results) {
						const image = result.imagePath? result.imagePath : `${__dirname}/../../assets/${source.logo}`
						const mediaURL = image.includes('.svg') ? await svg2Png(image) : image
						const sendFn: MainResult['sendFn'] = (i) => send(
							result,
							mediaURL,
							i
						)
						if (!isFillMode) {
							console.log({ isFillMode })
							await sendFn(index)
						}
						console.log(result.id, 'was sent')
						returnResults.push({ fromDate: result.fromDate, sendFn })
						index++
					}
				}
			}
			resolve(returnResults)
		})
	})
}
