import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Dealer from '../models/Dealer.js';
import Booking from '../models/Booking.js';
import DealerService from '../models/DealerService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const diagnoseIssue = async () => {
  try {
    console.log('🔍 Diagnosing Booking Issue\n');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected!\n');

    // Get all dealers
    const dealers = await Dealer.find({ role: 'dealer' }).select('-password');
    console.log('👥 Dealers in database:');
    dealers.forEach((dealer, i) => {
      console.log(`  ${i + 1}. ID: ${dealer._id}`);
      console.log(`     Email: ${dealer.email}`);
      console.log(`     Phone: ${dealer.phone}\n`);
    });

    // Get all services
    const services = await DealerService.find();
    console.log('🛠️  Services in database:');
    services.forEach((service, i) => {
      console.log(`  ${i + 1}. Business: ${service.businessName}`);
      console.log(`     Category: ${service.serviceCategory}`);
      console.log(`     Dealer ID: ${service.dealerId}\n`);
    });

    // Get all bookings
    const bookings = await Booking.find()
      .populate('dealerId', 'email phone')
      .populate('dealerServiceId', 'businessName serviceCategory');
    
    console.log('📅 Bookings in database:');
    if (bookings.length === 0) {
      console.log('  ⚠️  No bookings found!\n');
    } else {
      bookings.forEach((booking, i) => {
        console.log(`  ${i + 1}. Customer: ${booking.customerName}`);
        console.log(`     Phone: ${booking.customerPhone}`);
        console.log(`     Service: ${booking.serviceRequirement}`);
        console.log(`     Dealer ID: ${booking.dealerId._id}`);
        console.log(`     Dealer Email: ${booking.dealerId.email}`);
        console.log(`     Business: ${booking.dealerServiceId?.businessName || 'N/A'}`);
        console.log(`     Status: ${booking.status}`);
        console.log(`     Created: ${booking.createdAt}\n`);
      });
    }

    // Check if bookings match services
    console.log('🔗 Verification:');
    for (const booking of bookings) {
      const matchingService = services.find(s => 
        s._id.toString() === booking.dealerServiceId._id.toString()
      );
      
      if (matchingService) {
        const serviceDealerId = matchingService.dealerId.toString();
        const bookingDealerId = booking.dealerId._id.toString();
        
        if (serviceDealerId === bookingDealerId) {
          console.log(`✅ Booking for "${booking.customerName}" correctly linked to dealer ${booking.dealerId.email}`);
        } else {
          console.log(`❌ Mismatch! Booking dealer ID (${bookingDealerId}) != Service dealer ID (${serviceDealerId})`);
        }
      }
    }

    console.log('\n📊 Summary:');
    console.log(`  Total Dealers: ${dealers.length}`);
    console.log(`  Total Services: ${services.length}`);
    console.log(`  Total Bookings: ${bookings.length}`);
    
    if (bookings.length > 0 && dealers.length > 0) {
      console.log('\n💡 To see bookings in the frontend:');
      console.log(`  1. Log in as: ${bookings[0].dealerId.email}`);
      console.log(`  2. Go to "Dealer Dashboard" → "View Bookings"`);
      console.log(`  3. You should see ${bookings.filter(b => b.dealerId._id.toString() === bookings[0].dealerId._id.toString()).length} booking(s)`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

diagnoseIssue();
