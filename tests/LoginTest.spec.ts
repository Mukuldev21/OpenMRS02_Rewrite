import {test} from '@playwright/test';
import {LoginPage} from '../pages/LoginPage';
import { loginData } from '../fixtures/LoginData';
import { HomePage } from '../pages/HomePage';


test.describe('Login Tests', () => {
    let loginPage: LoginPage;
    let homePage: HomePage;
    let validUser = loginData.validUser;
    let invalidUser = loginData.invalidUser;
    let errorMessages = loginData.errorMessages;
    let sessionLocations = loginData.sessionLocations;

    test.beforeEach(async ({page}) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test.describe("Login Functionality", () => {

    test('Successful login', async () => {
        await loginPage.login(validUser.username, validUser.password, validUser.location);
        homePage = new HomePage(loginPage.page);
        await homePage.verifyHomePage();
    });

    test('Unsuccessful login', async () => {
        await loginPage.login(invalidUser.username, invalidUser.password, invalidUser.location);
        await loginPage.errorMessage.isVisible();
        await loginPage.assertErrorMessage(errorMessages.invalidCredentials);
    });
    test('Login without selecting session location', async () => {
        await loginPage.loginWithoutLocation(validUser.username, validUser.password);
        await loginPage.errorMessageSessionLocationSelect.isVisible();
        await loginPage.assertSessionLocationError(errorMessages.locationRequired);
    });

    test('Verify session locations', async () => {
        await loginPage.verifySessionLocations(sessionLocations);
    });

 });
});
