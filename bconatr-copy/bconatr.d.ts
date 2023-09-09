export type TestSuite = {
  suiteName: string;
  tests: Test[];
};

export type Test = {
  testDescription: string;
  evaluationString: string;
  expectedValue: string;
};

export type TestResult = {
  testDescription: string;
  evaluationString: string;
  expectedValue: any;
  actualValue: any;
  passed: boolean;
};

export type SuiteResult = {
  suiteName: string;
  passing: number;
  failing: number;
  testResults: TestResult[];
};

export type MessagePrinter = (message: string) => void;

export interface BconatrI {
  runTests(testSuites: TestSuite[]): void;
}
