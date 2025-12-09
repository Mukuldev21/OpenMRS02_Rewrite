import { test, expect } from '@playwright/test';
import { FindPatientRecordPage } from '../pages/FindPatientRecordPage';
import { LoginPage } from '../pages/LoginPage';
import { loginData } from '../fixtures/LoginData';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Find Patient Record Tests', () => {
    let findPatientPage: FindPatientRecordPage;
    let loginPage: LoginPage;
    let patientId: string;
    let patientName: string;

    test.beforeAll(() => {
        // Read Patient ID
        try {
            const idsPath = path.join(__dirname, '../fixtures/PatientIDs.json');
            if (fs.existsSync(idsPath)) {
                const idsData = JSON.parse(fs.readFileSync(idsPath, 'utf-8'));
                if (idsData.length > 0) {
                    patientId = idsData[idsData.length - 1]; // Get the most recently added ID
                }
            }
        } catch (error) {
            console.error('Error reading PatientIDs.json', error);
        }

        // Read Patient Name
        try {
            const namesPath = path.join(__dirname, '../fixtures/PatientNames.json');
            if (fs.existsSync(namesPath)) {
                const namesData = JSON.parse(fs.readFileSync(namesPath, 'utf-8'));
                if (namesData.length > 0) {
                    patientName = namesData[namesData.length - 1]; // Get the most recently added Name
                }
            }
        } catch (error) {
            console.error('Error reading PatientNames.json', error);
        }

        if (!patientId || !patientName) {
            console.warn('Test data not found. Using defaults or skipping dependent tests.');
        }
    });

    test.beforeEach(async ({ page }) => {
        page.goto('/openmrs/index.htm');
        findPatientPage = new FindPatientRecordPage(page);

        if (await page.getByRole('button', { name: 'Log In' }).isVisible()) {
            loginPage = new LoginPage(page);
            await loginPage.login(loginData.validUser.username, loginData.validUser.password, loginData.validUser.location);
        }
    });

    test('TC-C.1: Search by Patient Name', async ({ page }) => {
        test.skip(!patientName, 'Skipping because no patient name found in fixtures');

        await findPatientPage.navigateToFindPatientRecord();
        console.log(`Searching by Name: ${patientName}`);

        await findPatientPage.searchByPatient(patientName);
        await findPatientPage.verifyPatientVisible(patientName);

        await findPatientPage.selectPatient(patientName);
        // Verify we are on the patient dashboard
        await expect(page).toHaveURL(/.*patient.page/);
    });

    test('TC-C.2: Search by Patient ID', async ({ page }) => {
        test.skip(!patientId, 'Skipping because no patient ID found in fixtures');

        await findPatientPage.navigateToFindPatientRecord();
        console.log(`Searching by ID: ${patientId}`);

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
