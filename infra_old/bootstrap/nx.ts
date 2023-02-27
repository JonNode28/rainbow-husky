import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

const nxRemoteCacheBucket = new aws.s3.Bucket("rainbow-husky-nx-remote-cache");
new aws.s3.BucketLifecycleConfigurationV2("rainbow-husky-nx-remote-cache-lifecycle", {
  bucket: nxRemoteCacheBucket.id,
  rules: [{
    id: "delete-old-files",
    status: "Enabled",
    expiration: {
      days: 365
    }
  }],
});

export const nxRemoteCacheName = nxRemoteCacheBucket.id;
