import { test, expect } from '@playwright/test';
import { FindPatientRecordPage } from '../pages/FindPatientRecordPage';
import { LoginPage } from '../pages/LoginPage';
import { loginData } from '../fixtures/LoginData';

// Simple data loading
const patientIds = require('../fixtures/PatientIDs.json');
const patientNames = require('../fixtures/PatientNames.json');

test.describe('Find Patient Record Tests', () => {
    test.describe.configure({ mode: 'serial' });
    let findPatientPage: FindPatientRecordPage;
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        page.goto('/openmrs/index.htm');
        findPatientPage = new FindPatientRecordPage(page);

        if (await page.getByRole('button', { name: 'Log In' }).isVisible()) {
            loginPage = new LoginPage(page);
            await loginPage.login(loginData.validUser.username, loginData.validUser.password, loginData.validUser.location);
        }
    });

    test('TC-C.1: Search by Patient Name', async ({ page }) => {
        // Pick random name
        const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];
        console.log(`Searching by Name: ${patientName}`);

        await findPatientPage.navigateToFindPatientRecord();
        await findPatientPage.searchByPatient(patientName);
        await findPatientPage.verifyPatientVisible(patientName);

        await findPatientPage.selectPatient(patientName);
        await expect(page).toHaveURL(/.*patient.page/);

        // Assert on the page
        // Wait for page content to load and check for name in the body
        await expect(page.locator('body')).toContainText(patientName, { timeout: 30000 });
    });

    test('TC-C.2: Search by Patient ID', async ({ page }) => {
        // Pick random ID
        const patientId = patientIds[Math.floor(Math.random() * patientIds.length)];
        console.log(`Searching by ID: ${patientId}`);

        await findPatientPage.navigateToFindPatientRecord();
        await findPatientPage.searchByPatient(patientId);
        await findPatientPage.verifyPatientVisible(patientId);

        // Click on the patient to go to dashboard (needed to assert ID on dashboard)
        await findPatientPage.selectPatient(patientId);
        await expect(page).toHaveURL(/.*patient.page/);

        // Assert ID is visible
        await expect(page.getByText(patientId)).toBeVisible();

        await findPatientPage.goHome();
    });

    test('TC-C.3: Search Non-existent Patient', async ({ page }) => {
        await findPatientPage.navigateToFindPatientRecord();
        await findPatientPage.searchByPatient('999999999');
        await findPatientPage.verifyNoRecordsFound();
    });

    test('TC-C.4: Partial Search by Patient Name', async ({ page }) => {
        // Pick random name
        const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];

        // Use first 3 characters for partial search
        const partialName = patientName.substring(0, 3);
        console.log(`Partial Search using: "${partialName}" (Full Name: ${patientName})`);

        await findPatientPage.navigateToFindPatientRecord();
        await findPatientPage.searchByPatient(partialName);

        // Verify the full name appears in the results
        await findPatientPage.verifyPatientVisible(patientName);

        await findPatientPage.selectPatient(patientName);

        // Verify dashboard loads for the correct patient
        await expect(page).toHaveURL(/.*patient.page/);
        await expect(page.locator('body')).toContainText(patientName, { timeout: 30000 });
    });
});
