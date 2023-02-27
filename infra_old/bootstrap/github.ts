import * as github from "@pulumi/github";

export const repo = new github.Repository("rainbow-husky", {
  name: 'rainbow-husky',
  description: "The Rainbow Husky repo",
  visibility: "public",
  hasIssues: true,
  allowAutoMerge: true,
  allowMergeCommit: false,
  allowRebaseMerge: false,
  allowSquashMerge: true,
});
