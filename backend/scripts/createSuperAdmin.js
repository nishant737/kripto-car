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

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const createSuperAdmin = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Configuration - Read from environment variables
    const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || 'admin@kriptocar.com';
    const SUPER_ADMIN_PHONE = process.env.SUPER_ADMIN_PHONE || '9999999999';
    const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'admin123';

    // Validate environment variables
    if (!process.env.SUPER_ADMIN_EMAIL || !process.env.SUPER_ADMIN_PASSWORD) {
      console.log('⚠️  WARNING: Using default credentials. Please set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in .env file\n');
    }

    // Check if super admin already exists
    console.log('🔍 Checking if Super Admin already exists...');
    const existingAdmin = await Dealer.findOne({ 
      email: SUPER_ADMIN_EMAIL 
    });

    if (existingAdmin) {
      console.log('⚠️  Super Admin already exists!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Role:', existingAdmin.role);
      console.log('\n💡 If you need to update the password, use the Super Admin dashboard or update the database directly.\n');
      process.exit(0);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, salt);

    // Create super admin
    console.log('📝 Creating Super Admin account...');
    const superAdmin = await Dealer.create({
      email: SUPER_ADMIN_EMAIL,
      phone: SUPER_ADMIN_PHONE,
      password: hashedPassword,
      role: 'superadmin'
    });

    console.log('\n✨ Super Admin created successfully! ✨\n');
    console.log('═'.repeat(50));
    console.log('📧 Email:', superAdmin.email);
    console.log('📱 Phone:', superAdmin.phone);
    console.log('🔑 Password:', SUPER_ADMIN_PASSWORD);
    console.log('👤 Role:', superAdmin.role);
    console.log('📅 Created:', superAdmin.createdAt);
    console.log('═'.repeat(50));
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!\n');
    console.log('🌐 Login at: http://localhost:5173 (or your frontend URL)');
    console.log('🚀 Access Super Admin Dashboard at: /superadmin/dashboard\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating super admin:', error.message);
    console.error('\n💡 Troubleshooting tips:');
    console.error('   1. Make sure MongoDB is running');
    console.error('   2. Check MONGO_URI in your .env file');
    console.error('   3. Verify network connection\n');
    process.exit(1);
  }
};

console.log('\n🚀 Kripto Car - Super Admin Account Setup\n');
createSuperAdmin();
