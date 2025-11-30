import { test, expect } from '@playwright/test';
import { RegisterPatientPage } from '../pages/RegisterPatientPage';
import { LoginPage } from '../pages/LoginPage';
import { loginData } from '../fixtures/LoginData';

test.describe('Register Unidentified Patient', () => {

    let registerPatientPage: RegisterPatientPage;
    let loginPage: LoginPage;

    // Use empty storage state to ensure no pre-existing auth interferes
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(loginData.validUser.username, loginData.validUser.password, loginData.validUser.location);
    });

    test('TC-B.3: Register Unidentified Patient', async ({ page }) => {
        test.info().annotations.push({ type: 'Module', description: 'Patient Registration' });
        registerPatientPage = new RegisterPatientPage(page);

        await registerPatientPage.startRegistration();

        // 1. Select Unidentified Patient
        await registerPatientPage.clickUnidentifiedPatient();

        // Verify Name fields are hidden/disabled or we moved to next section
        // Based on exploration, clicking checkbox might auto-advance or hide fields.
        // Let's verify that the name inputs are hidden or we are on Gender section.
        // The "Given Name" input should be hidden.
        await expect(registerPatientPage.givenNameInput).toBeHidden();

        // 2. Select Gender (Required)
        // We should be on the gender section now.
        await registerPatientPage.genderSelect.selectOption('Male');
        await registerPatientPage.nextButton.click();

        // 3. Verify we skip to Confirm
        // The flow skips Birthdate, Address, Phone, Relations.
        await expect(page.getByText('Confirm submission?')).toBeVisible();

        // Verify details on confirm page
        await expect(page.getByText('Name: --')).toBeVisible();
        await expect(page.getByText('Gender: Male')).toBeVisible();

        // 4. Confirm Registration
        await registerPatientPage.confirmButton.click();

        // 5. Verify Patient Dashboard
        // Should land on patient dashboard.
        // Unidentified patients often have an auto-generated ID.
        const patientId = await registerPatientPage.getPatientId();
        expect(patientId).toBeTruthy();
        console.log(`Registered Unidentified Patient ID: ${patientId}`);
    });
});
