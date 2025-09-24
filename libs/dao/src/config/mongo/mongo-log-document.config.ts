import { registerAs } from '@nestjs/config';

export default registerAs('mongo-log-document', () => ({
  uri: process.env.MONGO_LOG_DOCUMENT_URI,
  user: process.env.MONGO_LOG_DOCUMENT_USER,
  pass: process.env.MONGO_LOG_DOCUMENT_PASS,
  surviveName: process.env.MONGO_LOG_DOCUMENT_SURVIVE_NAME,
  surviveDatabase: process.env.MONGO_LOG_DOCUMENT_SURVIVE_DATABASE,
}));
