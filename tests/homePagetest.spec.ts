import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Home Page Tests', () => {

    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await page.goto('/');
    });

    test('Verify Home Page Elements', async () => {
        await homePage.verifyHomePage();
        await homePage.verifyDashboardElements();
    });
});
