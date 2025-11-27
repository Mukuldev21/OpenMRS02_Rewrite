import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { loginData } from '../fixtures/LoginData';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
    // Ensure directory exists
    const authDir = path.dirname(authFile);
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(loginData.validUser.username, loginData.validUser.password, loginData.validUser.location);

    // Wait for login to complete
    await expect(page).toHaveTitle("Home");

    await page.context().storageState({ path: authFile });
});
