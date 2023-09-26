import * as core from "@actions/core";
import { CheckerArguments } from "./types";

/**
 * Checks commit messages given by args.
 *
 * @param     args messages, pattern and error message to process.
 * @returns   void
 */
export function checkCommitMessages({ messages, patternRe, error }: CheckerArguments): void {
  if (messages.length === 0) {
    core.info("No messages to check");
    return;
  }

  core.info(`Checking commit messages against: ${String(patternRe)}`);
  // core.info(`Messages is ${messages.length} lines`);
  // messages.forEach((msg, idx) => {
  // core.info(`Messages[idx] = ${msg}`);
  // });

  const result = messages.every((message) => {
    if (!patternRe.test(message)) {
      core.info(`failed: ${message}`);

      return false;
    }

    return true;
  });

  if (!result) {
    throw new Error(error);
  }
}
