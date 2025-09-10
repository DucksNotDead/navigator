import { Message } from "../bot/model";
declare class StorageClass {
    private db;
    private readonly tableName;
    constructor();
    initDb(): Promise<void>;
    private check;
    saveMessage({ id, telegramID, content }: Message): Promise<void>;
    private findAll;
    findMessage(id: string): Promise<Message | null | undefined>;
    private removeMessage;
    clearTable(): Promise<number[]>;
}
export declare const appStorage: StorageClass;
export {};
//# sourceMappingURL=index.d.ts.map