import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const buildRole = new aws.iam.Role('rainbow-husky-code-build-role', {
  assumeRolePolicy: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          Service: 'codebuild.amazonaws.com',
        },
        Action: 'sts:AssumeRole',
      },
    ],
  },
});

export const buildProject = new aws.codebuild.Project('rainbow-husky-code-build', {
  serviceRole: buildRole.arn,
  source: {
    type: 'GITHUB',
    location: 'https://github.com/JonNode28/rainbow-husky.git',
    buildspec: 'infra/environment/buildspec.yaml',
  },
  environment: {
    type: 'LINUX_CONTAINER',
    computeType: 'BUILD_GENERAL1_SMALL',
    image: 'aws/codebuild/standard:6.0',
  },
  artifacts: { type: 'NO_ARTIFACTS' },
});

const buildPolicy = new aws.iam.Policy("rainbow-husky-code-build-policy", {
  path: "/",
  description: "The policy document for the build role",
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: [
          "codebuild:StartBuild",
          "codebuild:BatchGetBuilds",
          "codepipeline:RetryStageExecution",
          "s3:GetBucketAcl",
          "s3:ListBuckets",
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket",
          "kms:GenerateDataKey",
          "kms:Decrypt",
          "codestar:UseConnection"
        ],
        Effect: "Allow",
        Resource: "*",
      },
      {
        Action: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        Effect: "Allow",
        Resource: pulumi.interpolate`arn:aws:logs:eu-west-1:519396255280:log-group:/aws/codebuild/${buildProject.name}*`,
      }
    ],
  }),
});

new aws.iam.RolePolicyAttachment('rainbow-husky-code-build-policy', {
  role: buildRole,
  policyArn: buildPolicy.arn,
});

