import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { loginData } from '../fixtures/LoginData';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
    setup.info().annotations.push({ type: 'Module', description: 'Authentication' });
    // Ensure directory exists
    const authDir = path.dirname(authFile);
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    // Check if we already have a valid session
    if (fs.existsSync(authFile)) {
        try {
            await page.context().addCookies(JSON.parse(fs.readFileSync(authFile, 'utf-8')).cookies);
            await page.goto('https://o2.openmrs.org/openmrs/index.htm'); // Go to home page directly
            // If we are redirected to login, then our session is invalid
            if (await page.title() === 'Home') {
                console.log('Using existing auth state');
                return;
            }
        } catch (e) {
            console.log('Error reading auth file or invalid state, re-authenticating...');
        }
    }

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(loginData.validUser.username, loginData.validUser.password, loginData.validUser.location);

    // Wait for login to complete
    await expect(page).toHaveTitle("Home");

    await page.context().storageState({ path: authFile });
});
