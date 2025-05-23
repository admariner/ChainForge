import { ChatHistoryInfo, Dict } from "../typing";

export type EvalCriteriaUID = string;

export interface EvalCriteria {
  shortname: string;
  criteria: string;
  eval_method: "code" | "expert";
  uid: EvalCriteriaUID;
  priority: number;
  source?: string;
}

export interface EvalGenReport {
  criteria: EvalCriteria[];
  failureCoverage: number;
  falseFailureRate: number;
}

export function validEvalCriteriaFormat(json_obj: Dict) {
  return (
    "criteria" in json_obj &&
    "shortname" in json_obj &&
    ["code", "expert"].includes(json_obj.eval_method)
  );
}

export enum EvalFunctionResult {
  PASS = "pass",
  FAIL = "fail",
  SKIP = "skip",
}

export interface EvalFunction {
  evalCriteria: EvalCriteria;
  code: string;
  name: string;
  uid: string;
}

export interface EvalFunctionReport {
  evalFunction: EvalFunction;
  true_pass: number;
  true_fail: number;
  false_pass: number;
  false_fail: number;
  skipped: number;
  mcc?: number; // Matthews correlation coefficient, which is a measure of the quality of binary classifications
  f1?: number; // F1 score, which is the harmonic mean of precision and recall
  cohens_kappa?: number; // Cohen's kappa, which is a measure of inter-rater agreement
  failureCoverage?: number; // The percentage of failures that were covered by the eval function
  falseFailureRate?: number; // The percentage of false failures
}

export interface EvalFunctionSetReport {
  failureCoverage: number;
  falseFailureRate: number;
  selectedEvalFunctions: EvalFunction[];
  allEvalFunctionReports: Map<EvalCriteria, EvalFunctionReport[]>; // Map from criteria to function reports
}

export class EvalExecutionError extends Error {
  constructor(message: string) {
    super(message); // Call the parent constructor with the message
    this.name = "EvalExecutionError"; // Set the error name to the class name
    Object.setPrototypeOf(this, EvalExecutionError.prototype);
  }
}

export const AssertionWriterSystemMsg =
  "You are an expert Python programmer and helping me write assertions for my LLM pipeline. An LLM pipeline accepts an example and prompt template, fills the template's placeholders with the example, and generates a response.";
export const AssertionWriterSystemMsgChatHistory: ChatHistoryInfo[] = [
  {
    messages: [
      {
        role: "system",
        content: AssertionWriterSystemMsg,
      },
    ],
    fill_history: {},
  },
];
