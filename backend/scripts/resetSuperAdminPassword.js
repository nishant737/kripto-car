import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Dealer from '../models/Dealer.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const resetSuperAdminPassword = async () => {
  try {
    console.log('\n🔐 Super Admin Password Reset Tool\n');
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'kriptocar555@gmail.com';
    const NEW_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'Admin@123!Secure';

    // Find super admin
    console.log('🔍 Looking for Super Admin account...');
    const superAdmin = await Dealer.findOne({ 
      email: SUPER_ADMIN_EMAIL.toLowerCase() 
    });

    if (!superAdmin) {
      console.log('❌ Super Admin account not found!');
      console.log(`   Email searched: ${SUPER_ADMIN_EMAIL.toLowerCase()}`);
      console.log('\n💡 Run createSuperAdmin.js first to create the account.\n');
      process.exit(1);
    }

    console.log('✅ Found Super Admin account');
    console.log(`   📧 Email: ${superAdmin.email}`);
    console.log(`   👤 Role: ${superAdmin.role}`);

    // Hash new password
    console.log('\n🔐 Hashing new password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, salt);

    // Update password
    superAdmin.password = hashedPassword;
    await superAdmin.save();

    console.log('✅ Password updated successfully!\n');
    console.log('═'.repeat(60));
    console.log('🎉 Super Admin Password Reset Complete!');
    console.log('═'.repeat(60));
    console.log('\n📝 New Login Credentials:');
    console.log(`   📧 Email:    ${superAdmin.email}`);
    console.log(`   🔑 Password: ${NEW_PASSWORD}`);
    console.log(`   👤 Role:     ${superAdmin.role}`);
    console.log('═'.repeat(60));
    console.log('\n🌐 You can now login at: http://localhost:5173');
    console.log('🚀 Super Admin Dashboard: /superadmin/dashboard\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error resetting password:', error.message);
    console.error('\n💡 Troubleshooting tips:');
    console.error('   1. Make sure MongoDB is running');
    console.error('   2. Check MONGO_URI in your .env file');
    console.error('   3. Verify SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env\n');
    process.exit(1);
  }
};

resetSuperAdminPassword();
