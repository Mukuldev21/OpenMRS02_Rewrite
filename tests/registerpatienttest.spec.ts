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
            patientData.middleName,
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
        const newPatientEntry = {
            patientId: patientId,
            ...patientData
        };

        const addedPatientsFile = path.join(__dirname, '../fixtures/AddedPatientDetails.json');
        let addedPatients: Record<string, any> = {};

        if (fs.existsSync(addedPatientsFile)) {
            const fileContent = fs.readFileSync(addedPatientsFile, 'utf-8');
            if (fileContent.trim()) {
                const existingData = JSON.parse(fileContent);
                if (Array.isArray(existingData)) {
                    // Convert existing array to object format
                    existingData.forEach((item, index) => {
                        const key = `Patient${(index + 1).toString().padStart(2, '0')}`;
                        addedPatients[key] = item;
                    });
                } else {
                    addedPatients = existingData;
                }
            }
        }

        // Generate new key
        const nextIndex = Object.keys(addedPatients).length + 1;
        const newKey = `Patient${nextIndex.toString().padStart(2, '0')}`;
        addedPatients[newKey] = newPatientEntry;

        fs.writeFileSync(addedPatientsFile, JSON.stringify(addedPatients, null, 2));
        console.log(`Registered patient: ${patientData.givenName} ${patientData.familyName} (ID: ${patientId}) saved as ${newKey}`);
    });
});
