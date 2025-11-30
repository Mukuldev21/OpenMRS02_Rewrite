# OpenMRS02 Rewrite - Playwright E2E Tests

This repository contains end-to-end (E2E) tests for the OpenMRS02 application using [Playwright](https://playwright.dev/). The tests automate login functionality and basic navigation, ensuring reliability and correctness of the web application.

## Project Structure

- `pages/` - Page Object Model classes for different application pages.
- `fixtures/` - Test data and constants.
- `tests/` - Playwright test specifications.
- `.github/workflows/` - GitHub Actions workflow for CI test runs.
- `playwright.config.ts` - Playwright configuration.
- `playwright-report/` - Test reports (generated).
- `test-results/` - Test result artifacts (generated).

## Technologies Used

- **Playwright**: Browser automation for E2E testing.
- **TypeScript**: Type-safe test and page object development.
- **GitHub Actions**: Continuous Integration for automated test runs.
- **Node.js**: Runtime environment for Playwright and test scripts.

## Getting Started

1. Install dependencies:
    ```sh
    npm ci
    ```
2. Run tests locally:
    ```sh
    npx playwright test
    ```
3. View HTML reports:
    ```sh
    npx playwright show-report
    ```

## Running Custom Tests

You can run tests for specific modules or individual test cases using the custom runner script.

**Run tests for a specific module:**
```sh
node run-tests.js --module "Module B"
```
*Available Modules: Module A (Login), Module B (Patient Registration), Module C (Home Page)*

**Run a specific test case by ID:**
```sh
node run-tests.js --test "TC-B.2"
```

## Test Cases

Detailed test scenarios and their steps are documented in [testcases.md](testcases.md).

## Continuous Integration

Tests are automatically run on push and pull requests to `main` or `master` via [GitHub Actions workflow](.github/workflows/playwright.yml).

## License

ISC
