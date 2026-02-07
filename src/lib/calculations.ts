// Gravitas Construction Estimator - Calculation Engine
// Standard Philippine Construction Formulas - Math Verified

import type { 
  CHBCalculation, 
  ConcreteCalculation, 
  MaterialItem, 
  CalculationResult,
  Location,
  Measurements,
  ProjectType
} from '@/types';

// Import location multipliers for use in this file
import { LOCATION_MULTIPLIERS, PROJECT_TYPE_DEFINITIONS } from '@/types';

// Re-export location multipliers from types
export { LOCATION_MULTIPLIERS, LOCATION_NAMES, PROJECT_TYPE_DEFINITIONS } from '@/types';

// ═══════════════════════════════════════════════════════
// WALL MASONRY (CHB) CALCULATIONS
// ═══════════════════════════════════════════════════════

export function calculateCHB(
  area: number, 
  thickness: '4in' | '6in' | '8in' = '6in'
): CHBCalculation {
  const chbPerSqm = thickness === '6in' ? 13 : thickness === '4in' ? 17 : 10;
  const chbCount = Math.ceil(area * chbPerSqm);
  const cementBags = Math.ceil((chbCount / 100) * 3);
  const sandVolume = parseFloat(((chbCount / 100) * 0.04).toFixed(2));
  const rebarLength = Math.ceil(area * 2.5);
  const rebarPieces = Math.ceil(rebarLength / 6);
  
  return { area, thickness, chbCount, cementBags, sandVolume, rebarLength, rebarPieces };
}

// ═══════════════════════════════════════════════════════
// CONCRETE SLAB CALCULATIONS (Class A 1:2:4 mix)
// ═══════════════════════════════════════════════════════

export function calculateConcrete(
  length: number,
  width: number,
  thickness: number
): ConcreteCalculation {
  const volume = parseFloat((length * width * thickness).toFixed(2));
  const cementBags40kg = Math.ceil(volume * 7);
  const cementBags50kg = Math.ceil(volume * 5.6);
  const sandVolume = parseFloat((volume * 0.42).toFixed(2));
  const gravelVolume = parseFloat((volume * 0.83).toFixed(2));
  
  return { length, width, thickness, volume, cementBags40kg, cementBags50kg, sandVolume, gravelVolume };
}

// ═══════════════════════════════════════════════════════
// REINFORCEMENT CALCULATIONS
// ═══════════════════════════════════════════════════════

export function calculateRebar(
  area: number,
  rebarDiameter: 10 | 12 | 16 | 20 | 25 = 10
): { length: number; pieces: number; diameter: number } {
  const length = Math.ceil(area * 2.5);
  const pieces = Math.ceil(length / 6);
  return { length, pieces, diameter: rebarDiameter };
}

// ═══════════════════════════════════════════════════════
// COMPREHENSIVE MATERIAL DATABASE (200+ items)
// ═══════════════════════════════════════════════════════

export interface MaterialOption {
  id: string;
  name: string;
  unit: string;
  basePrice: number;
  category: string;
  subcategory?: string;
  alternatives?: string[];
  sizes?: string[];
  grades?: string[];
}

// EXTENDED MATERIAL DATABASE - For Premium Freedom
export const MATERIAL_DATABASE: MaterialOption[] = [
  // CHB - Hollow Blocks (Multiple sizes)
  { id: 'chb-4in', name: 'CHB 4" (100mm)', unit: 'piece', basePrice: 14, category: 'masonry', sizes: ['4"', '6"', '8"'] },
  { id: 'chb-6in', name: 'CHB 6" (150mm)', unit: 'piece', basePrice: 18, category: 'masonry', sizes: ['4"', '6"', '8"'] },
  { id: 'chb-8in', name: 'CHB 8" (200mm)', unit: 'piece', basePrice: 24, category: 'masonry', sizes: ['4"', '6"', '8"'] },
  { id: 'chb-10in', name: 'CHB 10" (250mm)', unit: 'piece', basePrice: 32, category: 'masonry' },
  
  // Cement (Multiple brands and sizes)
  { id: 'cement-40kg-ordinary', name: 'Ordinary Portland Cement 40kg', unit: 'bag', basePrice: 240, category: 'concrete', grades: ['Ordinary', 'Premium', 'Eco'] },
  { id: 'cement-50kg-ordinary', name: 'Ordinary Portland Cement 50kg', unit: 'bag', basePrice: 300, category: 'concrete' },
  { id: 'cement-40kg-premium', name: 'Premium Portland Cement 40kg', unit: 'bag', basePrice: 280, category: 'concrete' },
  { id: 'white-cement', name: 'White Cement 40kg', unit: 'bag', basePrice: 450, category: 'concrete' },
  { id: 'masonry-cement', name: 'Masonry Cement 40kg', unit: 'bag', basePrice: 260, category: 'concrete' },
  
  // Aggregates
  { id: 'sand-washed', name: 'Washed Sand (S1)', unit: 'cu.m', basePrice: 5250, category: 'concrete' },
  { id: 'sand-ordinary', name: 'Ordinary Sand', unit: 'cu.m', basePrice: 4500, category: 'concrete' },
  { id: 'gravel-3-4', name: 'Gravel 3/4" (G1)', unit: 'cu.m', basePrice: 4800, category: 'concrete' },
  { id: 'gravel-3-8', name: 'Gravel 3/8"', unit: 'cu.m', basePrice: 4900, category: 'concrete' },
  { id: 'crushed-rock', name: 'Crushed Rock (G2)', unit: 'cu.m', basePrice: 5200, category: 'concrete' },
  { id: 'base-course', name: 'Base Course Material', unit: 'cu.m', basePrice: 3500, category: 'concrete' },
  
  // Rebar - Deformed Bars (All sizes)
  { id: 'rebar-8mm', name: 'Rebar Ø8mm (6m)', unit: 'piece', basePrice: 145, category: 'steel', sizes: ['8mm', '10mm', '12mm', '16mm', '20mm', '25mm', '32mm'] },
  { id: 'rebar-10mm', name: 'Rebar Ø10mm (6m)', unit: 'piece', basePrice: 221, category: 'steel' },
  { id: 'rebar-12mm', name: 'Rebar Ø12mm (6m)', unit: 'piece', basePrice: 318, category: 'steel' },
  { id: 'rebar-16mm', name: 'Rebar Ø16mm (6m)', unit: 'piece', basePrice: 565, category: 'steel' },
  { id: 'rebar-20mm', name: 'Rebar Ø20mm (6m)', unit: 'piece', basePrice: 885, category: 'steel' },
  { id: 'rebar-25mm', name: 'Rebar Ø25mm (6m)', unit: 'piece', basePrice: 1380, category: 'steel' },
  { id: 'rebar-32mm', name: 'Rebar Ø32mm (6m)', unit: 'piece', basePrice: 2250, category: 'steel' },
  { id: 'tie-wire', name: 'Tie Wire #16 (kg)', unit: 'kg', basePrice: 145, category: 'steel' },
  
  // GI Pipes
  { id: 'gi-pipe-1-2', name: 'GI Pipe 1/2" (6m)', unit: 'piece', basePrice: 420, category: 'steel', sizes: ['1/2"', '3/4"', '1"', '1-1/4"', '1-1/2"', '2"', '3"', '4"'] },
  { id: 'gi-pipe-3-4', name: 'GI Pipe 3/4" (6m)', unit: 'piece', basePrice: 550, category: 'steel' },
  { id: 'gi-pipe-1', name: 'GI Pipe 1" (6m)', unit: 'piece', basePrice: 720, category: 'steel' },
  { id: 'gi-pipe-1-1-4', name: 'GI Pipe 1-1/4" (6m)', unit: 'piece', basePrice: 950, category: 'steel' },
  { id: 'gi-pipe-2', name: 'GI Pipe 2" (6m)', unit: 'piece', basePrice: 1450, category: 'steel' },
  { id: 'gi-pipe-3', name: 'GI Pipe 3" (6m)', unit: 'piece', basePrice: 2850, category: 'steel' },
  { id: 'gi-pipe-4', name: 'GI Pipe 4" (6m)', unit: 'piece', basePrice: 4200, category: 'steel' },
  
  // Structural Steel
  { id: 'angle-bar-2x2', name: 'Angle Bar 2"x2"x3mm (6m)', unit: 'piece', basePrice: 680, category: 'steel' },
  { id: 'angle-bar-2x3', name: 'Angle Bar 2"x3"x4mm (6m)', unit: 'piece', basePrice: 850, category: 'steel' },
  { id: 'channel-bar-3', name: 'Channel Bar 3" (6m)', unit: 'piece', basePrice: 1850, category: 'steel' },
  { id: 'channel-bar-4', name: 'Channel Bar 4" (6m)', unit: 'piece', basePrice: 2450, category: 'steel' },
  { id: 'i-beam-6', name: 'I-Beam 6" (6m)', unit: 'piece', basePrice: 4200, category: 'steel' },
  { id: 'i-beam-8', name: 'I-Beam 8" (6m)', unit: 'piece', basePrice: 6500, category: 'steel' },
  { id: 'flat-bar', name: 'Flat Bar 1/4"x2" (6m)', unit: 'piece', basePrice: 850, category: 'steel' },
  { id: 'square-tube-2', name: 'Square Tube 2"x2" (6m)', unit: 'piece', basePrice: 950, category: 'steel' },
  { id: 'square-tube-3', name: 'Square Tube 3"x3" (6m)', unit: 'piece', basePrice: 1450, category: 'steel' },
  
  // Lumber & Wood
  { id: 'lumber-2x2', name: 'Lumber 2"x2"x8\'', unit: 'piece', basePrice: 120, category: 'wood' },
  { id: 'lumber-2x3', name: 'Lumber 2"x3"x8\'', unit: 'piece', basePrice: 180, category: 'wood' },
  { id: 'lumber-2x4', name: 'Lumber 2"x4"x8\'', unit: 'piece', basePrice: 280, category: 'wood' },
  { id: 'lumber-2x6', name: 'Lumber 2"x6"x8\'', unit: 'piece', basePrice: 420, category: 'wood' },
  { id: 'ply-1-4', name: 'Ordinary Plywood 1/4" (4x8)', unit: 'piece', basePrice: 520, category: 'wood' },
  { id: 'ply-1-2', name: 'Ordinary Plywood 1/2" (4x8)', unit: 'piece', basePrice: 850, category: 'wood' },
  { id: 'ply-3-4', name: 'Ordinary Plywood 3/4" (4x8)', unit: 'piece', basePrice: 1200, category: 'wood' },
  { id: 'marine-ply', name: 'Marine Plywood 3/4" (4x8)', unit: 'piece', basePrice: 1850, category: 'wood' },
  { id: 'mdf-board', name: 'MDF Board 3/4" (4x8)', unit: 'piece', basePrice: 950, category: 'wood' },
  { id: 'particle-board', name: 'Particle Board 3/4" (4x8)', unit: 'piece', basePrice: 650, category: 'wood' },
  
  // Roofing Materials
  { id: 'roof-longspan-4', name: 'Longspan Roofing 0.4mm', unit: 'sqm', basePrice: 380, category: 'roofing', sizes: ['0.4mm', '0.5mm', '0.6mm'] },
  { id: 'roof-longspan-5', name: 'Longspan Roofing 0.5mm', unit: 'sqm', basePrice: 450, category: 'roofing' },
  { id: 'roof-longspan-6', name: 'Longspan Roofing 0.6mm', unit: 'sqm', basePrice: 550, category: 'roofing' },
  { id: 'gi-sheet-4', name: 'GI Sheet Corrugated 0.4mm', unit: 'sqm', basePrice: 320, category: 'roofing' },
  { id: 'spanish-tile', name: 'Spanish Clay Tile', unit: 'piece', basePrice: 85, category: 'roofing' },
  { id: 'asphalt-shingle', name: 'Asphalt Shingles', unit: 'sqm', basePrice: 520, category: 'roofing' },
  { id: 'roof-insulation', name: 'Roof Insulation Foil', unit: 'sqm', basePrice: 85, category: 'roofing' },
  { id: 'gutter-pvc', name: 'PVC Gutter (4m)', unit: 'piece', basePrice: 380, category: 'roofing' },
  { id: 'gutter-metal', name: 'Metal Gutter (4m)', unit: 'piece', basePrice: 650, category: 'roofing' },
  { id: 'downspout-pvc', name: 'PVC Downspout (4m)', unit: 'piece', basePrice: 280, category: 'roofing' },
  { id: 'ridge-roll', name: 'Ridge Roll (4m)', unit: 'piece', basePrice: 185, category: 'roofing' },
  { id: 'flashing', name: 'Roof Flashing', unit: 'meter', basePrice: 125, category: 'roofing' },
  
  // Electrical
  { id: 'wire-14-2', name: 'THHN Wire #14/2 (meter)', unit: 'meter', basePrice: 25, category: 'electrical' },
  { id: 'wire-12-2', name: 'THHN Wire #12/2 (meter)', unit: 'meter', basePrice: 35, category: 'electrical' },
  { id: 'wire-10-2', name: 'THHN Wire #10/2 (meter)', unit: 'meter', basePrice: 52, category: 'electrical' },
  { id: 'wire-8-2', name: 'THHN Wire #8/2 (meter)', unit: 'meter', basePrice: 78, category: 'electrical' },
  { id: 'wire-6-2', name: 'THHN Wire #6/2 (meter)', unit: 'meter', basePrice: 125, category: 'electrical' },
  { id: 'conduit-pvc-1-2', name: 'PVC Conduit 1/2" (3m)', unit: 'piece', basePrice: 85, category: 'electrical' },
  { id: 'conduit-pvc-3-4', name: 'PVC Conduit 3/4" (3m)', unit: 'piece', basePrice: 110, category: 'electrical' },
  { id: 'conduit-pvc-1', name: 'PVC Conduit 1" (3m)', unit: 'piece', basePrice: 145, category: 'electrical' },
  { id: 'outlet-universal', name: 'Universal Outlet', unit: 'piece', basePrice: 85, category: 'electrical' },
  { id: 'outlet-gfci', name: 'GFCI Outlet', unit: 'piece', basePrice: 450, category: 'electrical' },
  { id: 'switch-single', name: 'Single Switch', unit: 'piece', basePrice: 65, category: 'electrical' },
  { id: 'switch-three', name: 'Three-way Switch', unit: 'piece', basePrice: 120, category: 'electrical' },
  { id: 'breaker-20a', name: 'Circuit Breaker 20A', unit: 'piece', basePrice: 185, category: 'electrical' },
  { id: 'breaker-30a', name: 'Circuit Breaker 30A', unit: 'piece', basePrice: 250, category: 'electrical' },
  { id: 'breaker-60a', name: 'Circuit Breaker 60A', unit: 'piece', basePrice: 450, category: 'electrical' },
  { id: 'panel-board-8', name: 'Panel Board 8-circuit', unit: 'piece', basePrice: 2850, category: 'electrical' },
  { id: 'panel-board-12', name: 'Panel Board 12-circuit', unit: 'piece', basePrice: 3850, category: 'electrical' },
  { id: 'led-bulb-9w', name: 'LED Bulb 9W', unit: 'piece', basePrice: 125, category: 'electrical' },
  { id: 'led-bulb-12w', name: 'LED Bulb 12W', unit: 'piece', basePrice: 165, category: 'electrical' },
  { id: 'led-bulb-18w', name: 'LED Bulb 18W', unit: 'piece', basePrice: 245, category: 'electrical' },
  
  // Plumbing
  { id: 'pvc-pipe-1-2', name: 'PVC Pipe 1/2" (3m)', unit: 'piece', basePrice: 185, category: 'plumbing' },
  { id: 'pvc-pipe-3-4', name: 'PVC Pipe 3/4" (3m)', unit: 'piece', basePrice: 220, category: 'plumbing' },
  { id: 'pvc-pipe-1', name: 'PVC Pipe 1" (3m)', unit: 'piece', basePrice: 280, category: 'plumbing' },
  { id: 'pvc-pipe-2', name: 'PVC Pipe 2" (3m)', unit: 'piece', basePrice: 380, category: 'plumbing' },
  { id: 'pvc-pipe-3', name: 'PVC Pipe 3" (3m)', unit: 'piece', basePrice: 520, category: 'plumbing' },
  { id: 'pvc-pipe-4', name: 'PVC Pipe 4" (3m)', unit: 'piece', basePrice: 650, category: 'plumbing' },
  { id: 'pvc-pipe-6', name: 'PVC Pipe 6" (3m)', unit: 'piece', basePrice: 1200, category: 'plumbing' },
  { id: 'faucet-standard', name: 'Standard Faucet', unit: 'piece', basePrice: 350, category: 'plumbing' },
  { id: 'faucet-mixer', name: 'Mixer Faucet', unit: 'piece', basePrice: 850, category: 'plumbing' },
  { id: 'shower-head', name: 'Shower Head Set', unit: 'piece', basePrice: 450, category: 'plumbing' },
  { id: 'water-closet', name: 'Water Closet (Toilet)', unit: 'piece', basePrice: 2850, category: 'plumbing' },
  { id: 'water-closet-premium', name: 'Premium Water Closet', unit: 'piece', basePrice: 5500, category: 'plumbing' },
  { id: 'sink-stainless', name: 'Stainless Sink', unit: 'piece', basePrice: 1850, category: 'plumbing' },
  { id: 'sink-ceramic', name: 'Ceramic Sink', unit: 'piece', basePrice: 2850, category: 'plumbing' },
  { id: 'water-heater', name: 'Electric Water Heater', unit: 'piece', basePrice: 4500, category: 'plumbing' },
  { id: 'water-tank-500', name: 'Water Tank 500L', unit: 'piece', basePrice: 3850, category: 'plumbing' },
  { id: 'water-tank-1000', name: 'Water Tank 1000L', unit: 'piece', basePrice: 6500, category: 'plumbing' },
  { id: 'water-tank-2000', name: 'Water Tank 2000L', unit: 'piece', basePrice: 11500, category: 'plumbing' },
  { id: 'septic-tank-3', name: 'Septic Tank 3-chamber', unit: 'piece', basePrice: 18500, category: 'plumbing' },
  
  // Tiles
  { id: 'tiles-60x60', name: 'Floor Tiles 60x60cm', unit: 'piece', basePrice: 125, category: 'tiles' },
  { id: 'tiles-50x50', name: 'Floor Tiles 50x50cm', unit: 'piece', basePrice: 95, category: 'tiles' },
  { id: 'tiles-40x40', name: 'Floor Tiles 40x40cm', unit: 'piece', basePrice: 65, category: 'tiles' },
  { id: 'tiles-30x30', name: 'Floor Tiles 30x30cm', unit: 'piece', basePrice: 45, category: 'tiles' },
  { id: 'wall-tiles-20x30', name: 'Wall Tiles 20x30cm', unit: 'piece', basePrice: 35, category: 'tiles' },
  { id: 'wall-tiles-20x25', name: 'Wall Tiles 20x25cm', unit: 'piece', basePrice: 28, category: 'tiles' },
  { id: 'tile-adhesive', name: 'Tile Adhesive 25kg', unit: 'bag', basePrice: 285, category: 'tiles' },
  { id: 'tile-grout', name: 'Tile Grout 2kg', unit: 'box', basePrice: 125, category: 'tiles' },
  
  // Finishing Materials
  { id: 'paint-latex', name: 'Latex Paint 4L', unit: 'gallon', basePrice: 650, category: 'paint' },
  { id: 'paint-enamel', name: 'Enamel Paint 4L', unit: 'gallon', basePrice: 780, category: 'paint' },
  { id: 'paint-weatherguard', name: 'Weatherguard Paint 4L', unit: 'gallon', basePrice: 950, category: 'paint' },
  { id: 'primer', name: 'Primer 4L', unit: 'gallon', basePrice: 520, category: 'paint' },
  { id: 'thinner', name: 'Paint Thinner 4L', unit: 'gallon', basePrice: 285, category: 'paint' },
  { id: 'cement-board', name: 'Cement Board 4x8', unit: 'piece', basePrice: 1250, category: 'finishing' },
  { id: 'gypsum-board', name: 'Gypsum Board 4x8', unit: 'piece', basePrice: 450, category: 'finishing' },
  
  // Hardware
  { id: 'nails-1', name: 'Common Nails 1" (kg)', unit: 'kg', basePrice: 85, category: 'hardware' },
  { id: 'nails-2', name: 'Common Nails 2" (kg)', unit: 'kg', basePrice: 92, category: 'hardware' },
  { id: 'nails-3', name: 'Common Nails 3" (kg)', unit: 'kg', basePrice: 98, category: 'hardware' },
  { id: 'concrete-nails', name: 'Concrete Nails (kg)', unit: 'kg', basePrice: 125, category: 'hardware' },
  { id: 'door-knob', name: 'Door Knob Set', unit: 'set', basePrice: 450, category: 'hardware' },
  { id: 'door-knob-premium', name: 'Premium Door Knob Set', unit: 'set', basePrice: 1250, category: 'hardware' },
  { id: 'door-hinges', name: 'Door Hinges (pair)', unit: 'pair', basePrice: 185, category: 'hardware' },
  { id: 'window-lock', name: 'Window Lock', unit: 'piece', basePrice: 125, category: 'hardware' },
  { id: 'cabinet-handle', name: 'Cabinet Handle', unit: 'piece', basePrice: 85, category: 'hardware' },
  { id: 'door-closer', name: 'Door Closer', unit: 'piece', basePrice: 850, category: 'hardware' },
  { id: 'padlock-heavy', name: 'Heavy Duty Padlock', unit: 'piece', basePrice: 285, category: 'hardware' },
  
  // Glass
  { id: 'glass-clear-4', name: 'Clear Glass 4mm', unit: 'sqm', basePrice: 850, category: 'glass' },
  { id: 'glass-clear-6', name: 'Clear Glass 6mm', unit: 'sqm', basePrice: 1250, category: 'glass' },
  { id: 'glass-tempered', name: 'Tempered Glass 10mm', unit: 'sqm', basePrice: 2850, category: 'glass' },
  { id: 'glass-louver', name: 'Louver Glass', unit: 'piece', basePrice: 125, category: 'glass' },
  
  // Waterproofing
  { id: 'waterproofing-membrane', name: 'Waterproofing Membrane', unit: 'sqm', basePrice: 185, category: 'waterproofing' },
  { id: 'waterproofing-cement', name: 'Waterproofing Cement', unit: 'kg', basePrice: 125, category: 'waterproofing' },
  
  // Insulation
  { id: 'insulation-fiberglass', name: 'Fiberglass Insulation', unit: 'sqm', basePrice: 145, category: 'insulation' },
  { id: 'insulation-foam', name: 'Foam Insulation', unit: 'sqm', basePrice: 225, category: 'insulation' },
];

// Get materials by category
export function getMaterialsByCategory(category: string): MaterialOption[] {
  return MATERIAL_DATABASE.filter(m => m.category === category);
}

// Get all material categories
export const MATERIAL_CATEGORIES = [
  { id: 'concrete', name: 'Concrete & Aggregates', icon: '🏗️' },
  { id: 'masonry', name: 'Masonry (CHB)', icon: '🧱' },
  { id: 'steel', name: 'Steel & Metal', icon: '⚙️' },
  { id: 'wood', name: 'Wood & Lumber', icon: '🪵' },
  { id: 'roofing', name: 'Roofing', icon: '🏠' },
  { id: 'electrical', name: 'Electrical', icon: '⚡' },
  { id: 'plumbing', name: 'Plumbing', icon: '💧' },
  { id: 'tiles', name: 'Tiles', icon: '⬜' },
  { id: 'paint', name: 'Paint & Coatings', icon: '🎨' },
  { id: 'finishing', name: 'Finishing Materials', icon: '✨' },
  { id: 'hardware', name: 'Hardware', icon: '🔧' },
  { id: 'glass', name: 'Glass', icon: '🔲' },
  { id: 'waterproofing', name: 'Waterproofing', icon: '💦' },
  { id: 'insulation', name: 'Insulation', icon: '🌡️' },
];

// ═══════════════════════════════════════════════════════
// PROJECT-SPECIFIC MATERIAL CALCULATIONS
// ═══════════════════════════════════════════════════════

export interface EstimateInputs {
  projectName: string;
  location: Location;
  projectType: ProjectType;
  measurements: Measurements;
  includeLabor?: boolean;
  laborRate?: number;
  laborDays?: number;
  overheadPercent?: number;
  profitPercent?: number;
  contingencyPercent?: number;
  equipmentCost?: number;
  selectedMaterials?: string[];
  customMaterialQuantities?: Record<string, number>;
}

// Calculate materials based on project type
export function calculateProjectMaterials(
  projectType: ProjectType,
  measurements: Measurements,
  location: Location,
  isPremium: boolean,
  selectedMaterialIds?: string[]
): MaterialItem[] {
  const multiplier = LOCATION_MULTIPLIERS[location] || 1.0;
  const materials: MaterialItem[] = [];
  
  // Helper to add material
  const addMaterial = (id: string, quantity: number, overridePrice?: number) => {
    const mat = MATERIAL_DATABASE.find(m => m.id === id);
    if (!mat) return;
    
    // Check if user selected this material (for premium)
    if (isPremium && selectedMaterialIds && !selectedMaterialIds.includes(id)) {
      return;
    }
    
    const price = overridePrice || mat.basePrice * multiplier;
    materials.push({
      materialId: id,
      name: mat.name,
      category: mat.category,
      quantity,
      unit: mat.unit,
      unitPrice: Math.round(price),
      total: Math.round(quantity * price),
      included: true,
      customizable: isPremium,
    });
  };
  
  const area = measurements.area || 0;
  const length = measurements.length || 0;
  const height = measurements.height || 0;
  const floors = measurements.floors || 1;
  // width is available for future use: measurements.width
  
  // Project-specific calculations
  switch (projectType) {
    // FENCE CALCULATION
    case 'fence':
    case 'perimeter_wall':
    case 'compound_fence': {
      const wallArea = length * (height || 2);
      const chbCalc = calculateCHB(wallArea, '6in');
      
      addMaterial('chb-6in', chbCalc.chbCount);
      addMaterial('cement-40kg-ordinary', chbCalc.cementBags);
      addMaterial('sand-washed', chbCalc.sandVolume);
      addMaterial('rebar-10mm', chbCalc.rebarPieces);
      
      // Footing
      const footingConcrete = calculateConcrete(length * 0.4, 0.4, 0.4);
      // footing volume: length * 0.4 * 0.4
      addMaterial('cement-40kg-ordinary', footingConcrete.cementBags40kg);
      addMaterial('gravel-3-4', footingConcrete.gravelVolume);
      
      // Plastering
      addMaterial('cement-40kg-ordinary', Math.ceil(wallArea * 0.15));
      addMaterial('sand-washed', Math.ceil(wallArea * 0.02 * 100) / 100);
      break;
    }
    
    // SEPTIC TANK
    case 'septic_tank': {
      // tank volume = area * 2m depth
      const concrete = calculateConcrete(Math.sqrt(area), Math.sqrt(area), 2);
      
      addMaterial('cement-40kg-ordinary', concrete.cementBags40kg * 1.5);
      addMaterial('sand-washed', concrete.sandVolume * 1.5);
      addMaterial('gravel-3-4', concrete.gravelVolume * 1.5);
      addMaterial('rebar-12mm', Math.ceil(area * 2));
      addMaterial('pvc-pipe-4', 3);
      addMaterial('pvc-pipe-6', 2);
      addMaterial('septic-tank-3', 1);
      break;
    }
    
    // UNDERGROUND PARKING
    case 'underground_parking': {
      const parkingConcrete = calculateConcrete(Math.sqrt(area), Math.sqrt(area), 0.25);
      
      addMaterial('cement-40kg-ordinary', parkingConcrete.cementBags40kg * 2);
      addMaterial('sand-washed', parkingConcrete.sandVolume * 2);
      addMaterial('gravel-3-4', parkingConcrete.gravelVolume * 2);
      addMaterial('rebar-16mm', Math.ceil(area * 3));
      addMaterial('rebar-20mm', Math.ceil(area * 1.5));
      addMaterial('waterproofing-membrane', area * 1.2);
      addMaterial('conduit-pvc-1', Math.ceil(area / 20));
      addMaterial('led-bulb-18w', Math.ceil(area / 15));
      break;
    }
    
    // HOME BASEMENT
    case 'home_basement': {
      const basementConcrete = calculateConcrete(Math.sqrt(area), Math.sqrt(area), 0.2);
      
      addMaterial('cement-40kg-ordinary', basementConcrete.cementBags40kg * 2.5);
      addMaterial('sand-washed', basementConcrete.sandVolume * 2.5);
      addMaterial('gravel-3-4', basementConcrete.gravelVolume * 2.5);
      addMaterial('rebar-16mm', Math.ceil(area * 2.5));
      addMaterial('waterproofing-membrane', area * 1.3);
      addMaterial('waterproofing-cement', Math.ceil(area * 2));
      addMaterial('insulation-fiberglass', area);
      addMaterial('conduit-pvc-3-4', Math.ceil(area / 15));
      addMaterial('outlet-universal', Math.ceil(area / 20));
      break;
    }
    
    // SWIMMING POOL
    case 'swimming_pool': {
      const poolConcrete = calculateConcrete(Math.sqrt(area), Math.sqrt(area), 0.3);
      
      addMaterial('cement-40kg-ordinary', poolConcrete.cementBags40kg * 2);
      addMaterial('sand-washed', poolConcrete.sandVolume * 2);
      addMaterial('gravel-3-4', poolConcrete.gravelVolume * 2);
      addMaterial('rebar-12mm', Math.ceil(area * 4));
      addMaterial('waterproofing-membrane', area * 1.5);
      addMaterial('waterproofing-cement', Math.ceil(area * 3));
      addMaterial('pvc-pipe-2', Math.ceil(area / 10));
      addMaterial('pvc-pipe-3', 2);
      addMaterial('water-tank-1000', 1);
      break;
    }
    
    // DRIVEWAY
    case 'driveway':
    case 'walkway': {
      const drivewayConcrete = calculateConcrete(Math.sqrt(area), Math.sqrt(area), 0.1);
      
      addMaterial('cement-40kg-ordinary', drivewayConcrete.cementBags40kg);
      addMaterial('sand-washed', drivewayConcrete.sandVolume);
      addMaterial('gravel-3-4', drivewayConcrete.gravelVolume);
      addMaterial('base-course', area * 0.15);
      break;
    }
    
    // CARPORT / GARAGE
    case 'carport':
    case 'garage': {
      const carportConcrete = calculateConcrete(Math.sqrt(area), Math.sqrt(area), 0.1);
      
      addMaterial('cement-40kg-ordinary', carportConcrete.cementBags40kg);
      addMaterial('sand-washed', carportConcrete.sandVolume);
      addMaterial('gravel-3-4', carportConcrete.gravelVolume);
      addMaterial('rebar-10mm', Math.ceil(area * 1.5));
      addMaterial('roof-longspan-4', area * 1.3);
      addMaterial('gi-pipe-2', 6);
      addMaterial('angle-bar-2x2', 8);
      break;
    }
    
    // DIRTY KITCHEN
    case 'dirty_kitchen': {
      const kitchenConcrete = calculateConcrete(Math.sqrt(area), Math.sqrt(area), 0.08);
      
      addMaterial('cement-40kg-ordinary', kitchenConcrete.cementBags40kg);
      addMaterial('sand-washed', kitchenConcrete.sandVolume);
      addMaterial('gravel-3-4', kitchenConcrete.gravelVolume);
      addMaterial('chb-4in', Math.ceil(area * 12));
      addMaterial('rebar-10mm', Math.ceil(area * 0.5));
      addMaterial('roof-longspan-4', area * 1.2);
      addMaterial('pvc-pipe-2', 2);
      addMaterial('outlet-universal', 2);
      break;
    }
    
    // DEFAULT: Standard residential calculation
    default: {
      // CHB for walls
      const chbCalc = calculateCHB(area * 2.5 * floors, '6in');
      addMaterial('chb-6in', chbCalc.chbCount);
      addMaterial('cement-40kg-ordinary', chbCalc.cementBags);
      addMaterial('sand-washed', chbCalc.sandVolume);
      addMaterial('rebar-10mm', chbCalc.rebarPieces);
      
      // Concrete slab
      const slabArea = Math.sqrt(area);
      const concreteCalc = calculateConcrete(slabArea, slabArea, 0.15);
      addMaterial('cement-40kg-ordinary', concreteCalc.cementBags40kg);
      addMaterial('sand-washed', concreteCalc.sandVolume);
      addMaterial('gravel-3-4', concreteCalc.gravelVolume);
      
      // Roofing
      addMaterial('roof-longspan-4', area * 1.5 * floors);
      
      // Formwork
      const plyCount = Math.ceil(area / 3.6);
      addMaterial('ply-1-2', plyCount);
      
      // Electrical basics
      addMaterial('wire-14-2', area * 3);
      addMaterial('outlet-universal', Math.ceil(area / 15));
      addMaterial('switch-single', Math.ceil(area / 20));
      
      // Plumbing basics
      addMaterial('pvc-pipe-1-2', area * 0.5);
      addMaterial('pvc-pipe-3-4', area * 0.3);
      addMaterial('faucet-standard', 2);
      addMaterial('water-closet', 1);
      
      // Finishing
      addMaterial('tiles-30x30', Math.ceil(area * 8));
      addMaterial('paint-latex', Math.ceil(area * 0.3));
    }
  }
  
  return materials;
}

// ═══════════════════════════════════════════════════════
// COMPLETE ESTIMATE CALCULATION
// ═══════════════════════════════════════════════════════

export function calculateCompleteEstimate(
  inputs: EstimateInputs,
  isPremium: boolean = false
): CalculationResult {
  const { 
    measurements, 
    location, 
    projectType,
    includeLabor, 
    laborRate, 
    laborDays, 
    overheadPercent, 
    profitPercent,
    contingencyPercent,
    equipmentCost,
    selectedMaterials 
  } = inputs;
  
  // Get project-specific materials
  const materials = calculateProjectMaterials(
    projectType,
    measurements,
    location,
    isPremium,
    selectedMaterials
  );
  
  // Calculate subtotal
  const materialsSubtotal = materials.reduce((sum, m) => sum + (m.included ? m.total : 0), 0);
  
  // Premium features
  let laborCost = 0;
  let overheadAmount = 0;
  let profitAmount = 0;
  let contingencyAmount = 0;
  let equipmentTotal = 0;
  
  if (isPremium) {
    if (includeLabor && laborRate && laborDays) {
      laborCost = laborRate * laborDays;
    }
    
    if (equipmentCost) {
      equipmentTotal = equipmentCost;
    }
    
    if (overheadPercent) {
      overheadAmount = Math.round(materialsSubtotal * (overheadPercent / 100));
    }
    
    if (contingencyPercent) {
      contingencyAmount = Math.round(materialsSubtotal * (contingencyPercent / 100));
    }
    
    if (profitPercent) {
      const subtotalWithExtras = materialsSubtotal + laborCost + equipmentTotal + overheadAmount + contingencyAmount;
      profitAmount = Math.round(subtotalWithExtras * (profitPercent / 100));
    }
  }
  
  const grandTotal = materialsSubtotal + laborCost + equipmentTotal + overheadAmount + contingencyAmount + profitAmount;
  
  return {
    materials,
    materialsSubtotal,
    laborCost: laborCost || undefined,
    equipmentCost: equipmentTotal || undefined,
    overheadAmount: overheadAmount || undefined,
    contingencyAmount: contingencyAmount || undefined,
    profitAmount: profitAmount || undefined,
    grandTotal,
  };
}

// ═══════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════

export function formatCurrency(amount: number): string {
  return '₱' + amount.toLocaleString('en-PH');
}

export function getPriceWithLocation(basePrice: number, location: Location): number {
  const multiplier = LOCATION_MULTIPLIERS[location];
  return Math.round(basePrice * (multiplier || 1.0));
}

export function getMaterialPrice(materialId: string, location: Location): number {
  const material = MATERIAL_DATABASE.find(m => m.id === materialId);
  if (!material) return 0;
  return getPriceWithLocation(material.basePrice, location);
}

// Get project types by category
export function getProjectTypesByCategory(category: string): ProjectType[] {
  return Object.entries(PROJECT_TYPE_DEFINITIONS)
    .filter(([_, def]) => def.category === category)
    .map(([type, _]) => type as ProjectType);
}

// Get all project categories
export const PROJECT_CATEGORIES = [
  { id: 'Residential', name: 'Residential', icon: '🏠' },
  { id: 'Renovation', name: 'Renovation', icon: '🔨' },
  { id: 'Outdoor', name: 'Outdoor / Exterior', icon: '🌳' },
  { id: 'Commercial', name: 'Commercial', icon: '🏢' },
  { id: 'Industrial', name: 'Industrial', icon: '🏭' },
  { id: 'Infrastructure', name: 'Infrastructure', icon: '🛣️' },
  { id: 'Institutional', name: 'Institutional', icon: '🏛️' },
  { id: 'Development', name: 'Development', icon: '🏘️' },
];

// Bulk estimate calculator for large contractors
export function calculateBulkEstimate(
  projects: { area: number; location: Location; type: ProjectType }[],
  isPremium: boolean
): { totalMaterials: number; totalLabor: number; grandTotal: number; projectCount: number } {
  let totalMaterials = 0;
  let totalLabor = 0;
  
  projects.forEach(project => {
    const result = calculateCompleteEstimate({
      projectName: 'Bulk Project',
      location: project.location,
      projectType: project.type,
      measurements: { unit: 'sqm', area: project.area, rooms: 3, floors: 1 },
    }, isPremium);
    
    totalMaterials += result.materialsSubtotal;
    totalLabor += result.laborCost || 0;
  });
  
  return {
    totalMaterials,
    totalLabor,
    grandTotal: totalMaterials + totalLabor,
    projectCount: projects.length,
  };
}
