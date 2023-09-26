/**
 * Imports
 */
import * as core from "@actions/core";
import * as inputHelper from "./input";
import * as commitMessageChecker from "./checker";

/**
 * Main function
 */
async function main(): Promise<void> {
  try {
    const args = await inputHelper.getInputs();

    if (args.messages.length === 0) {
      core.info(`No commits found in the payload, skipping check.`);
      return;
    }

    commitMessageChecker.checkCommitMessages(args);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error);
    } else {
      throw error; // re-throw the error unchanged
    }
  }
}

/**
 * Main entry point
 */
main().catch((err) =>
  // eslint-disable-next-line no-console
  console.error(err),
);
