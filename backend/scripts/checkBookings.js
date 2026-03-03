import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const checkData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!\n');

    // Get sample dealer service
    const dealerService = await mongoose.connection.db.collection('dealerservices').findOne({});
    console.log('Sample DealerService:');
    console.log(JSON.stringify(dealerService, null, 2));
    console.log('\n---\n');

    // Get all bookings
    const bookings = await mongoose.connection.db.collection('bookings').find({}).toArray();
    console.log(`Total Bookings: ${bookings.length}`);
    if (bookings.length > 0) {
      console.log('\nSample Booking:');
      console.log(JSON.stringify(bookings[0], null, 2));
    }
    console.log('\n---\n');

    // Get all dealers
    const dealers = await mongoose.connection.db.collection('dealers').find({}).toArray();
    console.log('Dealers:');
    dealers.forEach(dealer => {
      console.log(`- ID: ${dealer._id}, Email: ${dealer.email}, Role: ${dealer.role}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkData();
