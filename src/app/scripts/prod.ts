import {schedule} from "node-cron";
import {appConfig} from "../config";
import {main} from "../main";

console.log('APP STARTS')

main()

schedule(appConfig.parsingTimeCron, () => {
	main()
})