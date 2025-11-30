import { test } from '@playwright/test';
import { RegisterPatientPage } from '../pages/RegisterPatientPage';
import { LoginPage } from '../pages/LoginPage';
import { loginData } from '../fixtures/LoginData';

test.describe('Patient Registration Navigation', () => {

    let registerPatientPage: RegisterPatientPage;
    let loginPage: LoginPage;

    // Use empty storage state to ensure no pre-existing auth interferes
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(loginData.validUser.username, loginData.validUser.password, loginData.validUser.location);
    });

    test('TC-B.5: Register Patient - Navigation', async ({ page }) => {
        test.info().annotations.push({ type: 'Module', description: 'Patient Registration' });
        registerPatientPage = new RegisterPatientPage(page);

        await registerPatientPage.startRegistration();
        await registerPatientPage.verifyNavigationSections();
    });
});
