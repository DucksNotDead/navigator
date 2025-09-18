import { appConfig } from "../app/config";
import {DateCollage} from "./model";

export function snake(...args: string[]): string {
	return args.map(str => str.replaceAll(' ', '_')).join('_');
}

export function camel(str: string): string {
	return str
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join('');
}

export function pureText(str: string): string {
	return str
		.replace(/\s+/g, ' ')
		.trim()
}

export function b(str: string): string {
	return `<b>${str}</b>`
}

export function v(...args: string[]): string {
	return args.join('\n')
}

export function li(key: string, value: string): string {
	return `${b(`${key}:`)}\n– ${value}`
}

export function link(title: string, href: string): string {
	return `<a href="${href}">${title}</a>`
}

export function comma(...args: string[]): string {
	return args.join(', ')
}

export function tags(...args: string[]): string {
	return args.map(str => `#${snake(str)}`).join(' ')
}

export function normalize(str: string): string {
	return str
		.split('\n')
		.map(s => s.trim())
		.join('\n')
		.replaceAll('\t', '')
		.replace(/&nbsp;/g, ' ');
}

export function cut(str: string, index: number): string {
	return str.slice(0, index) + '...\n'
}

export function text(titleLength: number, textBlocks: string[]): string {
	let result = '';
	let totalLength = titleLength;

	for (const textBlockIndex in textBlocks) {
		const textBlock = textBlocks[textBlockIndex]!;
		totalLength += textBlock.length
		if (totalLength > appConfig.mexMessageContentLength) {
			if (Number(textBlockIndex) === 0) {
				result += cut(textBlock, totalLength - appConfig.mexMessageContentLength)
			}
			continue;
		}
		result += textBlock
	}

	return result;
}

export function currentDate(): string {
	const now = new Date();

	const day = String(now.getDate()).padStart(2, "0");
	const month = String(now.getMonth() + 1).padStart(2, "0"); // месяцы с 0
	const year = now.getFullYear();

	return `${day}.${month}.${year}`;
}

export function isNotFutureDate(dateStr: string): boolean {
	const [day, month, year] = dateStr.split(".")
		.map(val => Number(val)) as DateCollage;
	const inputDate = new Date(year, month - 1, day);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// true → дата не в будущем
	return inputDate <= today;
}

export function lowerFirstIfNotUppercase(str: string): string {
	const firstWord = str.split(/\s+/)[0]!;

	const isUppercase = firstWord === firstWord.toUpperCase();

	if (isUppercase) {
		return str;
	}

	return str.charAt(0).toLowerCase() + str.slice(1);
}

export function sortByDatesFn<T extends object, K extends keyof T>(a: T, b: T, key: K): number {
	const aDate = a[key]
	const bDate = b[key]

	if (typeof aDate !== "string" || typeof bDate !== "string") {
		return 0;
	}

	const [dayA, monthA, yearA] = aDate.split('.').map(Number) as DateCollage;
	const [dayB, monthB, yearB] = bDate.split('.').map(Number) as DateCollage;

	const dateA = new Date(yearA, monthA - 1, dayA);
	const dateB = new Date(yearB, monthB - 1, dayB);

	return dateA.getTime() - dateB.getTime();
}

export function normalizedDate(input: string): string {
	const date = pureText(input)
	const re = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(\d{4})$/
	const ruToEnMonths: Record<string, string> = {
		"января": "January",
		"февраля": "February",
		"марта": "March",
		"апреля": "April",
		"мая": "May",
		"июня": "June",
		"июля": "July",
		"августа": "August",
		"сентября": "September",
		"октября": "October",
		"ноября": "November",
		"декабря": "December",
	};

	if (re.test(date)) {
		return date;
	}

	let normalized = date.toLowerCase();

	for (const [ru, en] of Object.entries(ruToEnMonths)) {
		if (normalized.includes(ru)) {
			normalized = normalized.replace(ru, en);
			break;
		}
	}

	const parsed = new Date(normalized);

	if (isNaN(parsed.getTime())) return '01.01.2025'

	const day = String(parsed.getDate()).padStart(2, "0");
	const month = String(parsed.getMonth() + 1).padStart(2, "0");
	const year = parsed.getFullYear();

	return `${day}.${month}.${year}`;
}
