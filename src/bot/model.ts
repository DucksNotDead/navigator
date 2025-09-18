import {ParserResult} from "../parser/model";

export interface Message extends ParserResult {
	telegramID: number;
}