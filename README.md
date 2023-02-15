# Project: Rainbow Husky

Our goal is to create the tools needed for a peaceful transition to participatory direct democracy.

## Cold start

1. Install Pulumi globally
2. Add the GitHub token to the pulumi config:
   1. `pulumi config set github:token XXXXXXXXX --secret` - sets the token for the pulumi cli to use
   2. `pulumi config set github-token XXXXXXXXX --secret` - sets the default token that will be stored in a SSM parameter and later used by CodeBuild to interact with GitHub
3. Login to AWS CLI
4. Create an S3 bucket to store Pulumi state in the [AWS console](https://aws.amazon.com).
5. Open a terminal at './infra/bootstrap' and type `pulumi login s3://<name of bucket created above>` - [see docs on self-managed remote state](https://www.pulumi.com/docs/intro/concepts/state/)
6. Create the [core infrastructure stack](https://www.pulumi.com/docs/intro/concepts/stack) by typing `pulumi stack init core` in the terminal 
7. [Register your GitHub access token (classic)](https://www.pulumi.com/registry/packages/github/installation-configuration/) with Pulumi by typing `pulumi config set github:token XXXXXXXXXXXXXX --secret`
   1. > Make sure your GitHub access token has the necessary permissions to create, manage and destroy repositories
8. Create the bootstrap infrastructure by typing `pulumi up` and then confirming "yes"
