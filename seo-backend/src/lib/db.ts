import mongoose from 'mongoose';
import { config } from '../config.js';
import { Page } from '../models/Page.js';
import { ImportJob } from '../models/ImportJob.js';

export async function connectDb(): Promise<void> {
  await mongoose.connect(config.mongoUri, {
    maxPoolSize: 50,
    serverSelectionTimeoutMS: 5000,
  });
  await Page.syncIndexes();
  await ImportJob.syncIndexes();
  console.log('mongo connected, indexes synced');
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
