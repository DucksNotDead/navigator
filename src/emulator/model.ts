import {Browser, Page} from "@playwright/test";

export interface EmulatorInstance {
	page: Page;
	browser: Browser
}

export type EmulatorBeforeRunFunctionArguments = EmulateCallbackArguments & EmulatorInstance;

export type EmulatorBeforeRunFunction = (args: EmulatorBeforeRunFunctionArguments) => Promise<void>;

export type GetContentFunction = (path: string) => Promise<string>

export interface DownloadLink {
	url: string;
	filename: string;
}

export type DownloadFunction = (selector: string) => Promise<DownloadLink>

export interface EmulateCallbackArguments {
	getContent: GetContentFunction;
	download: DownloadFunction;
	page: Page;
}

export type EmulateCallback = (emulateCallbackArguments: EmulateCallbackArguments) => Promise<void>;
