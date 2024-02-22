import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import {
  AWS_ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
} from "../config";
require("dotenv").config();

export const s3client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID as string,
    secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
  },
});

export const generateUploadURL = async (file: any) => {
  const date = new Date();
  const imageName = `${uuidv4()}-${date.getTime()}.png`;
  const param = {
    Bucket: AWS_BUCKET_NAME,
    Key: imageName,
    Body: file.buffer,
  };
  await s3client.send(new PutObjectCommand(param));

  return `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${param.Key}`;
};
