"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appStorage = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
class StorageClass {
    db = null;
    tableName = "messages";
    constructor() {
        this.initDb().then();
    }
    async initDb() {
        const db = await (0, sqlite_1.open)({
            filename: "messages.db",
            driver: sqlite3_1.default.Database,
        });
        await db.exec(`
    CREATE TABLE IF NOT EXISTS ${this.tableName} (
      id TEXT PRIMARY KEY,
      telegramID NUMBER,
      content TEXT
    )
  `);
        this.db = db;
    }
    async check() {
        if (!this.db)
            await this.initDb();
    }
    async saveMessage({ id, telegramID, content }) {
        await this.check();
        await this.db?.run(`INSERT OR REPLACE INTO ${this.tableName} (id, telegramID, content) VALUES (?, ?, ?)`, [id, telegramID, content]);
    }
    async findAll() {
        await this.check();
        return this.db?.all(`SELECT * FROM ${this.tableName}`) ?? [];
    }
    async findMessage(id) {
        await this.check();
        return this.db?.get(`SELECT * FROM ${this.tableName} WHERE id LIKE ?`, [`%${id}%`]);
    }
    async removeMessage(id) {
        await this.check();
        await this.db?.run(`DELETE FROM ${this.tableName} WHERE id = ?`, id);
    }
    async clearTable() {
        await this.check();
        const messages = await this.findAll();
        for (const message of messages) {
            await this.removeMessage(message.id);
        }
        return messages.map(message => message.telegramID);
    }
}
exports.appStorage = new StorageClass();
//# sourceMappingURL=index.js.map