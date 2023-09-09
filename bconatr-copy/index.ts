import type {Test, TestResult, TestSuite, SuiteResult, MessagePrinter, BconatrI} from './bconatr'

// @ts-ignore
class Bconatr implements BconatrI {
  #passingTests = 0;
  #failingTests = 0;
  #overallResults: SuiteResult[];

  runTests(testSuites: TestSuite[]): void {
    console.groupEnd();
    this.#printHeader("🥓 Tests start here. 🥓");
    this.#overallResults = testSuites.map(
      (testSuite: TestSuite): SuiteResult => {
        return this.#runTestSuite(testSuite);
      }
    );

    this.#printResults();
  }

  #runTestSuite(testSuite: TestSuite): SuiteResult {
    const { suiteName, tests } = testSuite;
    if (window[suiteName] === undefined) {
      (window as any)[suiteName] = function () {};
    }

    const suiteResult: SuiteResult = {
      suiteName,
      passing: 0,
      failing: 0,
      testResults: [],
    };

    tests.forEach((test: Test) => {
      const { testDescription, evaluationString, expectedValue } = test;
      const actualValue = eval(evaluationString);
      let passed = false;
      if (actualValue === expectedValue) {
        passed = true;
        suiteResult.passing++;
        this.#passingTests++;
      } else {
        suiteResult.failing++;
        this.#failingTests++;
      }

      suiteResult.testResults.push({
        testDescription,
        evaluationString,
        expectedValue,
        actualValue,
        passed,
      });
    });

    return suiteResult;
  }

  #printResults(): void {
    console.groupEnd();
    const current = this.#overallResults.find(({ failing }) => failing > 0);

    this.#overallResults.forEach((suiteResults: SuiteResult) => {
      const { suiteName, passing, failing, testResults } = suiteResults;
      const printSuiteHeader = (print: (...params: string[]) => void) => {
        print(
          `%c${suiteName}: ${passing}/${passing + failing}`,
          failing ? "color: red;" : "color: green;"
        );
      };

      printSuiteHeader(
        suiteResults === current ? console.group : console.groupCollapsed
      );

      testResults.forEach((testResult: TestResult) => {
        const {
          testDescription,
          evaluationString,
          expectedValue,
          actualValue,
          passed,
        } = testResult;

        if (passed) {
          this.#printPassMessage(`✅ pass: ${testDescription}`);
        } else {
          this.#printFailMessage(`🚨 FAIL: ${testDescription}`);
          this.#printTestDetails(evaluationString, expectedValue, actualValue);
        }
      });

      console.groupEnd();
    });

    this.#printHeader("\n📋 Full test breakdown:\n");
    if (this.#failingTests) {
      this.#printPassMessage(`✅ ${this.#passingTests} tests passing ✅`);
      this.#printFailMessage(`🚨 ${this.#failingTests} TESTS FAILING 🚨`);
    } else {
      this.#printPassMessage(
        `\n🎉 All ${this.#passingTests} tests passing! 🎉`
      );
    }

    this.#printHeader("\n🏁 Tests end here. 🏁");
  }

  #printTestDetails(
    evaluationString: string,
    expectedValue: any,
    actualValue: any
  ): void {
    const expectedQuoteSymbol = typeof expectedValue === "string" ? '"' : "`";
    const actualQuoteSymbol = typeof actualValue === "string" ? '"' : "`";
    console.log(
      "RAN: " +
        evaluationString +
        "\n" +
        "WANTED BACK: " +
        expectedQuoteSymbol +
        expectedValue +
        expectedQuoteSymbol +
        "\n" +
        "GOT BACK: " +
        actualQuoteSymbol +
        actualValue +
        actualQuoteSymbol
    );
  }

  #printHeader: MessagePrinter = (message) => {
    console.log(
      `%c${message}`,
      "color: blue; font-weight: bold; font-size: 1.5em;"
    );
  };

  #printPassMessage: MessagePrinter = (message) => {
    console.log(`%c${message}`, "color: green; font-size: 1.2em;");
  };

  #printFailMessage: MessagePrinter = (message) => {
    console.log(
      `%c${message}`,
      "color: red; font-weight: bold; font-size: 1.2em;"
    );
  };
}
