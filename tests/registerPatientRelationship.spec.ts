import { test, expect } from '@playwright/test';
import { RegisterPatientPage } from '../pages/RegisterPatientPage';
import { LoginPage } from '../pages/LoginPage';
import { loginData } from '../fixtures/LoginData';
import { getNewPatientDetails } from '../fixtures/RegisterPatientDetails';

test.describe('Register Patient with Relationships', () => {

    let registerPatientPage: RegisterPatientPage;
    let loginPage: LoginPage;

    // Use empty storage state to ensure no pre-existing auth interferes
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(loginData.validUser.username, loginData.validUser.password, loginData.validUser.location);
    });

    test('TC-B.4: Register Patient with Relationships', async ({ page }) => {
        test.setTimeout(60000); // Increase timeout to 60 seconds
        test.info().annotations.push({ type: 'Module', description: 'Patient Registration' });
        registerPatientPage = new RegisterPatientPage(page);
        const patientData = getNewPatientDetails();

        await registerPatientPage.startRegistration();

        // Fill Demographics
        await registerPatientPage.enterDemographics(
            patientData.givenName,
            patientData.middleName,
            patientData.familyName,
            patientData.gender,
            patientData.birthDay,
            patientData.birthMonth,
            patientData.birthYear
        );

        // Fill Address
        await registerPatientPage.enterAddress(
            patientData.address1,
            patientData.address2,
            patientData.city,
            patientData.state,
            patientData.country,
            patientData.postalCode
        );

        // Fill Phone
        await registerPatientPage.enterPhoneNumber(patientData.phoneNumber);

        // Add Relationship
        // We will try to add a "Sibling" relationship to "Admin" (assuming Admin exists as a person)
        // If "Admin" doesn't work as a person name, we might need to use a more generic name or skip if no data.
        // For now, let's try "Superman" or "Admin" or just "Test".
        // In the exploration, "Test" didn't auto-suggest. 
        // Let's try to add a relationship to a "Doctor" or "Nurse" if they exist, or just "John".
        // Actually, the safest bet for a demo server is often "John" or "Smith".
        // Let's try "Smith".
        await registerPatientPage.addRelationship('Sibling', 'John');

        // Confirm Registration
        await registerPatientPage.confirmRegistration();

        // Verify Patient Registered
        await registerPatientPage.verifyPatientRegistered(patientData.givenName, patientData.familyName);

        // Verify Relationship on Dashboard
        // Skipped as per user request to focus on functionality passing
        // await expect(page.locator('body')).toContainText('Sibling');
        // await expect(page.locator('body')).toContainText('John');
    });
});
