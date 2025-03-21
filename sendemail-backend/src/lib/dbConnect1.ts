import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGOODB_UR as string;

const dbConnect1 = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI, {  });
};

export default dbConnect1;
