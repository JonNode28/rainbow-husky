import * as pulumi from "@pulumi/pulumi";
import * as codePipelineInfra from './pipeline/codePipeline'
import * as aws from "@pulumi/aws";

export const codePipeline = codePipelineInfra.codePipeline

export const mainBuildProject = codePipelineInfra.mainBuildProject

const config = new pulumi.Config();

export const githubSourceCredential = new aws.codebuild.SourceCredential('github-token', {
  authType: 'PERSONAL_ACCESS_TOKEN',
  serverType: 'GITHUB',
  token: config.requireSecret('github-token'),
});


export default {}
