import {schedule} from "node-cron";
import {appConfig} from "../config";
import {main} from "../main";

console.log('APP STARTS')

void main()

schedule(appConfig.parsingTimeCron, async () => {
	await main()
})