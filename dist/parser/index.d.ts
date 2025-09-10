import { ParserFunctionArguments, ParserResult, ParserSourceRoute } from "./model";
import { sources } from "./config";
import { GetContentFunction } from "../emulator/model";
interface Args extends Omit<ParserFunctionArguments, 'html' | 'getContent'> {
    route: ParserSourceRoute;
    getContent: GetContentFunction;
}
export declare function parse({ source, getContent: globalGetContent, route, isFillMode }: Args): Promise<ParserResult[]>;
export { sources };
//# sourceMappingURL=index.d.ts.map