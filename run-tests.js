const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);

// Module to File Pattern Mapping (Regex for filename)
const MODULE_MAP = {
    'Module A': /LoginTest\.spec\.ts$/,
    'Module B': /register.*\.spec\.ts$/,
    'Module C': /homePagetest\.spec\.ts$/,
};

function printHelp() {
    console.log('Usage: node run-tests.js [options]');
    console.log('\nOptions:');
    console.log('  --module <name>   Run tests for a specific module (e.g., "Module B")');
    console.log('  --test <id>       Run a specific test case by ID (e.g., "TC-B.2")');
    console.log('  --help            Show this help message');
    console.log('\nAvailable Modules:');
    Object.keys(MODULE_MAP).forEach(key => console.log(`  - ${key}`));
}

let targetFiles = [];
let testGrep = '';

// Parse Arguments
for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--module') {
        const moduleName = args[i + 1];
        const key = Object.keys(MODULE_MAP).find(k => k.toLowerCase().includes(moduleName.toLowerCase()));

        if (key) {
            const pattern = MODULE_MAP[key];
            console.log(`Selected Module: ${key}`);

            // Find matching files in tests/ directory
            const testsDir = path.join(__dirname, 'tests');
            if (fs.existsSync(testsDir)) {
                const files = fs.readdirSync(testsDir);
                const matched = files.filter(file => pattern.test(file)).map(file => `tests/${file}`);
                targetFiles = targetFiles.concat(matched);
            }
        } else {
            console.error(`Error: Module "${moduleName}" not found.`);
            printHelp();
            process.exit(1);
        }
        i++;
    } else if (arg === '--test') {
        testGrep = args[i + 1];
        console.log(`Selected Test Case: ${testGrep}`);
        i++;
    } else if (arg === '--help') {
        printHelp();
        process.exit(0);
    }
}

// Construct Command
let command = 'npx playwright test';

if (targetFiles.length > 0) {
    command += ` ${targetFiles.join(' ')}`;
}

if (testGrep) {
    command += ` -g "${testGrep}"`;
}

if (targetFiles.length === 0 && !testGrep) {
    console.log('No specific module or test selected. Running all tests...');
}

console.log(`\nExecuting: ${command}\n`);

const startTime = Date.now();
let success = true;

try {
    execSync(command, { stdio: 'inherit' });
} catch (error) {
    success = false;
    console.error('\nTest execution failed.');
} finally {
    const endTime = Date.now();
    const durationSeconds = (endTime - startTime) / 1000;

    console.log('\n--------------------------------------------------');
    if (durationSeconds > 60) {
        const minutes = Math.floor(durationSeconds / 60);
        const seconds = Math.floor(durationSeconds % 60);
        const minuteText = minutes === 1 ? 'minute' : 'minutes';
        console.log(`Total Execution Time: ${minutes} ${minuteText} and ${seconds} seconds`);
    } else {
        console.log(`Total Execution Time: ${durationSeconds.toFixed(2)} seconds`);
    }
    console.log('--------------------------------------------------\n');

    if (!success) {
        process.exit(1);
    }
}
