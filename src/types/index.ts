// Gravitas Construction Estimator - Type Definitions
// Philippines Construction Cost Estimation App

export type UserTier = 'free' | 'standard' | 'premium';
export type TierStatus = 'active' | 'canceled' | 'past_due';
export type LoginMethod = 'email' | 'google' | 'facebook' | 'username';

export interface User {
  uid: string;
  email: string;
  username?: string;
  displayName: string;
  tier: UserTier;
  tierStatus: TierStatus;
  paymongoCustomerId?: string;
  paymongoSubscriptionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  estimatesUsedThisMonth: number;
  lastEstimateReset: Date;
  offlineDatabaseVersion?: Date;
  isAdmin?: boolean;
  loginMethod: LoginMethod;
  createdAt: Date;
  updatedAt: Date;
}

// EXTENSIVE PROJECT TYPES - For all kinds of construction
export type ProjectType = 
  // Residential
  | 'bungalow' 
  | 'two_storey'
  | 'three_storey'
  | 'townhouse'
  | 'duplex'
  | 'apartment'
  | 'condominium'
  | 'bedroom_addition'
  | 'kitchen_renovation'
  | 'bathroom_renovation'
  | 'home_basement'
  | 'roofing_replacement'
  | 'dirty_kitchen'
  | 'carport'
  | 'garage'
  | 'fence'
  | 'gate'
  | 'driveway'
  | 'walkway'
  | 'patio'
  | 'deck'
  | 'balcony'
  | 'pergola'
  | 'gazebo'
  | 'swimming_pool'
  | 'landscaping'
  | 'garden'
  | 'retaining_wall'
  
  // Commercial
  | 'commercial'
  | 'office_building'
  | 'retail_store'
  | 'restaurant'
  | 'hotel'
  | 'warehouse'
  | 'factory'
  | 'industrial'
  | 'showroom'
  | 'bank'
  
  // Infrastructure
  | 'road'
  | 'bridge'
  | 'underground_parking'
  | 'multi_storey_parking'
  | 'septic_tank'
  | 'drainage'
  | 'water_system'
  | 'electrical_substation'
  | 'solar_installation'
  
  // Institutional
  | 'school'
  | 'hospital'
  | 'church'
  | 'government_building'
  | 'community_center'
  | 'sports_complex'
  | 'gym'
  
  // Specialized
  | 'subdivision'
  | 'subdivision_road'
  | 'guard_house'
  | 'perimeter_wall'
  | 'compound_fence'
  | 'water_tower'
  | 'elevated_tank'
  | 'pump_house'
  | 'generator_room'
  | 'materials_shed'
  | 'workers_quarters';

export type Location = 
  | 'metro_manila' 
  | 'cebu' 
  | 'davao' 
  | 'iloilo' 
  | 'baguio' 
  | 'batangas'
  | 'bataan'
  | 'pampanga'
  | 'bulacan'
  | 'rizal'
  | 'laguna'
  | 'cavite'
  | 'quezon'
  | 'pangasinan'
  | 'la_union'
  | 'ilocos_norte'
  | 'ilocos_sur'
  | 'cagayan'
  | 'isabela'
  | 'nueva_ecija'
  | 'tarlac'
  | 'zambales'
  | 'benguet'
  | 'mountain_province'
  | 'ifugao'
  | 'abra'
  | 'kalinga'
  | 'apayao'
  | 'nueva_vizcaya'
  | 'quirino'
  | 'batanes'
  | 'aurora'
  | 'marinduque'
  | 'occidental_mindoro'
  | 'oriental_mindoro'
  | 'palawan'
  | 'romblon'
  | 'albay'
  | 'camarines_norte'
  | 'camarines_sur'
  | 'catanduanes'
  | 'masbate'
  | 'sorsogon'
  | 'aklan'
  | 'antique'
  | 'capiz'
  | 'guimaras'
  | 'negros_occidental'
  | 'negros_oriental'
  | 'siquijor'
  | 'bohol'
  | 'biliran'
  | 'eastern_samar'
  | 'leyte'
  | 'northern_samar'
  | 'samar'
  | 'southern_leyte'
  | 'basilan'
  | 'lanao_del_norte'
  | 'lanao_del_sur'
  | 'maguindanao'
  | 'sulu'
  | 'tawi_tawi'
  | 'zamboanga_del_norte'
  | 'zamboanga_del_sur'
  | 'zamboanga_sibugay'
  | 'bukidnon'
  | 'camiguin'
  | 'misamis_occidental'
  | 'misamis_oriental'
  | 'davao_de_oro'
  | 'davao_del_norte'
  | 'davao_del_sur'
  | 'davao_occidental'
  | 'davao_oriental'
  | 'cotabato'
  | 'sarangani'
  | 'south_cotabato'
  | 'sultan_kudarat'
  | 'agusan_del_norte'
  | 'agusan_del_sur'
  | 'dinagat_islands'
  | 'surigao_del_norte'
  | 'surigao_del_sur';

export interface Measurements {
  unit: 'sqm' | 'sqft' | 'sqin' | 'hectare' | 'acre';
  area: number;
  length?: number;
  width?: number;
  height?: number;
  rooms?: number;
  floors?: number;
  perimeter?: number;
}

export interface MaterialItem {
  materialId: string;
  name: string;
  category: string;
  subcategory?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  included: boolean;
  customizable?: boolean;
  alternatives?: string[];
  selectedAlternative?: string;
}

export interface Estimate {
  id: string;
  userId: string;
  projectName: string;
  location: Location;
  projectType: ProjectType;
  measurements: Measurements;
  materials: MaterialItem[];
  excludedMaterials?: string[];
  customMaterials?: MaterialItem[];
  laborCost?: number;
  equipmentCost?: number;
  overheadPercent?: number;
  profitPercent?: number;
  contingencyPercent?: number;
  materialsSubtotal: number;
  grandTotal: number;
  isOfflineCreated: boolean;
  status: 'draft' | 'saved' | 'exported';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Material {
  id: string;
  category: 'concrete' | 'steel' | 'wood' | 'roofing' | 'electrical' | 'plumbing' | 'masonry' | 'finishing' | 'hardware' | 'tiles' | 'paint' | 'glass' | 'insulation' | 'waterproofing';
  subcategory: string;
  name: string;
  specification: string;
  unit: 'piece' | 'bag' | 'meter' | 'sqm' | 'cu.m' | 'kg' | 'length' | 'gallon' | 'liter' | 'roll' | 'box' | 'set' | 'sheet' | 'can';
  basePrice: number;
  locationMultipliers: Partial<Record<Location, number>>;
  isAvailable: boolean;
  tierAvailability: UserTier;
  lastScraped?: Date;
  sourceUrl?: string;
  manualOverride?: number;
  alternatives?: string[];
}

export interface PriceSource {
  name: string;
  url: string;
  price: number;
  lastUpdated: Date;
}

export interface MaterialWithPrices extends Material {
  prices: PriceSource[];
  selectedPrice: number;
}

export interface ScrapingLog {
  id: string;
  scheduledTime: Date;
  actualStart: Date;
  completionStatus: 'success' | 'partial' | 'failed';
  materialsUpdated: number;
  materialsFailed: { materialId: string; error: string }[];
  durationSeconds: number;
  scraperVersion: string;
  adminNotified: boolean;
}

export interface SubscriptionPlan {
  id: UserTier;
  name: string;
  price: number;
  priceFormatted: string;
  description: string;
  features: string[];
  limitations: string[];
  updateFrequency: string;
  maxEstimates: number | 'unlimited';
}

export interface CalculationResult {
  materials: MaterialItem[];
  materialsSubtotal: number;
  laborCost?: number;
  equipmentCost?: number;
  overheadAmount?: number;
  profitAmount?: number;
  contingencyAmount?: number;
  grandTotal: number;
}

// CHB Calculation Types
export interface CHBCalculation {
  area: number;
  thickness: '4in' | '6in' | '8in';
  chbCount: number;
  cementBags: number;
  sandVolume: number;
  rebarLength: number;
  rebarPieces: number;
}

// Concrete Calculation Types
export interface ConcreteCalculation {
  length: number;
  width: number;
  thickness: number;
  volume: number;
  cementBags40kg: number;
  cementBags50kg: number;
  sandVolume: number;
  gravelVolume: number;
}

// Location Multiplier Map - All 82 provinces
export const LOCATION_MULTIPLIERS: Record<Location, number> = {
  // NCR and CALABARZON
  metro_manila: 1.0,
  cavite: 0.96,
  laguna: 0.95,
  batangas: 0.94,
  rizal: 0.95,
  quezon: 0.88,
  
  // Central Luzon
  bataan: 0.93,
  bulacan: 0.95,
  pampanga: 0.94,
  tarlac: 0.90,
  zambales: 0.89,
  nueva_ecija: 0.88,
  aurora: 0.85,
  
  // Ilocos Region
  ilocos_norte: 0.87,
  ilocos_sur: 0.87,
  la_union: 0.88,
  pangasinan: 0.89,
  
  // Cagayan Valley
  cagayan: 0.85,
  isabela: 0.86,
  nueva_vizcaya: 0.84,
  quirino: 0.83,
  batanes: 0.90,
  
  // Cordillera
  baguio: 0.97,
  benguet: 0.88,
  mountain_province: 0.85,
  ifugao: 0.84,
  abra: 0.83,
  kalinga: 0.84,
  apayao: 0.83,
  
  // MIMAROPA
  marinduque: 0.87,
  occidental_mindoro: 0.86,
  oriental_mindoro: 0.87,
  palawan: 0.88,
  romblon: 0.86,
  
  // Bicol
  albay: 0.88,
  camarines_norte: 0.87,
  camarines_sur: 0.88,
  catanduanes: 0.89,
  masbate: 0.86,
  sorsogon: 0.87,
  
  // Western Visayas
  aklan: 0.89,
  antique: 0.87,
  capiz: 0.88,
  guimaras: 0.89,
  iloilo: 0.93,
  negros_occidental: 0.92,
  
  // Central Visayas
  bohol: 0.90,
  cebu: 0.95,
  davao: 0.92,
  negros_oriental: 0.91,
  siquijor: 0.88,
  
  // Eastern Visayas
  biliran: 0.87,
  eastern_samar: 0.86,
  leyte: 0.89,
  northern_samar: 0.85,
  samar: 0.86,
  southern_leyte: 0.87,
  
  // Zamboanga Peninsula
  zamboanga_del_norte: 0.86,
  zamboanga_del_sur: 0.87,
  zamboanga_sibugay: 0.85,
  
  // Northern Mindanao
  bukidnon: 0.88,
  camiguin: 0.89,
  lanao_del_norte: 0.87,
  misamis_occidental: 0.88,
  misamis_oriental: 0.89,
  
  // Davao Region
  davao_de_oro: 0.89,
  davao_del_norte: 0.90,
  davao_del_sur: 0.91,
  davao_occidental: 0.88,
  davao_oriental: 0.87,
  
  // SOCCSKSARGEN
  cotabato: 0.87,
  sarangani: 0.86,
  south_cotabato: 0.88,
  sultan_kudarat: 0.86,
  
  // Caraga
  agusan_del_norte: 0.88,
  agusan_del_sur: 0.87,
  dinagat_islands: 0.85,
  surigao_del_norte: 0.87,
  surigao_del_sur: 0.88,
  
  // BARMM
  basilan: 0.85,
  lanao_del_sur: 0.84,
  maguindanao: 0.83,
  sulu: 0.82,
  tawi_tawi: 0.81,
};

export const LOCATION_NAMES: Record<Location, string> = {
  metro_manila: 'Metro Manila',
  cavite: 'Cavite',
  laguna: 'Laguna',
  batangas: 'Batangas',
  rizal: 'Rizal',
  quezon: 'Quezon',
  bataan: 'Bataan',
  bulacan: 'Bulacan',
  pampanga: 'Pampanga',
  tarlac: 'Tarlac',
  zambales: 'Zambales',
  nueva_ecija: 'Nueva Ecija',
  aurora: 'Aurora',
  ilocos_norte: 'Ilocos Norte',
  ilocos_sur: 'Ilocos Sur',
  la_union: 'La Union',
  pangasinan: 'Pangasinan',
  cagayan: 'Cagayan',
  isabela: 'Isabela',
  nueva_vizcaya: 'Nueva Vizcaya',
  quirino: 'Quirino',
  batanes: 'Batanes',
  baguio: 'Baguio',
  benguet: 'Benguet',
  mountain_province: 'Mountain Province',
  ifugao: 'Ifugao',
  abra: 'Abra',
  kalinga: 'Kalinga',
  apayao: 'Apayao',
  marinduque: 'Marinduque',
  occidental_mindoro: 'Occidental Mindoro',
  oriental_mindoro: 'Oriental Mindoro',
  palawan: 'Palawan',
  romblon: 'Romblon',
  albay: 'Albay',
  camarines_norte: 'Camarines Norte',
  camarines_sur: 'Camarines Sur',
  catanduanes: 'Catanduanes',
  masbate: 'Masbate',
  sorsogon: 'Sorsogon',
  aklan: 'Aklan',
  antique: 'Antique',
  capiz: 'Capiz',
  guimaras: 'Guimaras',
  iloilo: 'Iloilo',
  negros_occidental: 'Negros Occidental',
  bohol: 'Bohol',
  cebu: 'Cebu',
  davao: 'Davao',
  negros_oriental: 'Negros Oriental',
  siquijor: 'Siquijor',
  biliran: 'Biliran',
  eastern_samar: 'Eastern Samar',
  leyte: 'Leyte',
  northern_samar: 'Northern Samar',
  samar: 'Samar',
  southern_leyte: 'Southern Leyte',
  zamboanga_del_norte: 'Zamboanga del Norte',
  zamboanga_del_sur: 'Zamboanga del Sur',
  zamboanga_sibugay: 'Zamboanga Sibugay',
  bukidnon: 'Bukidnon',
  camiguin: 'Camiguin',
  lanao_del_norte: 'Lanao del Norte',
  misamis_occidental: 'Misamis Occidental',
  misamis_oriental: 'Misamis Oriental',
  davao_de_oro: 'Davao de Oro',
  davao_del_norte: 'Davao del Norte',
  davao_del_sur: 'Davao del Sur',
  davao_occidental: 'Davao Occidental',
  davao_oriental: 'Davao Oriental',
  cotabato: 'Cotabato',
  sarangani: 'Sarangani',
  south_cotabato: 'South Cotabato',
  sultan_kudarat: 'Sultan Kudarat',
  agusan_del_norte: 'Agusan del Norte',
  agusan_del_sur: 'Agusan del Sur',
  dinagat_islands: 'Dinagat Islands',
  surigao_del_norte: 'Surigao del Norte',
  surigao_del_sur: 'Surigao del Sur',
  basilan: 'Basilan',
  lanao_del_sur: 'Lanao del Sur',
  maguindanao: 'Maguindanao',
  sulu: 'Sulu',
  tawi_tawi: 'Tawi-Tawi',
};

// EXTENSIVE PROJECT TYPE DEFINITIONS
export const PROJECT_TYPE_DEFINITIONS: Record<ProjectType, { 
  name: string; 
  category: string; 
  tier: 'free' | 'standard' | 'premium';
  description: string;
  defaultMeasurements: Partial<Measurements>;
}> = {
  // Residential
  bungalow: { 
    name: 'Bungalow (Single Storey)', 
    category: 'Residential', 
    tier: 'free',
    description: 'Single storey residential house',
    defaultMeasurements: { floors: 1, rooms: 3 }
  },
  two_storey: { 
    name: 'Two Storey House', 
    category: 'Residential', 
    tier: 'free',
    description: 'Two storey residential house',
    defaultMeasurements: { floors: 2, rooms: 4 }
  },
  three_storey: { 
    name: 'Three Storey House', 
    category: 'Residential', 
    tier: 'standard',
    description: 'Three storey residential house',
    defaultMeasurements: { floors: 3, rooms: 6 }
  },
  townhouse: { 
    name: 'Townhouse', 
    category: 'Residential', 
    tier: 'standard',
    description: 'Attached townhouse unit',
    defaultMeasurements: { floors: 2, rooms: 3 }
  },
  duplex: { 
    name: 'Duplex', 
    category: 'Residential', 
    tier: 'standard',
    description: 'Two-unit residential building',
    defaultMeasurements: { floors: 2, rooms: 4 }
  },
  apartment: { 
    name: 'Apartment Building', 
    category: 'Residential', 
    tier: 'standard',
    description: 'Multi-unit apartment building',
    defaultMeasurements: { floors: 3, rooms: 12 }
  },
  condominium: { 
    name: 'Condominium', 
    category: 'Residential', 
    tier: 'premium',
    description: 'High-rise condominium building',
    defaultMeasurements: { floors: 10, rooms: 40 }
  },
  bedroom_addition: { 
    name: 'Bedroom Addition', 
    category: 'Renovation', 
    tier: 'free',
    description: 'Add a new bedroom to existing house',
    defaultMeasurements: { area: 12, rooms: 1 }
  },
  kitchen_renovation: { 
    name: 'Kitchen Renovation', 
    category: 'Renovation', 
    tier: 'free',
    description: 'Kitchen remodeling project',
    defaultMeasurements: { area: 10, rooms: 1 }
  },
  bathroom_renovation: { 
    name: 'Bathroom Renovation', 
    category: 'Renovation', 
    tier: 'free',
    description: 'Bathroom remodeling project',
    defaultMeasurements: { area: 5, rooms: 1 }
  },
  home_basement: { 
    name: 'Home Basement', 
    category: 'Residential', 
    tier: 'premium',
    description: 'Basement construction or renovation',
    defaultMeasurements: { area: 50, floors: 1 }
  },
  roofing_replacement: { 
    name: 'Roofing Replacement', 
    category: 'Renovation', 
    tier: 'standard',
    description: 'Complete roof replacement',
    defaultMeasurements: { area: 80 }
  },
  dirty_kitchen: { 
    name: 'Dirty Kitchen', 
    category: 'Outdoor', 
    tier: 'free',
    description: 'Outdoor cooking area (kusina)',
    defaultMeasurements: { area: 8, rooms: 1 }
  },
  carport: { 
    name: 'Carport', 
    category: 'Outdoor', 
    tier: 'free',
    description: 'Open car shelter',
    defaultMeasurements: { area: 15 }
  },
  garage: { 
    name: 'Garage (Enclosed)', 
    category: 'Outdoor', 
    tier: 'standard',
    description: 'Enclosed garage structure',
    defaultMeasurements: { area: 20 }
  },
  fence: { 
    name: 'Fence / Wall', 
    category: 'Outdoor', 
    tier: 'free',
    description: 'Perimeter fence or wall',
    defaultMeasurements: { length: 20, height: 2 }
  },
  gate: { 
    name: 'Gate', 
    category: 'Outdoor', 
    tier: 'free',
    description: 'Main entrance gate',
    defaultMeasurements: { area: 4 }
  },
  driveway: { 
    name: 'Driveway', 
    category: 'Outdoor', 
    tier: 'free',
    description: 'Concrete driveway',
    defaultMeasurements: { area: 30 }
  },
  walkway: { 
    name: 'Walkway / Path', 
    category: 'Outdoor', 
    tier: 'free',
    description: 'Garden walkway or path',
    defaultMeasurements: { area: 10 }
  },
  patio: { 
    name: 'Patio', 
    category: 'Outdoor', 
    tier: 'standard',
    description: 'Outdoor patio area',
    defaultMeasurements: { area: 20 }
  },
  deck: { 
    name: 'Deck / Balcony Floor', 
    category: 'Outdoor', 
    tier: 'standard',
    description: 'Wooden or concrete deck',
    defaultMeasurements: { area: 15 }
  },
  balcony: { 
    name: 'Balcony Addition', 
    category: 'Outdoor', 
    tier: 'standard',
    description: 'Add a balcony to existing structure',
    defaultMeasurements: { area: 8 }
  },
  pergola: { 
    name: 'Pergola', 
    category: 'Outdoor', 
    tier: 'standard',
    description: 'Open outdoor structure with roof',
    defaultMeasurements: { area: 12 }
  },
  gazebo: { 
    name: 'Gazebo', 
    category: 'Outdoor', 
    tier: 'standard',
    description: 'Standalone garden structure',
    defaultMeasurements: { area: 9 }
  },
  swimming_pool: { 
    name: 'Swimming Pool', 
    category: 'Outdoor', 
    tier: 'premium',
    description: 'In-ground swimming pool',
    defaultMeasurements: { area: 30 }
  },
  landscaping: { 
    name: 'Landscaping', 
    category: 'Outdoor', 
    tier: 'standard',
    description: 'Garden and landscape work',
    defaultMeasurements: { area: 50 }
  },
  garden: { 
    name: 'Garden Features', 
    category: 'Outdoor', 
    tier: 'free',
    description: 'Garden walls, planters, etc.',
    defaultMeasurements: { area: 20 }
  },
  retaining_wall: { 
    name: 'Retaining Wall', 
    category: 'Outdoor', 
    tier: 'standard',
    description: 'Soil retention wall',
    defaultMeasurements: { length: 10, height: 1.5 }
  },
  
  // Commercial
  commercial: { 
    name: 'Commercial Building (General)', 
    category: 'Commercial', 
    tier: 'standard',
    description: 'General commercial structure',
    defaultMeasurements: { area: 200, floors: 2 }
  },
  office_building: { 
    name: 'Office Building', 
    category: 'Commercial', 
    tier: 'premium',
    description: 'Multi-storey office building',
    defaultMeasurements: { area: 500, floors: 5 }
  },
  retail_store: { 
    name: 'Retail Store / Shop', 
    category: 'Commercial', 
    tier: 'standard',
    description: 'Retail commercial space',
    defaultMeasurements: { area: 50 }
  },
  restaurant: { 
    name: 'Restaurant / Cafe', 
    category: 'Commercial', 
    tier: 'standard',
    description: 'Food service establishment',
    defaultMeasurements: { area: 100 }
  },
  hotel: { 
    name: 'Hotel / Inn', 
    category: 'Commercial', 
    tier: 'premium',
    description: 'Hospitality building',
    defaultMeasurements: { area: 1000, floors: 4, rooms: 20 }
  },
  warehouse: { 
    name: 'Warehouse / Storage', 
    category: 'Commercial', 
    tier: 'standard',
    description: 'Industrial storage facility',
    defaultMeasurements: { area: 300 }
  },
  factory: { 
    name: 'Factory / Plant', 
    category: 'Industrial', 
    tier: 'premium',
    description: 'Manufacturing facility',
    defaultMeasurements: { area: 1000 }
  },
  industrial: { 
    name: 'Industrial Building', 
    category: 'Industrial', 
    tier: 'premium',
    description: 'General industrial structure',
    defaultMeasurements: { area: 500 }
  },
  showroom: { 
    name: 'Showroom / Display Center', 
    category: 'Commercial', 
    tier: 'standard',
    description: 'Product display space',
    defaultMeasurements: { area: 150 }
  },
  bank: { 
    name: 'Bank / Financial Center', 
    category: 'Commercial', 
    tier: 'premium',
    description: 'Banking facility',
    defaultMeasurements: { area: 200 }
  },
  
  // Infrastructure
  road: { 
    name: 'Road Construction', 
    category: 'Infrastructure', 
    tier: 'premium',
    description: 'Road or street construction',
    defaultMeasurements: { length: 100, width: 6 }
  },
  bridge: { 
    name: 'Bridge / Overpass', 
    category: 'Infrastructure', 
    tier: 'premium',
    description: 'Bridge structure',
    defaultMeasurements: { length: 20, width: 8 }
  },
  underground_parking: { 
    name: 'Underground Parking', 
    category: 'Infrastructure', 
    tier: 'premium',
    description: 'Basement parking structure',
    defaultMeasurements: { area: 500 }
  },
  multi_storey_parking: { 
    name: 'Multi-Storey Parking', 
    category: 'Infrastructure', 
    tier: 'premium',
    description: 'Parking building',
    defaultMeasurements: { area: 800, floors: 3 }
  },
  septic_tank: { 
    name: 'Septic Tank / Sewage', 
    category: 'Infrastructure', 
    tier: 'standard',
    description: 'Waste management system',
    defaultMeasurements: { area: 10 }
  },
  drainage: { 
    name: 'Drainage System', 
    category: 'Infrastructure', 
    tier: 'standard',
    description: 'Storm water drainage',
    defaultMeasurements: { length: 50 }
  },
  water_system: { 
    name: 'Water Supply System', 
    category: 'Infrastructure', 
    tier: 'standard',
    description: 'Water distribution system',
    defaultMeasurements: { length: 100 }
  },
  electrical_substation: { 
    name: 'Electrical Substation', 
    category: 'Infrastructure', 
    tier: 'premium',
    description: 'Power distribution facility',
    defaultMeasurements: { area: 50 }
  },
  solar_installation: { 
    name: 'Solar Panel Installation', 
    category: 'Infrastructure', 
    tier: 'standard',
    description: 'Solar power system',
    defaultMeasurements: { area: 30 }
  },
  
  // Institutional
  school: { 
    name: 'School Building', 
    category: 'Institutional', 
    tier: 'premium',
    description: 'Educational facility',
    defaultMeasurements: { area: 1000, floors: 2, rooms: 12 }
  },
  hospital: { 
    name: 'Hospital / Clinic', 
    category: 'Institutional', 
    tier: 'premium',
    description: 'Medical facility',
    defaultMeasurements: { area: 2000, floors: 3, rooms: 30 }
  },
  church: { 
    name: 'Church / Chapel', 
    category: 'Institutional', 
    tier: 'premium',
    description: 'Religious building',
    defaultMeasurements: { area: 300 }
  },
  government_building: { 
    name: 'Government Building', 
    category: 'Institutional', 
    tier: 'premium',
    description: 'Public office building',
    defaultMeasurements: { area: 800, floors: 3 }
  },
  community_center: { 
    name: 'Community Center', 
    category: 'Institutional', 
    tier: 'premium',
    description: 'Barangay or community hall',
    defaultMeasurements: { area: 200 }
  },
  sports_complex: { 
    name: 'Sports Complex', 
    category: 'Institutional', 
    tier: 'premium',
    description: 'Sports facility',
    defaultMeasurements: { area: 2000 }
  },
  gym: { 
    name: 'Gym / Fitness Center', 
    category: 'Commercial', 
    tier: 'standard',
    description: 'Fitness facility',
    defaultMeasurements: { area: 150 }
  },
  
  // Specialized
  subdivision: { 
    name: 'Subdivision Development', 
    category: 'Development', 
    tier: 'premium',
    description: 'Housing subdivision project',
    defaultMeasurements: { area: 5000, rooms: 50 }
  },
  subdivision_road: { 
    name: 'Subdivision Roads', 
    category: 'Development', 
    tier: 'premium',
    description: 'Internal road network',
    defaultMeasurements: { length: 500, width: 6 }
  },
  guard_house: { 
    name: 'Guard House', 
    category: 'Outdoor', 
    tier: 'standard',
    description: 'Security post',
    defaultMeasurements: { area: 6 }
  },
  perimeter_wall: { 
    name: 'Perimeter Wall', 
    category: 'Outdoor', 
    tier: 'standard',
    description: 'Property boundary wall',
    defaultMeasurements: { length: 100, height: 2.5 }
  },
  compound_fence: { 
    name: 'Compound Fence', 
    category: 'Outdoor', 
    tier: 'standard',
    description: 'Full perimeter fencing',
    defaultMeasurements: { length: 200, height: 2 }
  },
  water_tower: { 
    name: 'Water Tower / Tank', 
    category: 'Infrastructure', 
    tier: 'premium',
    description: 'Elevated water storage',
    defaultMeasurements: { height: 10 }
  },
  elevated_tank: { 
    name: 'Elevated Water Tank', 
    category: 'Infrastructure', 
    tier: 'premium',
    description: 'Rooftop or tower tank',
    defaultMeasurements: { area: 15, height: 8 }
  },
  pump_house: { 
    name: 'Pump House', 
    category: 'Infrastructure', 
    tier: 'standard',
    description: 'Water pump enclosure',
    defaultMeasurements: { area: 8 }
  },
  generator_room: { 
    name: 'Generator Room', 
    category: 'Infrastructure', 
    tier: 'standard',
    description: 'Backup power room',
    defaultMeasurements: { area: 12 }
  },
  materials_shed: { 
    name: 'Materials Shed', 
    category: 'Outdoor', 
    tier: 'free',
    description: 'Construction materials storage',
    defaultMeasurements: { area: 20 }
  },
  workers_quarters: { 
    name: 'Workers Quarters', 
    category: 'Outdoor', 
    tier: 'standard',
    description: 'On-site worker housing',
    defaultMeasurements: { area: 50, rooms: 4 }
  },
};

// Contractor scale types
export type ContractorScale = 'micro' | 'small' | 'medium' | 'large' | 'conglomerate';

export interface ContractorProfile {
  scale: ContractorScale;
  companyName?: string;
  secRegistration?: string;
  birTin?: string;
  pcabLicense?: string;
  contactNumber: string;
  address: string;
  yearsInBusiness: number;
  specialties: ProjectType[];
}

// Support contact
export const SUPPORT_EMAIL = 'gravitasconsol@gmail.com';
export const SUPPORT_PHONE = '+63 (2) 8XXX-XXXX';
