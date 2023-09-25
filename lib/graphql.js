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
exports.getCommitMessagesFromPullRequest = void 0;
const core = __importStar(require("@actions/core"));
const graphql_1 = require("@octokit/graphql");
const query = `
  query commitMessages(
    $repositoryOwner: String!
    $repositoryName: String!
    $pullRequestNumber: Int!
    $numberOfCommits: Int = 100
  ) {
    repository(owner: $repositoryOwner, name: $repositoryName) {
      pullRequest(number: $pullRequestNumber) {
        commits(last: $numberOfCommits) {
          edges {
            node {
              commit {
                message
              }
            }
          }
        }
      }
    }
  }
`;
async function getCommitMessagesFromPullRequest(accessToken, repositoryOwner, repositoryName, pullRequestNumber) {
    const { repository } = await (0, graphql_1.graphql)(query, {
        baseUrl: process.env["GITHUB_API_URL"] || "https://api.github.com",
        repositoryOwner,
        repositoryName,
        pullRequestNumber,
        headers: {
            authorization: `token ${accessToken}`,
        },
    });
    core.debug(`response: ${JSON.stringify(repository, null, 2)}`);
    // Valid response
    if (repository.pullRequest) {
        return repository.pullRequest.commits.edges.map((edge) => edge.node.commit.message);
    }
    return [];
}
exports.getCommitMessagesFromPullRequest = getCommitMessagesFromPullRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGhxbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9ncmFwaHFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQXNDO0FBQ3RDLDhDQUEyQztBQXVCM0MsTUFBTSxLQUFLLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXFCYixDQUFDO0FBRUssS0FBSyxVQUFVLGdDQUFnQyxDQUNwRCxXQUFtQixFQUNuQixlQUF1QixFQUN2QixjQUFzQixFQUN0QixpQkFBeUI7SUFFekIsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLE1BQU0sSUFBQSxpQkFBTyxFQUFxQixLQUFLLEVBQUU7UUFDOUQsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSx3QkFBd0I7UUFDbEUsZUFBZTtRQUNmLGNBQWM7UUFDZCxpQkFBaUI7UUFDakIsT0FBTyxFQUFFO1lBQ1AsYUFBYSxFQUFFLFNBQVMsV0FBVyxFQUFFO1NBQ3RDO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFL0QsaUJBQWlCO0lBQ2pCLElBQUksVUFBVSxDQUFDLFdBQVcsRUFBRTtRQUMxQixPQUFPLFVBQVUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFpQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNsRztJQUVELE9BQU8sRUFBRSxDQUFDO0FBQ1osQ0FBQztBQXhCRCw0RUF3QkMifQ==