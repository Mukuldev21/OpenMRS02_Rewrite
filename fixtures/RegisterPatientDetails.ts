export function getNewPatientDetails() {
    const givenNames = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
    const familyNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
    const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];

    const randomString = (length: number) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    // Generate a unique middle name to ensure overall uniqueness
    const middleName = randomString(5);
    const givenName = getRandomElement(givenNames);
    const familyName = getRandomElement(familyNames);

    return {
        givenName: givenName,
        middleName: middleName, // Using random middle name for uniqueness
        familyName: familyName,
        gender: Math.random() > 0.5 ? "M" : "F",
        birthDay: (Math.floor(Math.random() * 28) + 1).toString(),
        birthMonth: (Math.floor(Math.random() * 12) + 1).toString(),
        birthYear: (Math.floor(Math.random() * 50) + 1970).toString(),
        address1: `${Math.floor(Math.random() * 999) + 1} ${randomString(6)} St`,
        address2: "Apt " + Math.floor(Math.random() * 100),
        city: getRandomElement(cities),
        state: randomString(2).toUpperCase(),
        country: "USA",
        postalCode: (Math.floor(Math.random() * 89999) + 10000).toString(),
        phoneNumber: (Math.floor(Math.random() * 89999999) + 10000000).toString() // 8 digits like codegen
    };
}
