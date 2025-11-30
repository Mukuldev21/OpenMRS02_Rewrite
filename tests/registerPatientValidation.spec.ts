import { test } from '@playwright/test';
import { RegisterPatientPage } from '../pages/RegisterPatientPage';
import { LoginPage } from '../pages/LoginPage';
import { loginData } from '../fixtures/LoginData';
import { getNewPatientDetails } from '../fixtures/RegisterPatientDetails';

test.describe('Patient Registration Validation', () => {

    let registerPatientPage: RegisterPatientPage;
    let loginPage: LoginPage;

    // Use empty storage state to ensure no pre-existing auth interferes
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(loginData.validUser.username, loginData.validUser.password, loginData.validUser.location);
    });

    test('TC-B.2: Register Patient - Required Fields Validation', async ({ page }) => {
        test.info().annotations.push({ type: 'Module', description: 'Patient Registration' });
        registerPatientPage = new RegisterPatientPage(page);
        const patientData = getNewPatientDetails();

        await registerPatientPage.startRegistration();

        // 1. Validate Name Section
        // Click next without filling anything
        await registerPatientPage.nextButton.click();
        await registerPatientPage.verifyNameValidationErrors();

        // Fill Name to proceed
        await registerPatientPage.givenNameInput.fill(patientData.givenName);
        await registerPatientPage.familyNameInput.fill(patientData.familyName);
        await registerPatientPage.nextButton.click();

        // 2. Validate Gender Section
        // Click next without selecting gender
        await registerPatientPage.nextButton.click();
        await registerPatientPage.verifyGenderValidationError();

        // Select Gender to proceed
        await registerPatientPage.genderSelect.selectOption(patientData.gender);
        await registerPatientPage.nextButton.click();

        // 3. Validate Birthdate Section
        // Click next without filling birthdate
        await registerPatientPage.nextButton.click();
        await registerPatientPage.verifyBirthdateValidationError();

        // Fill Birthdate to proceed (optional, just to confirm we can move past)
        await registerPatientPage.birthDayInput.fill(patientData.birthDay);
        await registerPatientPage.birthMonthSelect.selectOption(patientData.birthMonth);
        await registerPatientPage.birthYearInput.fill(patientData.birthYear);
        await registerPatientPage.nextButton.click();
    });
});
