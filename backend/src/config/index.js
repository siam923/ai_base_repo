// src/config/index.js
import dotenv from 'dotenv';
dotenv.config();

export default {
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    url: process.env.APP_URL || 'http://localhost:3000'
  },
  storage: {
    type: process.env.STORAGE_TYPE || 'local', // 'local' or 's3'
    local: {
      uploadDir: process.env.UPLOAD_DIR || 'uploads'
    },
    s3: {
      bucket: process.env.AWS_BUCKET_NAME,
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  },
  email: {
    from: process.env.EMAIL_FROM,
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    }
  }
};
