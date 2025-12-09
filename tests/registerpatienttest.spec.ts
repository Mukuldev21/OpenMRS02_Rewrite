import { test } from '@playwright/test';
import { RegisterPatientPage } from '../pages/RegisterPatientPage';
import { LoginPage } from '../pages/LoginPage';
import { loginData } from '../fixtures/LoginData';
import { getNewPatientDetails } from '../fixtures/RegisterPatientDetails';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Patient Registration', () => {

    let registerPatientPage: RegisterPatientPage;
    let loginPage: LoginPage;

    // Use empty storage state to ensure no pre-existing auth interferes
    // test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        // Navigate to home page - authentication is handled by global setup
        await page.goto('/openmrs/index.htm');
    });

    test('TC-B.1 Register a new patient with valid details', async ({ page }) => {
        test.info().annotations.push({ type: 'Module', description: 'Patient Registration' });
        registerPatientPage = new RegisterPatientPage(page);
        const patientData = getNewPatientDetails();

        await registerPatientPage.startRegistration();

        await registerPatientPage.enterDemographics(
            patientData.givenName,
            patientData.familyName,
            patientData.gender,
            patientData.birthDay,
            patientData.birthMonth,
            patientData.birthYear
        );
        await registerPatientPage.enterAddress(
            patientData.address1,
            patientData.address2,
            patientData.city,
            patientData.state,
            patientData.country,
            patientData.postalCode
        );
        await registerPatientPage.enterPhoneNumber(patientData.phoneNumber);
        await registerPatientPage.skipRelations();

        await registerPatientPage.confirmRegistration();

        //await registerPatientPage.verifyPatientRegistered(patientData.givenName, patientData.familyName);

        // Save patient details
        const patientId = await registerPatientPage.getPatientId();
        const patientName = `${patientData.givenName} ${patientData.familyName}`;

        // Save Patient ID
        const patientIdsFile = path.join(__dirname, '../fixtures/PatientIDs.json');
        let patientIds: string[] = [];

        if (fs.existsSync(patientIdsFile)) {
            const fileContent = fs.readFileSync(patientIdsFile, 'utf-8');
            if (fileContent.trim()) {
                patientIds = JSON.parse(fileContent);
            }
        }

        patientIds.push(patientId);
        fs.writeFileSync(patientIdsFile, JSON.stringify(patientIds, null, 2));

        // Save Patient Name
        const patientNamesFile = path.join(__dirname, '../fixtures/PatientNames.json');
        let patientNames: string[] = [];

        if (fs.existsSync(patientNamesFile)) {
            const fileContent = fs.readFileSync(patientNamesFile, 'utf-8');
            if (fileContent.trim()) {
                patientNames = JSON.parse(fileContent);
            }
        }

        patientNames.push(patientName);
        fs.writeFileSync(patientNamesFile, JSON.stringify(patientNames, null, 2));

        console.log(`Registered patient: ${patientName} (ID: ${patientId})`);
    });
});
