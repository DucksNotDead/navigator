import { HTMLElement } from "node-html-parser";
export interface ParserResult {
    id: string;
    content: string;
    imagePath?: string | undefined;
}
export interface ParserSourceBase {
    name: string;
    baseURL: string;
    logo: string;
    idPrefix: string;
    disabled?: boolean;
    maxItems?: number;
}
export interface ParserFunctionArguments {
    source: ParserSourceBase;
    html: HTMLElement;
    getContent: (path: string) => Promise<HTMLElement>;
    isFillMode: boolean;
}
export interface ParserFunctionResult extends Omit<ParserResult, 'content'> {
    title: string;
    blocks: (string[] | string)[];
    tags?: string[];
}
export type ParserFunction = (args: ParserFunctionArguments) => Promise<ParserFunctionResult[]>;
export interface ParserSourceRoute {
    path: string;
    tag: string;
    fn: ParserFunction;
    idPrefix?: string | undefined;
}
export interface ParserSource extends ParserSourceBase {
    routes: ParserSourceRoute[];
}
export interface Link {
    title: string;
    href: string;
}
//# sourceMappingURL=model.d.ts.map