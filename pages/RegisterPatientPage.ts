import { Page, Locator, expect } from '@playwright/test';

export class RegisterPatientPage {
    readonly page: Page;
    readonly registerPatientLink: Locator;
    readonly unidentifiedPatientCheckbox: Locator;
    readonly givenNameInput: Locator;
    readonly middleNameInput: Locator;
    readonly familyNameInput: Locator;
    readonly nextButton: Locator;
    readonly genderSelect: Locator;
    readonly birthDayInput: Locator;
    readonly birthMonthSelect: Locator;
    readonly birthYearInput: Locator;
    readonly address1Input: Locator;
    readonly address2Input: Locator;
    readonly cityVillageInput: Locator;
    readonly stateProvinceInput: Locator;
    readonly countryInput: Locator;
    readonly postalCodeInput: Locator;
    readonly phoneNumberInput: Locator;
    readonly confirmButton: Locator;
    readonly cancelButton: Locator;
    readonly patientIdContainer: Locator;

    // Relationship Locators
    readonly relationshipTypeSelect: Locator;
    readonly personNameInput: Locator;

    // Validation Error Locators
    readonly givenNameError: Locator;
    readonly familyNameError: Locator;
    readonly genderError: Locator;
    readonly birthdateError: Locator;
    readonly birthdateFutureError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.registerPatientLink = page.getByRole('link', { name: 'Register a patient', exact: false });
        this.unidentifiedPatientCheckbox = page.locator('#checkbox-unknown-patient');
        this.givenNameInput = page.getByRole('textbox', { name: 'Given (required)' });
        this.middleNameInput = page.getByRole('textbox', { name: 'Middle' });
        this.familyNameInput = page.getByRole('textbox', { name: 'Family Name (required)' });
        this.nextButton = page.locator('#next-button');
        this.genderSelect = page.getByLabel('What\'s the patient\'s gender');
        this.birthDayInput = page.getByRole('textbox', { name: 'Day (required)' });
        this.birthMonthSelect = page.getByLabel('Month (required)');
        this.birthYearInput = page.getByRole('textbox', { name: 'Year (required)' });
        this.address1Input = page.locator('#address1');
        this.address2Input = page.locator('#address2');
        this.cityVillageInput = page.locator('#cityVillage');
        this.stateProvinceInput = page.locator('#stateProvince');
        this.countryInput = page.locator('#country');
        this.postalCodeInput = page.locator('#postalCode');
        this.phoneNumberInput = page.getByRole('textbox', { name: 'What\'s the patient phone' });
        this.confirmButton = page.getByRole('button', { name: 'Confirm' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.patientIdContainer = page.locator('div').filter({ hasText: 'Patient ID' }).nth(3);

        // Relationship Locators
        this.relationshipTypeSelect = page.locator('#relationship_type');
        this.personNameInput = page.getByPlaceholder('Person Name');

        // Validation Error Locators
        this.givenNameError = page.locator('span.field-error').filter({ hasText: 'Required' }).first();
        this.familyNameError = page.locator('span.field-error').filter({ hasText: 'Required' }).nth(1);
        this.genderError = page.locator('span.field-error').filter({ hasText: 'Required' });
        this.birthdateError = page.locator('span.field-error').filter({ hasText: 'Required' });
        this.birthdateFutureError = page.locator('span.field-error').filter({ hasText: 'Maximum' });
    }

    async startRegistration() {
        console.log('Starting registration...');
        await this.registerPatientLink.waitFor({ state: 'visible', timeout: 10000 });
        await this.registerPatientLink.click();
        await expect(this.page.getByRole('heading', { name: 'Register a patient' })).toBeVisible({ timeout: 10000 });
        console.log('Registration started.');
    }

    async enterDemographics(given: string, middle: string, family: string, gender: string, day: string, month: string, year: string) {
        console.log('Entering demographics...');
        await this.givenNameInput.fill(given);
        await this.middleNameInput.fill(middle);
        await this.familyNameInput.fill(family);
        await this.nextButton.click();

        await this.genderSelect.selectOption(gender);
        await this.nextButton.click();

        await this.birthDayInput.fill(day);
        await this.birthMonthSelect.selectOption(month);
        await this.birthYearInput.fill(year);
        await this.nextButton.click();
        console.log('Demographics entered.');
    }

    async enterAddress(addr1: string, addr2: string, city: string, state: string, country: string, postal: string) {
        console.log('Entering address...');
        await this.address1Input.fill(addr1);
        await this.address2Input.fill(addr2);
        await this.cityVillageInput.fill(city);
        await this.stateProvinceInput.fill(state);
        await this.countryInput.fill(country);
        await this.postalCodeInput.fill(postal);
        await this.nextButton.click();
        console.log('Address entered.');
    }

    async enterPhoneNumber(phone: string) {
        console.log('Entering phone...');
        await this.phoneNumberInput.fill(phone);
        await this.nextButton.click();
        console.log('Phone entered.');
    }

    async skipRelations() {
        await this.nextButton.click();
    }

    async confirmRegistration() {
        console.log('Confirming registration...');
        await expect(this.page.getByText('Confirm submission?')).toBeVisible();
        await this.confirmButton.click();
        await expect(this.confirmButton).toBeHidden();
        console.log('Registration confirmed.');
    }

    async cancelRegistration() {
        console.log('Cancelling registration...');
        await this.cancelButton.click();
        console.log('Registration cancelled.');
    }

    async verifyPatientRegistered(given: string, family: string) {
        console.log('Verifying registration...');
        await expect(this.page.getByText('General Actions')).toBeVisible({ timeout: 30000 });
        const patientId = await this.getPatientId();
        expect(patientId).toBeTruthy();
        console.log(`Verified Patient ID: ${patientId}`);
        await expect(this.page.locator('.PersonName-givenName')).toHaveText(given);
        await expect(this.page.locator('.PersonName-familyName')).toHaveText(family);
        console.log('Registration verified.');
    }

    async getPatientId(): Promise<string> {
        const idLocator = this.page.locator('.identifiers .float-sm-right span');
        await idLocator.waitFor({ state: 'visible', timeout: 10000 });
        return await idLocator.innerText();
    }

    async verifyNameValidationErrors() {
        await expect(this.givenNameError).toBeVisible();
        await expect(this.familyNameError).toBeVisible();
    }

    async verifyGenderValidationError() {
        await expect(this.genderError).toBeVisible();
    }

    async verifyBirthdateValidationError() {
        await expect(this.birthdateError).toBeVisible();
    }

    async verifyBirthdateFutureError() {
        await expect(this.birthdateFutureError).toBeVisible();
    }

    async clickUnidentifiedPatient() {
        await this.unidentifiedPatientCheckbox.click();
    }

    async addRelationship(relationshipType: string, personName: string) {
        await this.relationshipTypeSelect.selectOption({ label: relationshipType });
        await this.personNameInput.fill(personName);
        await this.nextButton.click();
    }

    async verifyNavigationSections() {
        const breadcrumb = this.page.locator('#formBreadcrumb');
        await expect(breadcrumb.getByText('Name')).toBeVisible();
        await expect(breadcrumb.getByText('Gender')).toBeVisible();
        await expect(breadcrumb.getByText('Birthdate')).toBeVisible();
        await expect(breadcrumb.getByText('Address')).toBeVisible();
        await expect(breadcrumb.getByText('Phone Number')).toBeVisible();
        await expect(breadcrumb.getByText('Relatives')).toBeVisible();
        await expect(this.page.locator('#confirmation_label')).toBeVisible();
    }
}
