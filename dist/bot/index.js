"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = send;
exports.clearChat = clearChat;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const storage_1 = require("../storage");
const API_KEY = "8188368688:AAGIwnr6_DNrLpsX3VzQ--6AWqKErdl6nrs";
const CHANNEL_ID = -1003019434137;
const bot = new node_telegram_bot_api_1.default(API_KEY, { polling: true });
async function send(msg, mediaURL) {
    if (await storage_1.appStorage.findMessage(msg.id))
        return;
    const message = await bot.sendPhoto(CHANNEL_ID, mediaURL, { caption: msg.content, parse_mode: 'HTML', }, { contentType: "application/octet-stream" });
    await storage_1.appStorage.saveMessage({ ...msg, telegramID: message.message_id });
}
async function clearChat(ids) {
    for (const id of ids) {
        await bot.deleteMessage(CHANNEL_ID, id);
    }
}
//# sourceMappingURL=index.js.map