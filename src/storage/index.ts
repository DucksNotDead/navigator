import sqlite3 from "sqlite3";
import {Database, open} from "sqlite";
import {Message} from "../bot/model";

class StorageLike {
	private db:  Database<sqlite3.Database, sqlite3.Statement>|null = null
	private readonly tableName: string = "messages";

	constructor() {
		this.initDb().then()
	}

	async saveMessage({ id, telegramID, content, fromDate }: Message) {
		await this.checkDb()
		await this.db?.run(
			`INSERT OR REPLACE INTO ${this.tableName} (id, telegramID, content, fromDate) VALUES (?, ?, ?, ?)`,
			[id, telegramID, content, fromDate]
		);
	}

	async findMessage(id: string): Promise<Message | null | undefined> {
		await this.checkDb()
		return this.db?.get(
			`SELECT * FROM ${this.tableName} WHERE id LIKE ?`,
			[`%${id}%`]
		);
	}

	async findAll(): Promise<Message[]> {
		await this.checkDb()
		return this.db?.all(`SELECT * FROM ${this.tableName}`) ?? [];
	}

	async clearTable(): Promise<void> {
		await this.checkDb()
		const messages = await this.findAll();
		for (const message of messages) {
			await this.removeMessage(message.id);
		}
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
      content TEXT,
      fromDate TEXT
    )
  `);

		this.db = db;
	}

	private async checkDb() {
		if (!this.db) await this.initDb()
	}

	private async removeMessage(id: string) {
		await this.checkDb()
		await this.db?.run(
			`DELETE FROM ${this.tableName} WHERE id = ?`,
			id
		);
	}
}

export const appStorage = new StorageLike();
