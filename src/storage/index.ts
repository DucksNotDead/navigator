import sqlite3 from "sqlite3";
import {Database, open} from "sqlite";
import {Message} from "../bot/model";

class StorageClass {
	private db:  Database<sqlite3.Database, sqlite3.Statement>|null = null
	private readonly tableName: string = "messages";

	constructor() {
		this.initDb().then()
	}

	async saveMessage({ id, telegramID, content }: Message) {
		await this.checkDb()
		await this.db?.run(
			`INSERT OR REPLACE INTO ${this.tableName} (id, telegramID, content) VALUES (?, ?, ?)`,
			[id, telegramID, content]
		);
	}

	async findMessage(id: string): Promise<Message | null | undefined> {
		await this.checkDb()
		return this.db?.get(
			`SELECT * FROM ${this.tableName} WHERE id LIKE ?`,
			[`%${id}%`]
		);
	}

	async clearTable(): Promise<number[]> {
		await this.checkDb()
		const messages = await this.findAll();
		for (const message of messages) {
			await this.removeMessage(message.id);
		}
		return messages.map(message => message.telegramID)
	}

	private async initDb() {
		const db = await open({
			filename: "messages.db",
			driver: sqlite3.Database,
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

	private async checkDb() {
		if (!this.db) await this.initDb()
	}

	private async findAll(): Promise<Message[]> {
		await this.checkDb()
		return this.db?.all(`SELECT * FROM ${this.tableName}`) ?? [];
	}

	private async removeMessage(id: string) {
		await this.checkDb()
		await this.db?.run(
			`DELETE FROM ${this.tableName} WHERE id = ?`,
			id
		);
	}
}

export const appStorage = new StorageClass();
