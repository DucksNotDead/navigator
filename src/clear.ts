import {clearChat} from "./bot";
import {appStorage} from "./storage";

(async () => {
	await clearChat(await appStorage.clearTable())
})()