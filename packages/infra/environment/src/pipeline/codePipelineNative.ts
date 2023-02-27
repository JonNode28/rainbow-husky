// import * as pulumi from "@pulumi/pulumi";
// import * as nativeAws from "@pulumi/aws-native";
// import { buildProject } from './codeBuild'
//
// const githubConnection = new nativeAws.codestarconnections.Connection("github-connection", {
//   providerType: "GitHub"
// });
// const codepipelineBucket = new nativeAws.s3.Bucket("rainbow-husky-code-pipeline", {});
// const codepipelineRole = new nativeAws.iam.Role("rainbow-husky-code-pipeline-role", {
//   assumeRolePolicyDocument: {
//     Version: "2012-10-17",
//     Statement: [
//       {
//         Effect: "Allow",
//         Principal: {
//           Service: "codepipeline.amazonaws.com"
//         },
//         Action: "sts:AssumeRole"
//       }
//     ]
//   }
// });
// const codePipelineKeys = new nativeAws.kms.Key("rainbow-husky-code-pipeline-key", {
//   description: "Rainbow Huskey Code Pipeline S3 Key",
//   keyPolicy: ''
// });
//
// const codePipelineKeyAlias = new nativeAws.kms.Alias("alias/rainbow-husky-code-pipeline-key", {targetKeyId: codePipelineKeys.keyId});
//
// export const codePipeline = new nativeAws.codepipeline.Pipeline("rainbow-husky-code-pipeline", {
//   roleArn: codepipelineRole.arn,
//   artifactStores: [{
//     region: 'eu-west-1',
//     artifactStore: {
//       type: "S3",
//       location: codepipelineBucket.id,
//     },
//   }],
//   stages: [
//     {
//       name: "Source",
//       actions: [{
//         name: "Source",
//         actionTypeId: {
//           category: "Source",
//           owner: 'AWS',
//           provider: 'CodeStarSourceConnection',
//           version: '1'
//         },
//         outputArtifacts: [{ name: "source_output" }],
//         configuration: {
//           ConnectionArn: githubConnection.connectionArn,
//           FullRepositoryId: "JonNode28/rainbow-husky",
//           BranchName: "main",
//         },
//       }],
//     },
//     {
//       name: "Build",
//       actions: [{
//         name: "Build",
//         actionTypeId: {
//           category: "Build",
//           owner: 'AWS',
//           provider: 'CodeBuild',
//           version: '1'
//         },
//         inputArtifacts: [{ name: "source_output" }],
//         outputArtifacts: [{ name: "build_output" }],
//         configuration: {
//           ProjectName: buildProject.name,
//         },
//       }],
//     },
//     // {
//     //   name: "Deploy",
//     //   actions: [{
//     //     name: "Deploy",
//     //     actionTypeId: {
//     //       category: "Deploy",
//     //       owner: 'AWS',
//     //       provider: 'CloudFormation',
//     //       version: '1'
//     //     },
//     //     inputArtifacts: [{ name: "build_output" }],
//     //     configuration: {
//     //       ActionMode: "REPLACE_ON_FAILURE",
//     //       Capabilities: "CAPABILITY_AUTO_EXPAND,CAPABILITY_IAM",
//     //       OutputFileName: "CreateStackOutput.json",
//     //       StackName: "MyStack",
//     //       TemplatePath: "build_output::sam-templated.yaml",
//     //     },
//     //   }],
//     // },
//   ],
// });
// const codepipelinePolicy = new nativeAws.iam.Policy("codepipelinePolicy", {
//   roles: [ codepipelineRole.id ],
//   policyDocument: pulumi.interpolate`{
//   "Version": "2012-10-17",
//   "Statement": [
//     {
//       "Effect":"Allow",
//       "Action": [
//         "s3:GetObject",
//         "s3:GetObjectVersion",
//         "s3:GetBucketVersioning",
//         "s3:PutObjectAcl",
//         "s3:PutObject"
//       ],
//       "Resource": [
//         "${codepipelineBucket.arn}",
//         "${codepipelineBucket.arn}/*"
//       ]
//     },
//     {
//       "Effect": "Allow",
//       "Action": [
//         "codestar-connections:UseConnection"
//       ],
//       "Resource": "${githubConnection.connectionArn}"
//     },
//     {
//       "Effect": "Allow",
//       "Action": [
//         "codebuild:BatchGetBuilds",
//         "codebuild:StartBuild"
//       ],
//       "Resource": "*"
//     }
//   ]
// }
// `,
// });
//
// export const mainBuildProject = buildProject
