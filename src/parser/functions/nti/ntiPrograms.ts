import {ParserFunction} from "../../model";

const selectors = {
	loginButton: '.form__body > button',
	title: ':text("Текущие конкурсы")'
}

export const ntiProgramsFn: ParserFunction = async ({ html, page }) => {
	const loginButton = html.querySelector(selectors.loginButton);
	if (loginButton) {
		console.log('here')
		await page.locator(selectors.loginButton).click()
		console.log('click')
		await page.waitForSelector(selectors.title)
		console.log('save zone')
	}

	return []
}