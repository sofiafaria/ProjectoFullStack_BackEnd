import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const db = mongoose.connection;


if (!process.env.MONGO_URI) {
    process.exit(1);
  }

mongoose.connect(process.env.MONGO_URI, {
   // useNewUrlParser: true,
   // useUnifiedTopology: true
});

export default db;