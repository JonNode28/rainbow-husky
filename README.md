# Project: Rainbow Husky

Creating tools needed for a peaceful transition to participatory direct democracy in all aspects of life.

## Cold start of a production instance
1. Open a terminal
2. Install Pulumi with `brew install pulumi`
   1. Optionally set up a [remote backend](https://www.pulumi.com/docs/intro/concepts/state/)
      1. S3
         1. Create S3 bucket to store Pulumi state
         2. Login with `pulumi login s3://<pulumi-bucket>`
3. Login to AWS CLI
4. Navigate to `/infra/bootstrap`
5. Create the [core infrastructure stack](https://www.pulumi.com/docs/intro/concepts/stack) by typing `pulumi stack init boot` in the terminal
6. Add the GitHub token to the Pulumi config:
   1. `pulumi config set github:token XXXXXXXXX --secret` - sets the token for the GitHub provider to use
   2. `pulumi config set github-token XXXXXXXXX --secret` - gets stored in an SSM parameter and later used by CodeBuild to interact with GitHub
7. Add the Pulumi state S3 bucket to the Pulumi config
   1. `pulumi config set pulumi-state-s3-bucket <pulumi-bucket>` - this will be used by CodeBuild when rolling infrastructure changes out
8. [Register your GitHub access token (classic)](https://www.pulumi.com/registry/packages/github/installation-configuration/) with Pulumi by typing `pulumi config set github:token XXXXXXXXXXXXXX --secret`
   1. > Make sure your GitHub access token has the necessary permissions to create, manage and destroy repositories
9. Create the bootstrap infrastructure by typing `pulumi up` and then confirming "yes"
