import { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

class CustomReporter implements Reporter {
    private startTime: number = 0;

    onBegin(config: FullConfig, suite: Suite) {
        this.startTime = Date.now();
        console.log(`\n🚀 Starting OpenMRS02 E2E test suite execution...`);
        console.log(`📋 Total tests to run: ${suite.allTests().length}\n`);
    }

    onTestBegin(test: TestCase) {
        console.log(`🧪 Starting test: ${test.title}`);
    }

    onTestEnd(test: TestCase, result: TestResult) {
        const duration = result.duration;
        if (result.status === 'passed') {
            console.log(`✅ Test passed: ${test.title} (${duration}ms)`);
        } else if (result.status === 'failed') {
            console.log(`❌ Test failed: ${test.title} (${duration}ms)`);
            if (result.error) {
                console.log(`   Error: ${result.error.message}`);
            }
        } else if (result.status === 'timedOut') {
            console.log(`⏰ Test timed out: ${test.title} (${duration}ms)`);
        } else if (result.status === 'skipped') {
            console.log(`⏭️  Test skipped: ${test.title}`);
        }
    }

    onEnd(result: FullResult) {
        const totalTime = (Date.now() - this.startTime) / 1000;
        console.log(`\n🏁 Test execution finished!`);
        console.log(`⏱️  Total time: ${totalTime.toFixed(2)}s`);
        console.log(`📊 Status: ${result.status.toUpperCase()}`);
        if (result.status === 'passed') {
            console.log(`🎉 All tests passed! Great job!`);
        } else {
            console.log(`😢 Some tests failed. Check the report for details.`);
        }
    }

    onError(error: TestResult['error']) {
        if (error) {
            console.log(`💥 Global error occurred: ${error.message}`);
        }
    }
}

export default CustomReporter;
