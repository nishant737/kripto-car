#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Kripto Car Backend API Test Script"
echo "======================================"
echo ""

# Check if server is running
echo "📡 1. Checking if server is running..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/api/health)

if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✅ Server is running!${NC}"
else
    echo -e "${RED}❌ Server is not running. Please start it with: npm run server${NC}"
    exit 1
fi

echo ""
echo "📝 2. Testing Dealer Registration..."
register_response=$(curl -s -X POST http://localhost:5001/api/dealer/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testdealer'$(date +%s)'@test.com",
    "phone": "1234567890",
    "password": "password123"
  }')

echo "$register_response" | jq .

if echo "$register_response" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Registration successful!${NC}"
    TOKEN=$(echo "$register_response" | jq -r '.token')
    EMAIL=$(echo "$register_response" | jq -r '.dealer.email')
else
    echo -e "${RED}❌ Registration failed${NC}"
    exit 1
fi

echo ""
echo "🔐 3. Testing Dealer Login..."
login_response=$(curl -s -X POST http://localhost:5001/api/dealer/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"password123\"
  }")

echo "$login_response" | jq .

if echo "$login_response" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Login successful!${NC}"
else
    echo -e "${RED}❌ Login failed${NC}"
    exit 1
fi

echo ""
echo "👤 4. Testing Get Profile (Protected Route)..."
profile_response=$(curl -s -X GET http://localhost:5001/api/dealer/profile \
  -H "Authorization: Bearer $TOKEN")

echo "$profile_response" | jq .

if echo "$profile_response" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Profile fetch successful!${NC}"
else
    echo -e "${RED}❌ Profile fetch failed${NC}"
    exit 1
fi

echo ""
echo "🎉 ${GREEN}All tests passed! Backend is working correctly!${NC}"
echo ""
echo "📊 Summary:"
echo "  - Health check: ✅"
echo "  - Registration: ✅"
echo "  - Login: ✅"
echo "  - Protected route: ✅"
echo ""
echo "🔑 Your test JWT token:"
echo "$TOKEN"
