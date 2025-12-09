import { Page, Locator, expect } from '@playwright/test';

export class FindPatientRecordPage {
    readonly page: Page;
    readonly findPatientRecordLink: Locator;
    readonly searchInput: Locator;
    readonly homeLink: Locator;
    readonly resultsTable: Locator;
    readonly noRecordsMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.findPatientRecordLink = page.getByRole('link', { name: /Find Patient Record/i });
        this.searchInput = page.getByRole('textbox', { name: 'Search by ID or Name' });
        this.homeLink = page.getByRole('link', { name: '' });
        this.resultsTable = page.locator('#patient-search-results-table');
        this.noRecordsMessage = page.getByRole('cell', { name: 'No matching records found' });
    }

    async navigateToFindPatientRecord() {
        console.log('Navigating to Find Patient Record page...');
        await this.findPatientRecordLink.waitFor({ state: 'visible', timeout: 30000 });
        await this.findPatientRecordLink.click();
        await expect(this.searchInput).toBeVisible({ timeout: 30000 });
        console.log('Find Patient Record page loaded.');
    }

    async searchByPatient(identifierOrName: string) {
        console.log(`Searching for: ${identifierOrName}`);
        await this.searchInput.fill(identifierOrName);
        await this.searchInput.press('Enter');
        // Wait for search processing - usually table updates or "no records" appears
        await this.page.waitForTimeout(1000);
    }

    async verifyPatientVisible(identifierOrName: string) {
        await expect(this.page.getByText(identifierOrName).first()).toBeVisible({ timeout: 30000 });
    }

    async selectPatient(identifierOrName: string) {
        await this.page.getByText(identifierOrName).first().click();
    }

    async verifyNoRecordsFound() {
        await expect(this.noRecordsMessage).toBeVisible({ timeout: 10000 });
    }

    async goHome() {
        await this.homeLink.click();
    }
}
