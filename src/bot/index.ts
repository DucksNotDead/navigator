import Bot from "node-telegram-bot-api"
import {Message} from "./model";
import {appStorage} from "../storage";

const API_KEY = "8188368688:AAGIwnr6_DNrLpsX3VzQ--6AWqKErdl6nrs"
const CHANNEL_ID = -1003019434137
const bot = new Bot(API_KEY, { polling: true })

const wait = (seconds: number) => {
	let i = seconds;
	const interval = setInterval(() => {
		console.log('wait ' + i)
		i--
	}, 1000)
	return new Promise(resolve => setTimeout(() => {
		resolve(true)
		clearInterval(interval)
	}, 1000 * seconds))
}

export async function send(msg: Omit<Message, 'telegramID'>, mediaURL: string, index?: number): Promise<void> {
	if (await appStorage.findMessage(msg.id)) return;

	const isTwentyOne = !!index && (index % 20) === 0

	await wait(isTwentyOne ? 21 : 2)

	const message = await bot.sendPhoto(
		CHANNEL_ID,
		mediaURL,
		{ caption: msg.content, parse_mode: 'HTML' },
		{ contentType: "application/octet-stream" }
	)
	await appStorage.saveMessage({ ...msg, telegramID: message.message_id })
}

export async function clearChat(ids: number[]) {
	for (const id of ids) {
		await bot.deleteMessage(CHANNEL_ID, id)
	}
}