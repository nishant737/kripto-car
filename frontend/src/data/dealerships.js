// Dummy dealership data matching future backend schema
// Expanded with cities across India and timing information

export const dealerships = [
  // Bangalore Dealerships
  {
    id: 1,
    name: "Premium Auto Care",
    city: "Bangalore",
    state: "Karnataka",
    area: "Whitefield",
    address: "123 ITPL Main Road, Whitefield, Bangalore - 560066",
    phone: "+91 98765 43210",
    email: "contact@premiumautocare.com",
    rating: 4.8,
    reviewCount: 245,
    services: [
      "New Cars",
      "Used Cars",
      "General Service & Maintenance",
      "Denting & Painting",
      "Car Wash & Cleaning"
    ],
    specializations: ["Accident Repair", "Full Body Painting", "Periodic Service"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Baleno", "Brezza", "Ertiga", "WagonR"],
      "Hyundai": ["i20", "Creta", "Venue", "Verna"],
      "Tata": ["Nexon", "Harrier", "Punch", "Altroz"],
      "Honda": ["City", "Amaze", "Elevate"]
    },
    availableTimings: ["Morning", "Afternoon", "Evening"],
    workingHours: "Mon-Sat: 9:00 AM - 7:00 PM, Sun: 10:00 AM - 5:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80"
  },
  {
    id: 2,
    name: "Speed Zone Service Center",
    city: "Bangalore",
    state: "Karnataka",
    area: "Koramangala",
    address: "456 5th Block, Koramangala, Bangalore - 560095",
    phone: "+91 98765 43211",
    email: "info@speedzoneservice.com",
    rating: 4.6,
    reviewCount: 189,
    services: [
      "Tyres & Wheels",
      "Wheel Alignment & Suspension",
      "General Service & Maintenance",
      "Accessories & Customization"
    ],
    specializations: ["Tyre Replacement", "Wheel Balancing", "Suspension Check"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Brezza", "WagonR", "Alto", "Dzire"],
      "Hyundai": ["i20", "Venue", "Grand i10 NIOS", "Aura"],
      "Tata": ["Nexon", "Punch", "Tiago", "Tigor"],
      "Kia": ["Seltos", "Sonet"]
    },
    availableTimings: ["Morning", "Afternoon"],
    workingHours: "Mon-Sat: 8:30 AM - 8:00 PM, Sun: Closed",
    verified: true,
    image: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&q=80"
  },
  {
    id: 3,
    name: "Elite Detailing Studio",
    city: "Bangalore",
    state: "Karnataka",
    area: "Indiranagar",
    address: "789 100 Feet Road, Indiranagar, Bangalore - 560038",
    phone: "+91 98765 43212",
    email: "hello@elitedetailing.com",
    rating: 4.9,
    reviewCount: 312,
    services: [
      "Car Detailing Services",
      "Car Wash & Cleaning",
      "Denting & Painting"
    ],
    specializations: ["Ceramic Coating", "PPF", "Interior Deep Cleaning"],
    supportedCars: {
      "Maruti Suzuki": ["All Models"],
      "Hyundai": ["All Models"],
      "Tata": ["All Models"],
      "Honda": ["All Models"],
      "Mahindra": ["All Models"],
      "Toyota": ["All Models"]
    },
    availableTimings: ["Morning", "Afternoon", "Evening"],
    workingHours: "Mon-Sun: 9:00 AM - 9:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&q=80"
  },

  // Mumbai Dealerships
  {
    id: 4,
    name: "Mumbai Motors Hub",
    city: "Mumbai",
    state: "Maharashtra",
    area: "Andheri",
    address: "321 Link Road, Andheri West, Mumbai - 400053",
    phone: "+91 98765 43213",
    email: "support@mumbaimotorshub.com",
    rating: 4.7,
    reviewCount: 267,
    services: [
      "New Cars",
      "Used Cars",
      "General Service & Maintenance",
      "Emission Test & Legal Services"
    ],
    specializations: ["Certified Pre-Owned Cars", "RC Transfer", "PUC Certificate"],
    availableTimings: ["Morning", "Afternoon", "Evening"],
    workingHours: "Mon-Sat: 9:00 AM - 7:30 PM, Sun: 10:00 AM - 4:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80"
  },
  {
    id: 5,
    name: "Bandra Auto Solutions",
    city: "Mumbai",
    state: "Maharashtra",
    area: "Bandra",
    address: "654 Hill Road, Bandra West, Mumbai - 400050",
    phone: "+91 98765 43214",
    email: "care@bandraauto.com",
    rating: 4.5,
    reviewCount: 198,
    services: [
      "Denting & Painting",
      "Car Detailing Services",
      "Car Wash & Cleaning"
    ],
    specializations: ["Accident Repair", "Color Matching", "Scratch Removal"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Baleno", "WagonR"],
      "Hyundai": ["i20", "Creta", "Venue"],
      "Tata": ["Nexon", "Punch", "Altroz"],
      "Honda": ["City", "Amaze"]
    },
    availableTimings: ["Afternoon", "Evening"],
    workingHours: "Mon-Sat: 10:00 AM - 8:00 PM, Sun: 10:00 AM - 5:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80"
  },

  // Delhi Dealerships
  {
    id: 6,
    name: "Delhi Premium Auto",
    city: "Delhi",
    state: "Delhi",
    area: "Connaught Place",
    address: "987 Inner Circle, Connaught Place, New Delhi - 110001",
    phone: "+91 98765 43215",
    email: "info@delhipremiumauto.com",
    rating: 4.8,
    reviewCount: 421,
    services: [
      "New Cars",
      "Used Cars",
      "Tyres & Wheels",
      "Accessories & Customization"
    ],
    specializations: ["Browse Latest Models", "Alloy Wheels", "Audio System Upgrade"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Baleno", "WagonR"],
      "Hyundai": ["i20", "Creta", "Venue"],
      "Tata": ["Nexon", "Punch", "Altroz"],
      "Honda": ["City", "Amaze"]
    },
    availableTimings: ["Morning", "Afternoon", "Evening"],
    workingHours: "Mon-Sat: 9:00 AM - 7:00 PM, Sun: Closed",
    verified: true,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80"
  },
  {
    id: 7,
    name: "Saket Service Center",
    city: "Delhi",
    state: "Delhi",
    area: "Saket",
    address: "147 District Centre, Saket, New Delhi - 110017",
    phone: "+91 98765 43216",
    email: "contact@saketservice.com",
    rating: 4.6,
    reviewCount: 156,
    services: [
      "General Service & Maintenance",
      "Wheel Alignment & Suspension",
      "Emission Test & Legal Services"
    ],
    specializations: ["Periodic Service", "Computerized Wheel Alignment", "PUC Certificate"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Baleno", "WagonR"],
      "Hyundai": ["i20", "Creta", "Venue"],
      "Tata": ["Nexon", "Punch", "Altroz"],
      "Honda": ["City", "Amaze"]
    },
    availableTimings: ["Morning", "Afternoon"],
    workingHours: "Mon-Sun: 8:00 AM - 8:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&q=80"
  },

  // Pune Dealerships
  {
    id: 8,
    name: "Pune Wheels & Tyres",
    city: "Pune",
    state: "Maharashtra",
    area: "Koregaon Park",
    address: "258 North Main Road, Koregaon Park, Pune - 411001",
    phone: "+91 98765 43217",
    email: "hello@punewheels.com",
    rating: 4.7,
    reviewCount: 203,
    services: [
      "Tyres & Wheels",
      "Wheel Alignment & Suspension",
      "Accessories & Customization"
    ],
    specializations: ["Tyre Replacement", "Wheel Balancing", "Alloy Wheels"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Baleno", "WagonR"],
      "Hyundai": ["i20", "Creta", "Venue"],
      "Tata": ["Nexon", "Punch", "Altroz"],
      "Honda": ["City", "Amaze"]
    },
    availableTimings: ["Morning", "Evening"],
    workingHours: "Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80"
  },
  {
    id: 9,
    name: "Viman Nagar Auto Care",
    city: "Pune",
    state: "Maharashtra",
    area: "Viman Nagar",
    address: "369 Nagar Road, Viman Nagar, Pune - 411014",
    phone: "+91 98765 43218",
    email: "support@vimannagar.com",
    rating: 4.5,
    reviewCount: 178,
    services: [
      "Car Wash & Cleaning",
      "Car Detailing Services",
      "Denting & Painting"
    ],
    specializations: ["Exterior Wash", "Ceramic Coating", "Dent Removal (PDR)"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Baleno", "WagonR"],
      "Hyundai": ["i20", "Creta", "Venue"],
      "Tata": ["Nexon", "Punch", "Altroz"],
      "Honda": ["City", "Amaze"]
    },
    availableTimings: ["Afternoon", "Evening"],
    workingHours: "Mon-Sun: 7:00 AM - 10:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=80"
  },

  // Hyderabad Dealerships
  {
    id: 10,
    name: "Hyderabad Auto Style",
    city: "Hyderabad",
    state: "Telangana",
    area: "Banjara Hills",
    address: "741 Road No 12, Banjara Hills, Hyderabad - 500034",
    phone: "+91 98765 43219",
    email: "info@hydautostyle.com",
    rating: 4.8,
    reviewCount: 234,
    services: [
      "Accessories & Customization",
      "Car Detailing Services",
      "New Cars"
    ],
    specializations: ["Body Kit", "LED Lights", "Browse Latest Models"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Baleno", "WagonR"],
      "Hyundai": ["i20", "Creta", "Venue"],
      "Tata": ["Nexon", "Punch", "Altroz"],
      "Honda": ["City", "Amaze"]
    },
    availableTimings: ["Morning", "Afternoon", "Evening"],
    workingHours: "Mon-Sat: 10:00 AM - 8:00 PM, Sun: 10:00 AM - 5:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80"
  },
  {
    id: 11,
    name: "Madhapur Service Pro",
    city: "Hyderabad",
    state: "Telangana",
    area: "Madhapur",
    address: "852 HITEC City Main Road, Madhapur, Hyderabad - 500081",
    phone: "+91 98765 43220",
    email: "contact@madhapurservice.com",
    rating: 4.9,
    reviewCount: 387,
    services: [
      "General Service & Maintenance",
      "Denting & Painting",
      "Wheel Alignment & Suspension"
    ],
    specializations: ["Oil Change", "Accident Repair", "Shock Absorber Replacement"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Baleno", "WagonR"],
      "Hyundai": ["i20", "Creta", "Venue"],
      "Tata": ["Nexon", "Punch", "Altroz"],
      "Honda": ["City", "Amaze"]
    },
    availableTimings: ["Morning", "Afternoon"],
    workingHours: "Mon-Sun: 8:00 AM - 9:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&q=80"
  },

  // Chennai Dealerships
  {
    id: 12,
    name: "Chennai Express Motors",
    city: "Chennai",
    state: "Tamil Nadu",
    area: "Anna Nagar",
    address: "963 2nd Avenue, Anna Nagar, Chennai - 600040",
    phone: "+91 98765 43221",
    email: "care@chennaiexpress.com",
    rating: 4.6,
    reviewCount: 145,
    services: [
      "New Cars",
      "Used Cars",
      "Emission Test & Legal Services"
    ],
    specializations: ["Test Drive Booking", "Buy-Sell-Exchange", "Insurance Renewal"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Baleno", "WagonR"],
      "Hyundai": ["i20", "Creta", "Venue"],
      "Tata": ["Nexon", "Punch", "Altroz"],
      "Honda": ["City", "Amaze"]
    },
    availableTimings: ["Morning", "Afternoon", "Evening"],
    workingHours: "Mon-Sun: 9:00 AM - 7:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80"
  },
  {
    id: 13,
    name: "T Nagar Auto Care",
    city: "Chennai",
    state: "Tamil Nadu",
    area: "T Nagar",
    address: "147 Usman Road, T Nagar, Chennai - 600017",
    phone: "+91 98765 43222",
    email: "info@tnagarauto.com",
    rating: 4.7,
    reviewCount: 289,
    services: [
      "Car Wash & Cleaning",
      "Car Detailing Services",
      "General Service & Maintenance"
    ],
    specializations: ["Interior Vacuuming", "Waxing & Polishing", "Filter Replacement"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Baleno", "WagonR"],
      "Hyundai": ["i20", "Creta", "Venue"],
      "Tata": ["Nexon", "Punch", "Altroz"],
      "Honda": ["City", "Amaze"]
    },
    availableTimings: ["Afternoon", "Evening"],
    workingHours: "Mon-Sat: 9:00 AM - 8:00 PM, Sun: Closed",
    verified: true,
    image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=600&q=80"
  },

  // Kolkata Dealerships
  {
    id: 14,
    name: "Kolkata Premium Service",
    city: "Kolkata",
    state: "West Bengal",
    area: "Salt Lake",
    address: "258 Sector V, Salt Lake, Kolkata - 700091",
    phone: "+91 98765 43223",
    email: "hello@kolkatapremium.com",
    rating: 4.5,
    reviewCount: 167,
    services: [
      "Denting & Painting",
      "General Service & Maintenance",
      "Tyres & Wheels"
    ],
    specializations: ["Full Body Painting", "Brake Service", "Puncture Repair"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Baleno", "WagonR"],
      "Hyundai": ["i20", "Creta", "Venue"],
      "Tata": ["Nexon", "Punch", "Altroz"],
      "Honda": ["City", "Amaze"]
    },
    availableTimings: ["Morning", "Afternoon"],
    workingHours: "Mon-Sat: 8:00 AM - 7:00 PM, Sun: 10:00 AM - 4:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80"
  },
  {
    id: 15,
    name: "Park Street Auto Hub",
    city: "Kolkata",
    state: "West Bengal",
    area: "Park Street",
    address: "741 Park Street, Park Street Area, Kolkata - 700016",
    phone: "+91 98765 43224",
    email: "contact@parkstreetauto.com",
    rating: 4.8,
    reviewCount: 312,
    services: [
      "Accessories & Customization",
      "Car Detailing Services",
      "Used Cars"
    ],
    specializations: ["Seat Covers & Mats", "PPF", "Vehicle Inspection Report"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Baleno", "WagonR"],
      "Hyundai": ["i20", "Creta", "Venue"],
      "Tata": ["Nexon", "Punch", "Altroz"],
      "Honda": ["City", "Amaze"]
    },
    availableTimings: ["Morning", "Evening"],
    workingHours: "Mon-Sun: 10:00 AM - 9:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80"
  },

  // Ahmedabad Dealerships
  {
    id: 16,
    name: "Ahmedabad Auto World",
    city: "Ahmedabad",
    state: "Gujarat",
    area: "Satellite",
    address: "852 SG Highway, Satellite, Ahmedabad - 380015",
    phone: "+91 98765 43225",
    email: "info@ahmedabadauto.com",
    rating: 4.6,
    reviewCount: 198,
    services: [
      "New Cars",
      "General Service & Maintenance",
      "Wheel Alignment & Suspension"
    ],
    specializations: ["Finance & Loan Assistance", "AC Service & Repair", "Spring Replacement"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Baleno", "WagonR"],
      "Hyundai": ["i20", "Creta", "Venue"],
      "Tata": ["Nexon", "Punch", "Altroz"],
      "Honda": ["City", "Amaze"]
    },
    availableTimings: ["Morning", "Afternoon", "Evening"],
    workingHours: "Mon-Sat: 9:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80"
  },

  // Jaipur Dealerships
  {
    id: 17,
    name: "Jaipur Royal Motors",
    city: "Jaipur",
    state: "Rajasthan",
    area: "C Scheme",
    address: "369 Ashok Marg, C Scheme, Jaipur - 302001",
    phone: "+91 98765 43226",
    email: "royal@jaipurmotors.com",
    rating: 4.7,
    reviewCount: 223,
    services: [
      "Denting & Painting",
      "Car Wash & Cleaning",
      "Emission Test & Legal Services"
    ],
    specializations: ["Panel Replacement", "Underbody Wash", "Driving License Services"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Baleno", "WagonR"],
      "Hyundai": ["i20", "Creta", "Venue"],
      "Tata": ["Nexon", "Punch", "Altroz"],
      "Honda": ["City", "Amaze"]
    },
    availableTimings: ["Afternoon", "Evening"],
    workingHours: "Mon-Sat: 9:00 AM - 7:00 PM, Sun: Closed",
    verified: true,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80"
  },

  // Chandigarh Dealerships
  {
    id: 18,
    name: "Chandigarh Auto Care",
    city: "Chandigarh",
    state: "Chandigarh",
    area: "Sector 17",
    address: "147 Sector 17, Chandigarh - 160017",
    phone: "+91 98765 43227",
    email: "care@chandigarhaut.com",
    rating: 4.8,
    reviewCount: 276,
    services: [
      "Tyres & Wheels",
      "General Service & Maintenance",
      "Accessories & Customization"
    ],
    specializations: ["Tyre Rotation", "Battery Check & Replacement", "Dashcam & Parking Sensors"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Baleno", "WagonR"],
      "Hyundai": ["i20", "Creta", "Venue"],
      "Tata": ["Nexon", "Punch", "Altroz"],
      "Honda": ["City", "Amaze"]
    },
    availableTimings: ["Morning", "Afternoon"],
    workingHours: "Mon-Sun: 8:00 AM - 8:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80"
  },

  // More Bangalore Dealerships
  {
    id: 19,
    name: "HSR Layout Auto Center",
    city: "Bangalore",
    state: "Karnataka",
    area: "HSR Layout",
    address: "321 Sector 1, HSR Layout, Bangalore - 560102",
    phone: "+91 98765 43228",
    email: "hsr@autocenter.com",
    rating: 4.7,
    reviewCount: 234,
    services: [
      "Used Cars",
      "Emission Test & Legal Services",
      "General Service & Maintenance"
    ],
    specializations: ["Warranty Options", "RC Transfer", "Oil Change"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Baleno", "WagonR"],
      "Hyundai": ["i20", "Creta", "Venue"],
      "Tata": ["Nexon", "Punch", "Altroz"],
      "Honda": ["City", "Amaze"]
    },
    availableTimings: ["Morning", "Evening"],
    workingHours: "Mon-Sat: 9:00 AM - 7:30 PM, Sun: 10:00 AM - 4:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80"
  },
  {
    id: 20,
    name: "Electronic City Tech Auto",
    city: "Bangalore",
    state: "Karnataka",
    area: "Electronic City",
    address: "654 Phase 1, Electronic City, Bangalore - 560100",
    phone: "+91 98765 43229",
    email: "tech@electronicity.com",
    rating: 4.5,
    reviewCount: 198,
    services: [
      "General Service & Maintenance",
      "Wheel Alignment & Suspension",
      "Accessories & Customization"
    ],
    specializations: ["AC Service", "Ball Joint Repair", "Audio System Upgrade"],
    supportedCars: {
      "Maruti Suzuki": ["Swift", "Baleno", "WagonR"],
      "Hyundai": ["i20", "Creta", "Venue"],
      "Tata": ["Nexon", "Punch", "Altroz"],
      "Honda": ["City", "Amaze"]
    },
    availableTimings: ["Afternoon", "Evening"],
    workingHours: "Mon-Sat: 8:00 AM - 8:00 PM, Sun: 9:00 AM - 5:00 PM",
    verified: true,
    image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&q=80"
  }
];

// Indian cities for location filter
export const indianCities = [
  "All Cities",
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Chandigarh"
];

// Available timing slots
export const timingSlots = [
  "All Timings",
  "Morning",
  "Afternoon",
  "Evening"
];

// Helper function to filter dealerships
export const filterDealerships = (serviceName, carCompany, carModel, location, timing) => {
  return dealerships.filter(dealership => {
    // Filter by service category (required)
    const serviceMatch = dealership.services.includes(serviceName);
    
    // Filter by car company and model (optional)
    let carMatch = true;
    if (carCompany && carCompany !== 'All Companies' && dealership.supportedCars) {
      const supportedModels = dealership.supportedCars[carCompany];
      if (!supportedModels) {
        carMatch = false;
      } else if (carModel && carModel !== 'Select Company First') {
        // Check if specific model is supported or if dealership supports "All Models"
        carMatch = supportedModels.includes('All Models') || supportedModels.includes(carModel);
      }
    }
    
    // Filter by location (optional)
    const locationMatch = !location || location === 'All Cities'
      ? true
      : dealership.city === location;
    
    // Filter by timing (optional)
    const timingMatch = !timing || timing === 'All Timings'
      ? true
      : dealership.availableTimings.includes(timing);
    
    return serviceMatch && carMatch && locationMatch && timingMatch;
  });
};
