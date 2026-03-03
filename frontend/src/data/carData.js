// Car companies and their models
export const carCompanies = {
  "Maruti Suzuki": [
    "Swift",
    "Baleno",
    "Brezza",
    "Ertiga",
    "WagonR",
    "Alto",
    "Dzire",
    "S-Cross",
    "Ciaz",
    "XL6"
  ],
  "Hyundai": [
    "i20",
    "Creta",
    "Venue",
    "Verna",
    "Grand i10 NIOS",
    "Exter",
    "Tucson",
    "Aura",
    "Alcazar"
  ],
  "Tata": [
    "Nexon",
    "Harrier",
    "Safari",
    "Punch",
    "Altroz",
    "Tiago",
    "Tigor",
    "Nexon EV"
  ],
  "Honda": [
    "City",
    "Amaze",
    "Elevate",
    "CR-V",
    "City e:HEV"
  ],
  "Mahindra": [
    "XUV700",
    "Scorpio-N",
    "Scorpio Classic",
    "Thar",
    "XUV300",
    "Bolero",
    "XUV400"
  ],
  "Toyota": [
    "Fortuner",
    "Innova Crysta",
    "Innova Hycross",
    "Urban Cruiser Hyryder",
    "Glanza",
    "Camry",
    "Hilux"
  ],
  "Kia": [
    "Seltos",
    "Sonet",
    "Carens",
    "EV6"
  ],
  "MG": [
    "Hector",
    "Astor",
    "ZS EV",
    "Gloster",
    "Comet EV"
  ],
  "Renault": [
    "Kiger",
    "Triber",
    "Kwid"
  ],
  "Nissan": [
    "Magnite",
    "X-Trail"
  ],
  "Volkswagen": [
    "Taigun",
    "Virtus",
    "Tiguan"
  ],
  "Skoda": [
    "Kushaq",
    "Slavia",
    "Kodiaq"
  ],
  "Jeep": [
    "Compass",
    "Meridian",
    "Wrangler"
  ],
  "Ford": [
    "Endeavour",
    "EcoSport",
    "Figo"
  ]
};

// Get all company names
export const getCompanyNames = () => {
  return Object.keys(carCompanies).sort();
};

// Get models for a specific company
export const getModelsForCompany = (company) => {
  return carCompanies[company] || [];
};

// Check if a company-model combination is valid
export const isValidCompanyModel = (company, model) => {
  if (!company || !model) return false;
  const models = carCompanies[company];
  return models ? models.includes(model) : false;
};
