import {schedule} from "node-cron"
import {appConfig} from "../config";

schedule(appConfig.parsingTimeCronTest, () => {
	console.log('parsingTimeCronTest succeeded!');
})