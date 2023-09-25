/// <reference types="jest" />

import "jest";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { getInputs } from "../input";

describe("input-helper tests", () => {
  beforeAll(() => {
    // Supress messages
    jest.spyOn(core, "debug").mockReturnValue(undefined);
    jest.spyOn(core, "info").mockReturnValue(undefined);
  });

  type Values = Partial<{
    pattern: string;
    flags: string;
    error: string;
    ignoreTitle: string;
    excludeDescription: string;
    checkAllCommitMessages: string;
    accessToken: string;
  }>;

  function spyOnInput(values: Values) {
    jest.spyOn(core, "getInput").mockImplementation((name: string): string => {
      return values[name as keyof Values] ?? "";
    });
  }

  it("smoke", async () => {
    spyOnInput({
      pattern: "test",
      flags: "",
      error: "Just an error",
    });

    const result = await getInputs();

    expect(result).toMatchObject({
      patternRe: /test/,
      error: "Just an error",
      messages: [],
    });
  });

  describe("required fields", () => {
    it("missing pattern", async () => {
      spyOnInput({
        pattern: "",
        flags: "",
        error: "Just an error",
      });

      await expect(getInputs()).rejects.toThrow(/Pattern/);
    });

    it("missing error", async () => {
      spyOnInput({
        pattern: "fish",
        flags: "",
        error: "",
      });

      await expect(getInputs()).rejects.toThrow(/Error/);
    });

    it("bad flags", async () => {
      spyOnInput({
        pattern: "test",
        flags: "Z",
        error: "data",
      });

      await expect(getInputs()).rejects.toThrow(/FLAGS/);
    });
  });

  describe("push", () => {
    function spyOnPush(values) {
      spyOnInput({
        pattern: "test",
        error: "data",
      });
    }

    beforeEach(() => {
      github.context.eventName = "push";
    });

    it("smoke", async () => {
      spyOnPush();

      github.context.payload.commits = [
        {
          message: "testing",
        },
      ];

      expect(await getInputs()).toMatchObject({
        messages: ["testing"],
      });
    });

    it("empty messages", async () => {
      spyOnPush();

      github.context.payload.commits = [
        {
          message: "",
        },
      ];

      expect(await getInputs()).toMatchObject({
        messages: [],
      });
    });

    it("bad payload", async () => {
      spyOnPush();

      github.context.payload = undefined;

      await expect(getInputs()).rejects.toThrow();
    });
  });

  describe("pull", () => {
    function spyOnPull(values) {
      spyOnInput({
        pattern: "test",
        error: "data",
      });
    }

    beforeEach(() => {
      github.context.eventName = "pull_request";
    });

    it("bad payload #1", async () => {
      spyOnPull();

      github.context.payload = undefined;

      await expect(getInputs()).rejects.toThrow();
    });

    it("bad payload #2", async () => {
      spyOnPull();

      github.context.payload = { pull_request: undefined };

      await expect(getInputs()).rejects.toThrow();
    });
  });
});
