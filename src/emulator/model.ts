export type GetContentFunction = (path: string) => Promise<string>

export type EmulateCallback = (getContent: GetContentFunction) => Promise<void>;
