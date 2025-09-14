import {emulate} from "../../emulator";
import {parse, sources} from "../../parser";
import {send} from "../../bot";
import {Message} from "../../bot/model";

interface Item {
	msg: Omit<Message, "telegramID">,
	mediaURL: string,
}

type Collections = Item[][];

function shuffle(collections: Collections): Item[] {
	const result: Item[] = [];
	const maxLength = collections.reduce((state, collection) => Math.max(state, collection.length), 0)
	let i = 0;

	while (i < maxLength) {
		for (const collection of collections) {
			const item = collection[i]
			if (item) {
				result.push(item)
			}
		}
		i++
	}

	return result
}

emulate(async (emulateCallbackArguments) => {
	console.log('start fill')
	const collections: Collections = []
	for (const source of sources) {
		if (source.disabled) continue;
		let index = 0;
		for (const route of source.routes) {
			collections[index] = []
			console.log('running', source.baseURL+route.path+'...')
			const results = await parse({ ...emulateCallbackArguments, source, route, isFillMode: true });
			for (const result of results) {
				collections[index]?.push({
					msg: result,
					mediaURL: result.imagePath? result.imagePath : `${__dirname}/../assets/${source.logo}`
				})
				console.log(result.id, 'pushed')
			}
			index++;
		}
	}
	console.log('shuffle...')
	for (const item of shuffle(collections)) {
		await send(item.msg, item.mediaURL)
		console.log(item.msg.id, 'was send')
	}
})
