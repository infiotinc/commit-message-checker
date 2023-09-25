import * as core from "@actions/core";
import * as github from "@actions/github";
import { CheckerArguments } from "./types";
import { getCommitMessagesFromPullRequest } from "./graphql";

export interface Options {
  checkTitle: boolean;
  checkDescription: boolean;
  checkAllCommitMessages: boolean; // requires github token
  accessToken: string;
}

type Handler = (options: Options, context: typeof github.context) => Promise<string[]>;

const validFlagRe = /[^gimsuy]/g;

// Valid "true" values for YAML
const truth = ["true", "True", "TRUE"];

/**
 * Gets the inputs set by the user and the messages of the event.
 */
export async function getInputs(): Promise<CheckerArguments> {
  const pattern = core.getInput("pattern", { required: true });
  const error = core.getInput("error", { required: true });
  const flags = core.getInput("flags");

  if (pattern.length === 0) {
    throw new Error("Pattern must be non empty.");
  }
  if (error.length === 0) {
    throw new Error("Error must be non empty.");
  }
  if (validFlagRe.test(flags)) {
    throw new Error("FLAGS contains invalid characters only [gimsuy] allowed.");
  }

  return {
    // What we actually use
    patternRe: new RegExp(pattern, flags),
    // The error to display in failure
    error: error,
    // Either the commit or pull request messages
    messages: await getMessages({
      checkTitle: !truth.includes(core.getInput("excludeTitle")),
      checkDescription: !truth.includes(core.getInput("excludeDescription")),
      checkAllCommitMessages: truth.includes(core.getInput("checkAllCommitMessages")),
      accessToken: core.getInput("accessToken"),
    }),
  };
}

async function handlePullRequst(options: Options, context: typeof github.context): Promise<string[]> {
  if (!context.payload) {
    throw new Error("No payload found in the context.");
  }

  if (!github.context.payload.pull_request) {
    throw new Error("No pull_request found in the payload.");
  }

  const messages: string[] = [];

  // Handle pull request title and body
  if (options.checkTitle && github.context.payload.pull_request.title) {
    messages.push(github.context.payload.pull_request.title);
  }

  if (options.checkDescription && github.context.payload.pull_request.body) {
    messages.push(github.context.payload.pull_request.body);
  }

  // Handle pull request commits
  if (options.checkAllCommitMessages) {
    if (!options.accessToken) {
      throw new Error("The `checkAllCommitMessages` option requires a github access token.");
    }

    if (!github.context.payload.pull_request.number) {
      throw new Error("No number found in the pull_request.");
    }

    if (!github.context.payload.repository) {
      throw new Error("No repository found in the payload.");
    }

    if (!github.context.payload.repository.name) {
      throw new Error("No name found in the repository.");
    }

    if (
      !github.context.payload.repository.owner ||
      (!github.context.payload.repository.owner.login && !github.context.payload.repository.owner.name)
    ) {
      throw new Error("No owner found in the repository.");
    }

    const commitMessages = await getCommitMessagesFromPullRequest(
      options.accessToken,
      github.context.payload.repository.owner.name ?? github.context.payload.repository.owner.login,
      github.context.payload.repository.name,
      github.context.payload.pull_request.number,
    );

    messages.push(...commitMessages);
  }

  return messages;
}

async function handlePush(options: Options, context: typeof github.context): Promise<string[]> {
  if (!context.payload) {
    throw new Error("No payload found in the context.");
  }

  if (!Array.isArray(github.context.payload.commits)) {
    core.debug("No commits -- skipping");
    return [];
  }

  // We're assuming the shape here.
  type Commit = {
    message: string;
  };

  return (context.payload.commits as Commit[]).filter((v) => v && !!v.message).map(({ message }) => message);
}

const handlers: Record<string, Handler> = {
  pull_request_target: handlePullRequst,
  pull_request: handlePullRequst,
  push: handlePush,
};

/**
 * Gets all commit messages of a push or title and body of a pull request
 * concatenated to one message.
 */
async function getMessages(options: Options): Promise<string[]> {
  core.debug(`Getting messages ${github.context.eventName}`);

  return handlers[github.context.eventName]?.(options, github.context) ?? [];
}
