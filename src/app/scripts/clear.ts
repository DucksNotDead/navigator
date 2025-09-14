import {appStorage} from "../../storage";
import {clearChat} from "../../bot";

(async () => {
	const all = await appStorage.findAll()
	await clearChat(all.map(m => m.telegramID))
})()