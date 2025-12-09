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
    });

    test('TC-C.2: Search by Patient ID', async ({ page }) => {
        // Pick random ID
        const patientId = patientIds[Math.floor(Math.random() * patientIds.length)];
        console.log(`Searching by ID: ${patientId}`);

        await findPatientPage.navigateToFindPatientRecord();
        await findPatientPage.searchByPatient(patientId);
        await findPatientPage.verifyPatientVisible(patientId);

        await findPatientPage.goHome();
    });

    test('TC-C.3: Search Non-existent Patient', async ({ page }) => {
        await findPatientPage.navigateToFindPatientRecord();
        await findPatientPage.searchByPatient('999999999');
        await findPatientPage.verifyNoRecordsFound();
    });
});
