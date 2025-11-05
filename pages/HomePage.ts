import {Page, Locator, expect} from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly expectedTitle: "Home";
    readonly loggedInUser: Locator;

    constructor(page : Page) {
        this.page = page;
        this.expectedTitle = "Home";
        this.loggedInUser = page.locator('li.nav-item.identifier');
    }

    async verifyHomePage() {
        await expect(this.page).toHaveTitle(this.expectedTitle);
        await expect(this.loggedInUser).toBeVisible();
    }
}