import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

export const dockerRepo = new aws.ecr.Repository("rainbow-husky-ecr", {
  imageScanningConfiguration: {
    scanOnPush: true,
  },
  imageTagMutability: "MUTABLE",
});
