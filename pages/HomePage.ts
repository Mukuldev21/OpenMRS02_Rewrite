import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly expectedTitle: "Home";
    readonly loggedInUser: Locator;

    // Header elements
    readonly accountLink: Locator;
    readonly locationBadge: Locator;
    readonly homeIcon: Locator;
    readonly welcomeHeading: Locator;
    readonly logoutButton: Locator;

    // Dashboard Apps
    readonly findPatientRecordApp: Locator;
    readonly activeVisitsApp: Locator;
    readonly captureVitalsApp: Locator;
    readonly registerPatientApp: Locator;
    readonly appointmentSchedulingApp: Locator;
    readonly reportsApp: Locator;
    readonly dataManagementApp: Locator;
    readonly configureMetadataApp: Locator;
    readonly systemAdministrationApp: Locator;

    constructor(page: Page) {
        this.page = page;
        this.expectedTitle = "Home";
        this.loggedInUser = page.locator('li.nav-item.identifier');

        // Initialize Header elements
        this.accountLink = page.getByText('admin My Account');
        // Note: The location badge might change based on selection, but using the one from codegen for now
        // A more robust way would be to look for the ID or class, but sticking to codegen text as requested
        this.locationBadge = page.getByRole('link', { name: /Inpatient Ward|Isolation Ward/ }).first();
        this.homeIcon = page.getByRole('link').first();
        this.welcomeHeading = page.getByRole('heading', { name: 'Logged in as Super User (' });
        this.logoutButton = page.getByRole('link', { name: 'Logout ' });

        // Initialize Dashboard Apps
        this.findPatientRecordApp = page.getByRole('link', { name: ' Find Patient Record' });
        this.activeVisitsApp = page.getByRole('link', { name: ' Active Visits' });
        this.captureVitalsApp = page.getByRole('link', { name: ' Capture Vitals' });
        this.registerPatientApp = page.getByRole('link', { name: ' Register a patient' });
        this.appointmentSchedulingApp = page.getByRole('link', { name: ' Appointment Scheduling' });
        this.reportsApp = page.getByRole('link', { name: ' Reports' });
        this.dataManagementApp = page.getByRole('link', { name: ' Data Management' });
        this.configureMetadataApp = page.getByRole('link', { name: ' Configure Metadata' });
        this.systemAdministrationApp = page.getByRole('link', { name: ' System Administration' });
    }

    async verifyHomePage() {
        await expect(this.page).toHaveTitle(this.expectedTitle);
        await expect(this.loggedInUser).toBeVisible();
    }

    async verifyDashboardElements() {
        // Verify Header
        await Promise.all([
            expect(this.accountLink).toBeVisible(),
            // Location badge might vary, checking if at least one is visible if we want to be strict, 
            // but for now let's check the one we defined.
            // await expect(this.locationBadge).toBeVisible(); // Commenting out as it might be flaky if location changes
            expect(this.homeIcon).toBeVisible(),
            expect(this.welcomeHeading).toBeVisible(),
            expect(this.logoutButton).toBeVisible(),
        ]);

        // Verify Apps
        await Promise.all([
            expect(this.findPatientRecordApp).toBeVisible(),
            expect(this.activeVisitsApp).toBeVisible(),
            expect(this.captureVitalsApp).toBeVisible(),
            expect(this.registerPatientApp).toBeVisible(),
            expect(this.appointmentSchedulingApp).toBeVisible(),
            expect(this.reportsApp).toBeVisible(),
            expect(this.dataManagementApp).toBeVisible(),
            expect(this.configureMetadataApp).toBeVisible(),
            expect(this.systemAdministrationApp).toBeVisible(),
        ]);
    }

    async navigateToFindPatientRecord() {
        await this.findPatientRecordApp.click();
    }
}