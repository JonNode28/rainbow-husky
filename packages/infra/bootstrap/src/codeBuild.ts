import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as ssm from './ssm'
import * as ecr from './ecr'

let config = new pulumi.Config();

export const codeBuildGithubCredentials = new aws.codebuild.SourceCredential('code-build-github-credentials', {
  authType: 'PERSONAL_ACCESS_TOKEN',
  serverType: 'GITHUB',
  token: ssm.githubToken.value,
});


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

export const createEnvironmentBuildProject = new aws.codebuild.Project('rainbow-husky-create-environment', {
  serviceRole: buildRole.arn,
  source: {
    type: 'GITHUB',
    location: 'https://github.com/JonNode28/rainbow-husky.git',
    buildspec: 'packages/infra/environment/buildspec.upEnv.yaml',
  },
  environment: {
    type: 'LINUX_CONTAINER',
    computeType: 'BUILD_GENERAL1_SMALL',
    image: '519396255280.dkr.ecr.eu-west-1.amazonaws.com/rainbow-husky-ecr-863f7ee:latest',
    environmentVariables: [
      { name: 'PULUMI_STATE_S3_BUCKET', type: 'PLAINTEXT', value: config.getSecret('pulumi-state-s3-bucket') || '' }
    ]
  },
  artifacts: { type: 'NO_ARTIFACTS' },
});

export const createEnvironmentWebhook = new aws.codebuild.Webhook('rainbow-husky-create-environment', {
  projectName: createEnvironmentBuildProject.name,
  buildType: 'BUILD',
  filterGroups: [{
    filters: [
      {
        type: 'EVENT',
        pattern: 'PULL_REQUEST_CREATED, PULL_REQUEST_UPDATED, PULL_REQUEST_REOPENED',
      },
    ],
  }],
});

const buildPolicy = new aws.iam.Policy('rainbow-husky-code-build-policy', {
  path: '/',
  description: 'The policy document for the build role',
  policy: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: [
          'codebuild:StartBuild',
          'codebuild:BatchGetBuilds',
          'codepipeline:RetryStageExecution',
          's3:GetBucketAcl',
          's3:ListBuckets',
          's3:GetObject',
          's3:PutObject',
          's3:DeleteObject',
          's3:DeleteObjectVersion',
          's3:ListBucket',
          'kms:GenerateDataKey',
          'kms:Decrypt',
          'codestar:UseConnection'
        ],
        Effect: 'Allow',
        Resource: '*',
      },
      {
        Action: [
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
        ],
        Effect: 'Allow',
        Resource: pulumi.interpolate`arn:aws:logs:eu-west-1:519396255280:log-group:/aws/codebuild/${createEnvironmentBuildProject.name}*`,
      },
      {
        Action:[
          'ecr:BatchCheckLayerAvailability',
          'ecr:BatchGetImage',
          'ecr:GetDownloadUrlForLayer'
        ],
        Effect:'Allow',
        Resource:[
          ecr.dockerRepo.arn
        ]
      }
    ],
  },
});

new aws.iam.RolePolicyAttachment('rainbow-husky-code-build-policy', {
  role: buildRole,
  policyArn: buildPolicy.arn,
});

