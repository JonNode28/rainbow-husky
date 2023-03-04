import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export const dockerRepo = new aws.ecr.Repository("rainbow-husky-ecr", {
  imageScanningConfiguration: {
    scanOnPush: true,
  },
  imageTagMutability: "MUTABLE",

});

export const dockerRepoPolicy = new aws.ecr.RepositoryPolicy("rainbow-husky-ecr-policy", {
  repository: dockerRepo.name,
  policy: {
    Version: "2008-10-17",
    Statement: [
        {
            Sid: "new policy",
            Effect: "Allow",
            Principal: "*",
            Action: [
              "ecr:BatchCheckLayerAvailability",
              "ecr:BatchGetImage",
              "ecr:GetDownloadUrlForLayer"
            ]
        }
    ]
},
});
