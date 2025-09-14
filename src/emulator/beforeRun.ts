import dotenv from 'dotenv'
import {EmulatorBeforeRunFunction} from "./model";

dotenv.config()

export const beforeRun: EmulatorBeforeRunFunction = async () =>  {
}

/*
const loginInLeaderID: EmulatorBeforeRunFunction = async ({ page }) =>  {
	const selectors = {
		openPopupButton: 'div[data-qa="loginOpenBtn"]',
		phoneCheckbox: ':text("Использовать номер телефона для входа")',
		phoneInput: 'input[type="tel"]',
		passwordInput: 'input[type="password"]',
		submitButton: 'button[data-qa="loginSubmitBtn"]',
		user: 'div[data-qa="theUser"]'
	}

	console.log('try to login in LEADER_ID')
	await page.goto("https://leader-id.ru", { waitUntil: 'domcontentloaded', timeout: 60000 })
	console.log('loaded')
	await page.waitForSelector(selectors.openPopupButton)
	console.log('find button')
	await page.locator(selectors.openPopupButton).click()
	console.log('click open')
	await page.waitForSelector(selectors.phoneCheckbox)
	console.log('opened')
	await page.locator(selectors.phoneCheckbox).click()
	console.log('click checkbox')
	await page.waitForSelector(selectors.phoneInput)
	console.log('find phone input')
	await page.locator(selectors.phoneInput).fill(process.env['LEADER_ID_PHONE'] as string)
	console.log('set phone: ' + process.env['LEADER_ID_PHONE'] as string)
	await page.locator(selectors.passwordInput).fill(process.env['LEADER_ID_PASS'] as string)
	console.log('set password: ' + process.env['LEADER_ID_PASS'] as string)
	await page.locator(selectors.submitButton).click()
	console.log('click submit button')
	await page.waitForSelector(selectors.user, { timeout: 60000 })
	console.log('authorized')
}*/
