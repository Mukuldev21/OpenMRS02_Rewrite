# OpenMRS Test Cases

## Module A: Login Functionality

| Test Case ID | Test Scenario | Description | Status |
| :--- | :--- | :--- | :--- |
| **TC-A.1** | Successful Login | Verify user can login with valid username, password, and location. | ✅ Automated (`LoginTest.spec.ts`) |
| **TC-A.2** | Invalid Credential Login | Verify error message when logging in with invalid credentials. | ✅ Automated (`LoginTest.spec.ts`) |
| **TC-A.3** | Logout Functionality | Verify user can logout successfully. | ✅ Automated (`LoginTest.spec.ts`) |
| **TC-A.4** | Login without Location | Verify error message when logging in without selecting a session location. | ✅ Automated (`LoginTest.spec.ts`) |
| **TC-A.5** | Verify Session Locations | Verify all expected session locations are displayed. | ✅ Automated (`LoginTest.spec.ts`) |

## Module B: Patient Registration

| Test Case ID | Test Scenario | Description | Status |
| :--- | :--- | :--- | :--- |
| **TC-B.1** | Register Patient (Happy Path) | Register a new patient with all valid details (Name, Gender, Birthdate, Address, Phone). | ✅ Automated (`registerpatienttest.spec.ts`) |
| **TC-B.2** | Register Patient - Required Fields Validation | Verify validation messages when attempting to proceed without filling required fields (Given Name, Family Name, Gender, etc.). | ⬜ Proposed |
| **TC-B.3** | Register Unidentified Patient | Register a patient using the "Unidentified Patient" checkbox flow. | ⬜ Proposed |
| **TC-B.4** | Register Patient with Relationships | Register a patient and add a relative/relationship during the flow. | ⬜ Proposed |
| **TC-B.5** | Register Patient - Navigation | Verify navigation between sections using the left-side menu (Demographics, Contact Info, etc.). | ⬜ Proposed |
| **TC-B.6** | Register Patient - Future Birthdate | Verify error/validation when entering a future birthdate. | ⬜ Proposed |
| **TC-B.7** | Register Patient - Invalid Phone Number | Verify validation for invalid phone number formats. | ⬜ Proposed |
| **TC-B.8** | Cancel Registration | Verify functionality of the cancel/discard button during registration. | ⬜ Proposed |

## Module C: Find Patient (Future)

| Test Case ID | Test Scenario | Description | Status |
| :--- | :--- | :--- | :--- |
| **TC-C.1** | Search by Name | Search for an existing patient by name. | ⬜ Proposed |
| **TC-C.2** | Search by ID | Search for an existing patient by Patient ID. | ⬜ Proposed |
