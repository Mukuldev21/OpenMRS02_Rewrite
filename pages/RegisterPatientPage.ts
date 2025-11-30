import { Page, Locator, expect } from '@playwright/test';

export class RegisterPatientPage {
    readonly page: Page;
    readonly registerPatientLink: Locator;
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
    readonly patientIdContainer: Locator;

    // Validation Error Locators
    readonly givenNameError: Locator;
    readonly familyNameError: Locator;
    readonly genderError: Locator;
    readonly birthdateError: Locator;

    constructor(page: Page) {
        this.page = page;
        // Use a partial match or exact: false to handle the icon potentially missing or being different
        this.registerPatientLink = page.getByRole('link', { name: 'Register a patient', exact: false });
        this.givenNameInput = page.getByRole('textbox', { name: 'Given (required)' });
        this.middleNameInput = page.getByRole('textbox', { name: 'Middle' });
        this.familyNameInput = page.getByRole('textbox', { name: 'Family Name (required)' });
        this.nextButton = page.getByRole('button', { name: '' });
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
        this.confirmButton = page.getByRole('button', { name: 'Confirm' });
        this.patientIdContainer = page.locator('div').filter({ hasText: 'Patient ID' }).nth(3);

        // Initialize Validation Error Locators
        // These are based on the "Required" text appearing next to fields
        this.givenNameError = page.locator('.field-error').filter({ hasText: 'Required' }).first();
        // Note: The specific selector might need adjustment if multiple "Required" texts appear. 
        // Based on exploration, they are siblings or near the inputs. 
        // Let's use more specific relative locators if possible, or rely on order if they appear sequentially.
        // Actually, let's try to be more specific based on the input field association if possible, 
        // but for now, generic "Required" text visibility in the active section is a good start.
        // A better approach for "Required" messages that are just text nodes or spans:
        this.givenNameError = page.locator('span.field-error').filter({ hasText: 'Required' }).first();
        this.familyNameError = page.locator('span.field-error').filter({ hasText: 'Required' }).nth(1); // Assuming second one if both trigger
        this.genderError = page.locator('span.field-error').filter({ hasText: 'Required' });
        this.birthdateError = page.locator('span.field-error').filter({ hasText: 'Required' });
    }

    async startRegistration() {
        await this.registerPatientLink.click();
        await expect(this.page.getByRole('heading', { name: 'Register a patient' })).toBeVisible();
    }

    async enterDemographics(given: string, middle: string, family: string, gender: string, day: string, month: string, year: string) {
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
    }

    async enterAddress(addr1: string, addr2: string, city: string, state: string, country: string, postal: string) {
        await this.address1Input.fill(addr1);
        await this.address2Input.fill(addr2);
        await this.cityVillageInput.fill(city);
        await this.stateProvinceInput.fill(state);
        await this.countryInput.fill(country);
        await this.postalCodeInput.fill(postal);
        await this.nextButton.click();
    }

    async enterPhoneNumber(phone: string) {
        await this.phoneNumberInput.fill(phone);
        await this.nextButton.click();
    }

    async skipRelations() {
        await this.nextButton.click();
    }

    async confirmRegistration() {
        // Wait for the confirmation page to be visible
        await expect(this.page.getByText('Confirm submission?')).toBeVisible();
        await this.confirmButton.click();
        // Wait for the button to disappear, indicating navigation or submission
        await expect(this.confirmButton).toBeHidden();
    }

    async verifyPatientRegistered(given: string, family: string) {
        // Wait for the patient dashboard to load by checking for a common element like the 'General Actions' or 'Visits'
        await expect(this.page.getByText('General Actions')).toBeVisible({ timeout: 30000 });

        // Check for Patient ID by trying to extract it
        const patientId = await this.getPatientId();
        expect(patientId).toBeTruthy();
        console.log(`Verified Patient ID: ${patientId}`);

        // Verify the name using specific locators provided by the user
        await expect(this.page.locator('.PersonName-givenName')).toHaveText(given);
        await expect(this.page.locator('.PersonName-familyName')).toHaveText(family);
    }

    async getPatientId(): Promise<string> {
        // Locate the element containing the ID based on user provided HTML:
        // <div class="identifiers ..."> <div class="float-sm-right"> <em>Patient ID</em> <span>100HWJ</span> </div> </div>
        // We target the span inside the float-sm-right div which is inside identifiers
        const idLocator = this.page.locator('.identifiers .float-sm-right span');
        // Wait for it to be attached and visible
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
}
