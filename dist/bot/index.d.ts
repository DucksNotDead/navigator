import { Message } from "./model";
export declare function send(msg: Omit<Message, 'telegramID'>, mediaURL: string): Promise<void>;
export declare function clearChat(ids: number[]): Promise<void>;
//# sourceMappingURL=index.d.ts.map