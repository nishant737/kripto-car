import fetch from 'node-fetch';

const API_URL = 'http://localhost:5001';

// Test dealer credentials (the dealer who owns the service with bookings)
const testDealer = {
  email: 'f@gmail.com',
  password: 'password123' // You'll need to know this dealer's actual password
};

async function testBookingFlow() {
  try {
    console.log('📝 Testing Booking Flow\n');
    
    // Step 1: Login as dealer
    console.log('1. Logging in as dealer:', testDealer.email);
    const loginResponse = await fetch(`${API_URL}/api/dealer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testDealer)
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      console.error('❌ Login failed:', loginData.message);
      console.log('\n💡 Tip: Make sure the dealer account exists and the password is correct');
      return;
    }
    
    console.log('✅ Login successful!');
    console.log('  Dealer ID:', loginData.dealer.id);
    console.log('  Token:', loginData.token.substring(0, 20) + '...');
    
    const token = loginData.token;
    
    // Step 2: Fetch dealer's bookings
    console.log('\n2. Fetching dealer bookings...');
    const bookingsResponse = await fetch(`${API_URL}/api/bookings/dealer`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const bookingsData = await bookingsResponse.json();
    
    if (!bookingsResponse.ok) {
      console.error('❌ Failed to fetch bookings:', bookingsData.message);
      return;
    }
    
    console.log('✅ Bookings fetched successfully!');
    console.log(`  Total bookings: ${bookingsData.bookings.length}`);
    
    if (bookingsData.bookings.length > 0) {
      console.log('\n📋 Bookings:');
      bookingsData.bookings.forEach((booking, index) => {
        console.log(`\n  Booking #${index + 1}:`);
        console.log(`    Customer: ${booking.customerName}`);
        console.log(`    Phone: ${booking.customerPhone}`);
        console.log(`    Service: ${booking.serviceRequirement}`);
        console.log(`    Car: ${booking.carBrand} ${booking.carModel}`);
        console.log(`    Status: ${booking.status}`);
        console.log(`    Date: ${new Date(booking.createdAt).toLocaleString()}`);
      });
    } else {
      console.log('\n⚠️  No bookings found for this dealer');
      console.log('  This could mean:');
      console.log('  - No customers have booked services from this dealer yet');
      console.log('  - The bookings belong to a different dealer');
    }
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testBookingFlow();
