import * as aws from '@pulumi/aws';
import * as pulumi from "@pulumi/pulumi";
let config = new pulumi.Config();

export const githubToken = new aws.ssm.Parameter('githubToken', {
  type: 'SecureString',
  value: config.getSecret("github-token"),
});
