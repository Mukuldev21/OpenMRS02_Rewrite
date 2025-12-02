import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly baseUrl;
    readonly expectedTitle: "Login";
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly sessionLocationSelect: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;
    readonly errorMessageSessionLocationSelect: Locator;

    constructor(page: Page) {
        this.page = page;
        this.baseUrl = "https://o2.openmrs.org/openmrs/login.htm";
        this.expectedTitle = "Login";
        this.usernameInput = page.locator('input#username');
        this.passwordInput = page.locator('input#password');
        this.sessionLocationSelect = page.locator('ul#sessionLocation.select');
        this.loginButton = page.locator('input#loginButton.btn.confirm');
        this.errorMessage = page.locator('.alert.alert-danger');
        this.errorMessageSessionLocationSelect = page.locator('#sessionLocationError');
    }


    async navigate() {
        await this.page.goto(this.baseUrl);
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveTitle(this.expectedTitle);
    }

    async login(username: string, password: string, location: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        //await this.page.locator(`ul#sessionLocation.select >> text=${location}`).click();
        if (location) {
            await this.page.locator(`ul#sessionLocation.select >> text=${location}`).click();
        }
        await this.loginButton.click();
        //await this.page.waitForURL(/.*home.page/);
    }

    async invalidLogin(username: string, password: string, location: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        //await this.page.locator(`ul#sessionLocation.select >> text=${location}`).click();
        if (location) {
            await this.page.locator(`ul#sessionLocation.select >> text=${location}`).click();
        }
        await this.loginButton.click();
    }

    async loginWithoutLocation(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async assertErrorMessage(expectedMessage: string) {
        await expect(this.errorMessage).toContainText(expectedMessage);
    }

    async assertSessionLocationError(expectedMessage: string) {
        await expect(this.errorMessageSessionLocationSelect).toContainText(expectedMessage);
    }

    async verifySessionLocations(expectedLocations: string[]) {
        const options = this.sessionLocationSelect.locator('li');
        const optionCount = await options.count();
        let actualLocations: string[] = [];
        for (let i = 0; i < optionCount; i++) {
            actualLocations.push((await options.nth(i).innerText()).trim());
        }
        expect(actualLocations.sort()).toEqual(expectedLocations.sort());
    }

}