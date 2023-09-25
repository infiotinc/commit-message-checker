import * as core from "@actions/core";
import { CheckerArguments } from "../types";
import { checkCommitMessages } from "../checker";

// Late bind
let commitMessageChecker: any;

describe("checkCommitMessages", () => {
  beforeAll(() => {
    // Supress messages
    jest.spyOn(core, "debug").mockReturnValue(undefined);
    jest.spyOn(core, "info").mockReturnValue(undefined);
  });

  it("requires messages", async () => {
    const checkerArguments: CheckerArguments = {
      patternRe: /some-pattern/,
      error: "some-error",
      messages: [],
    };
    await expect(checkCommitMessages(checkerArguments)).resolves.not.toThrow();
  });

  it("check fails single message", async () => {
    const checkerArguments: CheckerArguments = {
      patternRe: /some-pattern/,
      error: "some-error",
      messages: ["some-message"],
    };
    await expect(checkCommitMessages(checkerArguments)).rejects.toThrow("some-error");
  });

  it("check fails multiple messages", async () => {
    const checkerArguments: CheckerArguments = {
      patternRe: /some-pattern/,
      error: "some-error",
      messages: ["some-message", "some-pattern"],
    };
    await expect(checkCommitMessages(checkerArguments)).rejects.toThrow("some-error");
  });

  it("check succeeds on single message", async () => {
    const checkerArguments: CheckerArguments = {
      patternRe: /.*/,
      error: "some-error",
      messages: ["some-message"],
    };
    await expect(checkCommitMessages(checkerArguments)).resolves.not.toThrow();
  });

  it("check fails when multiple don't match", async () => {
    const checkerArguments: CheckerArguments = {
      patternRe: /^some-.*/,
      error: "some-error",
      messages: ["some-message", "other-message"],
    };
    await expect(checkCommitMessages(checkerArguments)).rejects.toThrow("some-error");
  });

  it("check succeeds on multiple messages", async () => {
    const checkerArguments: CheckerArguments = {
      patternRe: /^some.*/,
      error: "some-error",
      messages: ["some-message", "some-other-message"],
    };
    await expect(checkCommitMessages(checkerArguments)).resolves.not.toThrow();
  });
});
