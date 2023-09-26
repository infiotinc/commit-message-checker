import * as core from "@actions/core";
import { graphql } from "@octokit/graphql";
import fetch from "node-fetch";


//
// Graphql query and response types
//
interface CommitEdges {
  node: {
    commit: {
      message: string;
    };
  };
}

interface RepositoryResponse {
  repository: {
    pullRequest: {
      commits: {
        edges: CommitEdges[];
      };
    };
  };
}

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

export async function getCommitMessagesFromPullRequest(
  accessToken: string,
  repositoryOwner: string,
  repositoryName: string,
  pullRequestNumber: number,
): Promise<string[]> {
  const { repository } = await graphql<RepositoryResponse>(query, {
    baseUrl: process.env.GITHUB_API_URL || "https://api.github.com",
    repositoryOwner,
    repositoryName,
    pullRequestNumber,
    headers: {
      authorization: `token ${accessToken}`,
    },
    request: {
      fetch,
    }
  });

  core.debug(`response: ${JSON.stringify(repository, null, 2)}`);

  // Valid response
  if (repository.pullRequest) {
    return repository.pullRequest.commits.edges.map((edge: CommitEdges) => edge.node.commit.message);
  }

  return [];
}
