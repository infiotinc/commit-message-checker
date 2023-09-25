"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputs = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const graphql_1 = require("./graphql");
const validFlagRe = /[^gimsuy]/g;
// Valid "true" values for YAML
const truth = ["true", "True", "TRUE"];
/**
 * Gets the inputs set by the user and the messages of the event.
 */
async function getInputs() {
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
exports.getInputs = getInputs;
async function handlePullRequst(options, context) {
    if (!context.payload) {
        throw new Error("No payload found in the context.");
    }
    if (!github.context.payload.pull_request) {
        throw new Error("No pull_request found in the payload.");
    }
    const messages = [];
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
        if (!github.context.payload.repository.owner ||
            (!github.context.payload.repository.owner.login && !github.context.payload.repository.owner.name)) {
            throw new Error("No owner found in the repository.");
        }
        const commitMessages = await (0, graphql_1.getCommitMessagesFromPullRequest)(options.accessToken, github.context.payload.repository.owner.name ?? github.context.payload.repository.owner.login, github.context.payload.repository.name, github.context.payload.pull_request.number);
        messages.push(...commitMessages);
    }
    return messages;
}
async function handlePush(options, context) {
    if (!context.payload) {
        throw new Error("No payload found in the context.");
    }
    if (!Array.isArray(github.context.payload.commits)) {
        core.debug("No commits -- skipping");
        return [];
    }
    return context.payload.commits.filter((v) => v && !!v.message).map(({ message }) => message);
}
const handlers = {
    pull_request_target: handlePullRequst,
    pull_request: handlePullRequst,
    push: handlePush,
};
/**
 * Gets all commit messages of a push or title and body of a pull request
 * concatenated to one message.
 */
async function getMessages(options) {
    core.debug(`Getting messages ${github.context.eventName}`);
    return handlers[github.context.eventName]?.(options, github.context) ?? [];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5wdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBc0M7QUFDdEMsd0RBQTBDO0FBRTFDLHVDQUE2RDtBQVc3RCxNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUM7QUFFakMsK0JBQStCO0FBQy9CLE1BQU0sS0FBSyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUV2Qzs7R0FFRztBQUNJLEtBQUssVUFBVSxTQUFTO0lBQzdCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDN0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN6RCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXJDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0tBQy9DO0lBQ0QsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7S0FDN0M7SUFDRCxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFDO0tBQzdFO0lBRUQsT0FBTztRQUNMLHVCQUF1QjtRQUN2QixTQUFTLEVBQUUsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQztRQUNyQyxrQ0FBa0M7UUFDbEMsS0FBSyxF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