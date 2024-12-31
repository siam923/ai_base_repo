// utils/s3.js
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export const uploadFile = async (fileBuffer, fileName, folderPath) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${folderPath}/${fileName}`,
    Body: fileBuffer,
    ContentType: fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg', // Adjust as needed
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    return fileUrl;
  } catch (error) {
    console.log('Error uploading file to S3:', error);
    throw new Error('Error uploading file to S3');
  }
};


export const deleteFile = async (fileUrl) => {
  try {
    // Extract the key from the file URL
    const urlParts = fileUrl.split('.amazonaws.com/');
    if (urlParts.length !== 2) {
      throw new Error('Invalid S3 file URL');
    }
    
    const key = urlParts[1];
    
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    
    return true;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw new Error('Error deleting file from S3');
  }
};
