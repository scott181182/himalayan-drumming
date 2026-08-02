import path from "node:path";

import { S3Client } from "@aws-sdk/client-s3";
import type { AwsPublicUrlOptions } from "@flystorage/aws-s3";
import { AwsS3StorageAdapter, HostStyleAwsPublicUrlGenerator } from "@flystorage/aws-s3";
import type { StorageAdapter } from "@flystorage/file-storage";
import { FileStorage } from "@flystorage/file-storage";
import { LocalStorageAdapter } from "@flystorage/local-fs";

export const LOCAL_BLOB_ROOT =
  process.env.BLOB_ROOT ?? path.resolve(__dirname, "..", "..", "..", "blob");

export const FILES_DIR = "files";
export const AVATAR_DIR = "avatars";

class HetznerS3PublicUrlGenerator extends HostStyleAwsPublicUrlGenerator {
  public static encodePath(filepath: string) {
    return filepath.split("/").map(encodeURIComponent).join("/");
  }

  public publicUrl(filepath: string, options: AwsPublicUrlOptions): Promise<string> {
    const baseUrl = "https://{bucket}.{region}.your-objectstorage.com/{path}";
    return Promise.resolve(
      baseUrl
        .replace("{bucket}", options.bucket)
        .replace("{region}", options.region ?? "nbg1")
        .replace("{path}", HetznerS3PublicUrlGenerator.encodePath(filepath)),
    );
  }
}

function makeStorageAdapter(): StorageAdapter {
  const s3Bucket = process.env.S3_BUCKET;
  const localBlobRoot = process.env.BLOB_ROOT;

  if (s3Bucket) {
    console.log(`Using S3 storage adapter with bucket '${s3Bucket}'`);
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
    const credentials =
      accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined;
    if (!credentials) {
      console.warn(
        "S3_BUCKET is set but S3_ACCESS_KEY_ID or S3_SECRET_ACCESS_KEY is missing. Using default credentials.",
      );
    }
    const endpoint = process.env.S3_ENDPOINT;
    const region = process.env.S3_REGION;
    console.log(`Using S3 endpoint '${endpoint}' in region '${region}'`);
    const client = new S3Client({ credentials, endpoint, region });
    return new AwsS3StorageAdapter(
      client,
      {
        bucket: s3Bucket,
        publicUrlOptions: {
          baseUrl: endpoint,
        },
      },
      new HetznerS3PublicUrlGenerator(),
    );
  } else if (localBlobRoot) {
    console.warn(`Falling back to local storage at '${LOCAL_BLOB_ROOT}'`);
    return new LocalStorageAdapter(LOCAL_BLOB_ROOT, {
      publicUrlOptions: {
        baseUrl: "/api",
      },
    });
  }
  throw new Error(
    "Could not determine storage adapter. Please set either S3_BUCKET or BLOB_ROOT environment variable.",
  );
}
export const storage = new FileStorage(makeStorageAdapter());
