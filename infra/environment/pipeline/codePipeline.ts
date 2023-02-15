import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { buildProject } from './codeBuild'

const githubConnection = new aws.codestarconnections.Connection("github-connection", {providerType: "GitHub"});
const codepipelineBucket = new aws.s3.BucketV2("rainbow-husky-code-pipeline", {});
const codepipelineRole = new aws.iam.Role("rainbow-husky-code-pipeline-role", {
  assumeRolePolicy: {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: {
          Service: "codepipeline.amazonaws.com"
        },
        Action: "sts:AssumeRole"
      }
    ]
  }
});
const codePipelineKeys = new aws.kms.Key("rainbow-husky-code-pipeline-key", {
  description: "Rainbow Huskey Code Pipeline S3 Key",
});

const codePipelineKeyAlias = new aws.kms.Alias("alias/rainbow-husky-code-pipeline-key", {targetKeyId: codePipelineKeys.keyId});

export const codePipeline = new aws.codepipeline.Pipeline("rainbow-husky-code-pipeline", {
  roleArn: codepipelineRole.arn,
  artifactStores: [{
    location: codepipelineBucket.bucket,
    type: "S3"
  }],
  stages: [
    {
      name: "Source",
      actions: [{
        name: "Source",
        category: "Source",
        owner: "AWS",
        provider: "CodeStarSourceConnection",
        version: "1",
        outputArtifacts: ["source_output"],
        configuration: {
          ConnectionArn: githubConnection.arn,
          FullRepositoryId: "JonNode28/rainbow-husky",
          BranchName: "main",
        },
      }],
    },
    {
      name: "Build",
      actions: [{
        name: "Build",
        category: "Build",
        owner: "AWS",
        provider: "CodeBuild",
        inputArtifacts: ["source_output"],
        outputArtifacts: ["build_output"],
        version: "1",
        configuration: {
          ProjectName: buildProject.name,
        },
      }],
    },
    // {
    //   name: "Deploy",
    //   actions: [{
    //     name: "Deploy",
    //     category: "Deploy",
    //     owner: "AWS",
    //     provider: "CloudFormation",
    //     inputArtifacts: ["build_output"],
    //     version: "1",
    //     configuration: {
    //       ActionMode: "REPLACE_ON_FAILURE",
    //       Capabilities: "CAPABILITY_AUTO_EXPAND,CAPABILITY_IAM",
    //       OutputFileName: "CreateStackOutput.json",
    //       StackName: "MyStack",
    //       TemplatePath: "build_output::sam-templated.yaml",
    //     },
    //   }],
    // },
  ],
});
const codepipelineBucketAcl = new aws.s3.BucketAclV2("codepipelineBucketAcl", {
  bucket: codepipelineBucket.id,
  acl: "private",
});
const codepipelinePolicy = new aws.iam.RolePolicy("codepipelinePolicy", {
  role: codepipelineRole.id,
  policy: pulumi.interpolate`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect":"Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:GetBucketVersioning",
        "s3:PutObjectAcl",
        "s3:PutObject"
      ],
      "Resource": [
        "${codepipelineBucket.arn}",
        "${codepipelineBucket.arn}/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "codestar-connections:UseConnection"
      ],
      "Resource": "${githubConnection.arn}"
    },
    {
      "Effect": "Allow",
      "Action": [
        "codebuild:BatchGetBuilds",
        "codebuild:StartBuild"
      ],
      "Resource": "*"
    }
  ]
}
`,
});

export const mainBuildProject = buildProject
