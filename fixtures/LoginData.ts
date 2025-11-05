import { error } from "console";

export const loginData = {  
    validUser: {
        username: "admin",
        password: "Admin123",
        location: "Inpatient Ward"
    },
    invalidUser: {
        username: "invalidUser",
        password: "invalidPass",
        location: "Inpatient Ward"
    },
    errorMessages: {
        invalidCredentials: "Invalid username or password. Invalid username/password. Please try again. try again.",
        locationRequired: "You must choose a location!"
    },
    sessionLocations: [
        "Inpatient Ward",
        "Isolation Ward",
        "Outpatient Clinic",
        "Pharmacy",
        "Laboratory",
        "Registration Desk"
    ]
};
