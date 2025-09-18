import {main} from "../main";
import {sortByDatesFn} from "../../parser/utils";

(async () => {
	const results = await main(true);

	results.sort((a, b) => sortByDatesFn(a, b, "fromDate"))

	let i = 0
	for (const result of results) {
		await result.sendFn(i)
		console.log('send')
		i++
	}
})()