// Gravitas Construction Estimator - Screen 3: Estimate Builder
// PREMIUM MATERIAL SELECTION FREEDOM

import { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  MapPin, 
  Home, 
  Ruler, 
  X,
  Save,
  FileDown,
  Lock,
  Info,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Plus,
  Minus,
  Search,
  Trash2,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { createEstimate } from '@/lib/firebase';
import { 
  calculateCompleteEstimate, 
  formatCurrency,
  type EstimateInputs,
  MATERIAL_DATABASE,
  MATERIAL_CATEGORIES,
  PROJECT_TYPE_DEFINITIONS
} from '@/lib/calculations';
import type { User, Location, ProjectType } from '@/types';

interface EstimateBuilderScreenProps {
  user: User;
  onSave: () => void;
  onCancel: () => void;
}

// All 82 provinces grouped by region
const LOCATIONS: { value: Location; label: string; region: string }[] = [
  { value: 'metro_manila', label: 'Metro Manila', region: 'NCR' },
  { value: 'cavite', label: 'Cavite', region: 'CALABARZON' },
  { value: 'laguna', label: 'Laguna', region: 'CALABARZON' },
  { value: 'batangas', label: 'Batangas', region: 'CALABARZON' },
  { value: 'rizal', label: 'Rizal', region: 'CALABARZON' },
  { value: 'quezon', label: 'Quezon', region: 'CALABARZON' },
  { value: 'bataan', label: 'Bataan', region: 'Central Luzon' },
  { value: 'bulacan', label: 'Bulacan', region: 'Central Luzon' },
  { value: 'pampanga', label: 'Pampanga', region: 'Central Luzon' },
  { value: 'tarlac', label: 'Tarlac', region: 'Central Luzon' },
  { value: 'zambales', label: 'Zambales', region: 'Central Luzon' },
  { value: 'nueva_ecija', label: 'Nueva Ecija', region: 'Central Luzon' },
  { value: 'aurora', label: 'Aurora', region: 'Central Luzon' },
  { value: 'ilocos_norte', label: 'Ilocos Norte', region: 'Ilocos' },
  { value: 'ilocos_sur', label: 'Ilocos Sur', region: 'Ilocos' },
  { value: 'la_union', label: 'La Union', region: 'Ilocos' },
  { value: 'pangasinan', label: 'Pangasinan', region: 'Ilocos' },
  { value: 'cagayan', label: 'Cagayan', region: 'Cagayan Valley' },
  { value: 'isabela', label: 'Isabela', region: 'Cagayan Valley' },
  { value: 'nueva_vizcaya', label: 'Nueva Vizcaya', region: 'Cagayan Valley' },
  { value: 'quirino', label: 'Quirino', region: 'Cagayan Valley' },
  { value: 'batanes', label: 'Batanes', region: 'Cagayan Valley' },
  { value: 'baguio', label: 'Baguio', region: 'CAR' },
  { value: 'benguet', label: 'Benguet', region: 'CAR' },
  { value: 'mountain_province', label: 'Mountain Province', region: 'CAR' },
  { value: 'ifugao', label: 'Ifugao', region: 'CAR' },
  { value: 'abra', label: 'Abra', region: 'CAR' },
  { value: 'kalinga', label: 'Kalinga', region: 'CAR' },
  { value: 'apayao', label: 'Apayao', region: 'CAR' },
  { value: 'marinduque', label: 'Marinduque', region: 'MIMAROPA' },
  { value: 'occidental_mindoro', label: 'Occidental Mindoro', region: 'MIMAROPA' },
  { value: 'oriental_mindoro', label: 'Oriental Mindoro', region: 'MIMAROPA' },
  { value: 'palawan', label: 'Palawan', region: 'MIMAROPA' },
  { value: 'romblon', label: 'Romblon', region: 'MIMAROPA' },
  { value: 'albay', label: 'Albay', region: 'Bicol' },
  { value: 'camarines_norte', label: 'Camarines Norte', region: 'Bicol' },
  { value: 'camarines_sur', label: 'Camarines Sur', region: 'Bicol' },
  { value: 'catanduanes', label: 'Catanduanes', region: 'Bicol' },
  { value: 'masbate', label: 'Masbate', region: 'Bicol' },
  { value: 'sorsogon', label: 'Sorsogon', region: 'Bicol' },
  { value: 'aklan', label: 'Aklan', region: 'Western Visayas' },
  { value: 'antique', label: 'Antique', region: 'Western Visayas' },
  { value: 'capiz', label: 'Capiz', region: 'Western Visayas' },
  { value: 'guimaras', label: 'Guimaras', region: 'Western Visayas' },
  { value: 'iloilo', label: 'Iloilo', region: 'Western Visayas' },
  { value: 'negros_occidental', label: 'Negros Occidental', region: 'Western Visayas' },
  { value: 'bohol', label: 'Bohol', region: 'Central Visayas' },
  { value: 'cebu', label: 'Cebu', region: 'Central Visayas' },
  { value: 'negros_oriental', label: 'Negros Oriental', region: 'Central Visayas' },
  { value: 'siquijor', label: 'Siquijor', region: 'Central Visayas' },
  { value: 'biliran', label: 'Biliran', region: 'Eastern Visayas' },
  { value: 'eastern_samar', label: 'Eastern Samar', region: 'Eastern Visayas' },
  { value: 'leyte', label: 'Leyte', region: 'Eastern Visayas' },
  { value: 'northern_samar', label: 'Northern Samar', region: 'Eastern Visayas' },
  { value: 'samar', label: 'Samar', region: 'Eastern Visayas' },
  { value: 'southern_leyte', label: 'Southern Leyte', region: 'Eastern Visayas' },
  { value: 'zamboanga_del_norte', label: 'Zamboanga del Norte', region: 'Zamboanga' },
  { value: 'zamboanga_del_sur', label: 'Zamboanga del Sur', region: 'Zamboanga' },
  { value: 'zamboanga_sibugay', label: 'Zamboanga Sibugay', region: 'Zamboanga' },
  { value: 'bukidnon', label: 'Bukidnon', region: 'Northern Mindanao' },
  { value: 'camiguin', label: 'Camiguin', region: 'Northern Mindanao' },
  { value: 'lanao_del_norte', label: 'Lanao del Norte', region: 'Northern Mindanao' },
  { value: 'misamis_occidental', label: 'Misamis Occidental', region: 'Northern Mindanao' },
  { value: 'misamis_oriental', label: 'Misamis Oriental', region: 'Northern Mindanao' },
  { value: 'davao_de_oro', label: 'Davao de Oro', region: 'Davao' },
  { value: 'davao_del_norte', label: 'Davao del Norte', region: 'Davao' },
  { value: 'davao_del_sur', label: 'Davao del Sur', region: 'Davao' },
  { value: 'davao_occidental', label: 'Davao Occidental', region: 'Davao' },
  { value: 'davao_oriental', label: 'Davao Oriental', region: 'Davao' },
  { value: 'cotabato', label: 'Cotabato', region: 'SOCCSKSARGEN' },
  { value: 'sarangani', label: 'Sarangani', region: 'SOCCSKSARGEN' },
  { value: 'south_cotabato', label: 'South Cotabato', region: 'SOCCSKSARGEN' },
  { value: 'sultan_kudarat', label: 'Sultan Kudarat', region: 'SOCCSKSARGEN' },
  { value: 'agusan_del_norte', label: 'Agusan del Norte', region: 'Caraga' },
  { value: 'agusan_del_sur', label: 'Agusan del Sur', region: 'Caraga' },
  { value: 'dinagat_islands', label: 'Dinagat Islands', region: 'Caraga' },
  { value: 'surigao_del_norte', label: 'Surigao del Norte', region: 'Caraga' },
  { value: 'surigao_del_sur', label: 'Surigao del Sur', region: 'Caraga' },
  { value: 'basilan', label: 'Basilan', region: 'BARMM' },
  { value: 'lanao_del_sur', label: 'Lanao del Sur', region: 'BARMM' },
  { value: 'maguindanao', label: 'Maguindanao', region: 'BARMM' },
  { value: 'sulu', label: 'Sulu', region: 'BARMM' },
  { value: 'tawi_tawi', label: 'Tawi-Tawi', region: 'BARMM' },
];

export function EstimateBuilderScreen({ user, onSave, onCancel }: EstimateBuilderScreenProps) {
  // Form state
  const [projectName, setProjectName] = useState('');
  const [location, setLocation] = useState<Location>('metro_manila');
  const [projectType, setProjectType] = useState<ProjectType>('bungalow');
  const [area, setArea] = useState(50);
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [rooms, setRooms] = useState(3);
  const [floors, setFloors] = useState(1);
  
  // Premium options
  const [includeLabor, setIncludeLabor] = useState(false);
  const [laborRate, setLaborRate] = useState(500);
  const [laborDays, setLaborDays] = useState(15);
  const [equipmentCost, setEquipmentCost] = useState(0);
  const [overheadPercent, setOverheadPercent] = useState(10);
  const [profitPercent, setProfitPercent] = useState(15);
  const [contingencyPercent, setContingencyPercent] = useState(5);
  
  // Material selection (Premium feature)
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());
  const [showMaterialSelector, setShowMaterialSelector] = useState(false);
  const [materialSearch, setMaterialSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [customQuantities, setCustomQuantities] = useState<Record<string, number>>({});
  
  // Results
  const [calculation, setCalculation] = useState<ReturnType<typeof calculateCompleteEstimate> | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPremiumSection, setShowPremiumSection] = useState(false);

  const isPremium = user.tier === 'premium';
  const isStandard = user.tier === 'standard';

  // Get project type info
  const projectTypeInfo = PROJECT_TYPE_DEFINITIONS[projectType];

  // Auto-calculate area from length × width when both are provided
  useEffect(() => {
    if (length > 0 && width > 0) {
      const calculatedArea = Math.round(length * width);
      if (calculatedArea !== area) {
        setArea(calculatedArea);
      }
    }
  }, [length, width]);

  // Calculate estimate whenever inputs change
  useEffect(() => {
    const inputs: EstimateInputs = {
      projectName: projectName || 'Untitled Project',
      location,
      projectType,
      measurements: {
        unit: 'sqm',
        area,
        length: length || undefined,
        width: width || undefined,
        height: height || undefined,
        rooms,
        floors,
      },
      includeLabor: isPremium && includeLabor,
      laborRate,
      laborDays,
      equipmentCost: isPremium ? equipmentCost : 0,
      overheadPercent: isPremium ? overheadPercent : 0,
      profitPercent: isPremium ? profitPercent : 0,
      contingencyPercent: isPremium ? contingencyPercent : 0,
      selectedMaterials: isPremium && selectedMaterials.size > 0 ? Array.from(selectedMaterials) : undefined,
      customMaterialQuantities: isPremium ? customQuantities : undefined,
    };

    try {
      const result = calculateCompleteEstimate(inputs, isPremium);
      setCalculation(result);
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error('Error calculating estimate. Please check your inputs.');
    }
  }, [projectName, location, projectType, area, length, width, height, rooms, floors, includeLabor, laborRate, laborDays, equipmentCost, overheadPercent, profitPercent, contingencyPercent, selectedMaterials, customQuantities, isPremium]);

  // Filtered materials for selector
  const filteredMaterials = useMemo(() => {
    let materials = MATERIAL_DATABASE;
    
    if (activeCategory) {
      materials = materials.filter(m => m.category === activeCategory);
    }
    
    if (materialSearch) {
      const search = materialSearch.toLowerCase();
      materials = materials.filter(m => 
        m.name.toLowerCase().includes(search) || 
        m.category.toLowerCase().includes(search)
      );
    }
    
    return materials;
  }, [materialSearch, activeCategory]);

  const toggleMaterial = (materialId: string) => {
    const newSelected = new Set(selectedMaterials);
    if (newSelected.has(materialId)) {
      newSelected.delete(materialId);
    } else {
      newSelected.add(materialId);
    }
    setSelectedMaterials(newSelected);
  };

  const updateCustomQuantity = (materialId: string, quantity: number) => {
    setCustomQuantities(prev => ({ ...prev, [materialId]: quantity }));
  };

  const handleSave = async () => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    if (!calculation) {
      toast.error('Calculation error. Please try again.');
      return;
    }

    setSaving(true);
    
    try {
      await createEstimate({
        userId: user.uid,
        projectName: projectName.trim(),
        location,
        projectType,
        measurements: {
          unit: 'sqm',
          area,
          length: length || undefined,
          width: width || undefined,
          height: height || undefined,
          rooms,
          floors,
        },
        materials: calculation.materials.map(m => ({ ...m, included: true })),
        excludedMaterials: isPremium ? Array.from(selectedMaterials) : undefined,
        laborCost: calculation.laborCost,
        equipmentCost: calculation.equipmentCost,
        overheadPercent: isPremium ? overheadPercent : undefined,
        profitPercent: isPremium ? profitPercent : undefined,
        contingencyPercent: isPremium ? contingencyPercent : undefined,
        materialsSubtotal: calculation.materialsSubtotal,
        grandTotal: calculation.grandTotal,
        isOfflineCreated: false,
        status: 'saved',
      });

      toast.success('Estimate saved successfully!');
      onSave();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save estimate. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    if (!isPremium) {
      toast.error('PDF export is a Premium feature');
      return;
    }
    toast.success('PDF export coming soon!');
  };

  // Check if project type is allowed for user's tier
  const isProjectTypeAllowed = (type: ProjectType) => {
    const def = PROJECT_TYPE_DEFINITIONS[type];
    if (!def) return false;
    
    if (def.tier === 'free') return true;
    if (def.tier === 'standard') return isStandard || isPremium;
    if (def.tier === 'premium') return isPremium;
    return false;
  };

  // Group project types by category
  const projectTypesByCategory = useMemo(() => {
    const grouped: Record<string, ProjectType[]> = {};
    
    Object.entries(PROJECT_TYPE_DEFINITIONS).forEach(([type, def]) => {
      if (!grouped[def.category]) {
        grouped[def.category] = [];
      }
      grouped[def.category].push(type as ProjectType);
    });
    
    return grouped;
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Disclaimer Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800">
                <strong>Disclaimer:</strong> This tool provides material cost estimates only. 
                Actual requirements may vary based on site conditions and design specifications. 
                Please consult a licensed professional for final project planning.
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">New Estimate</h1>
            <p className="text-slate-500">Calculate material costs for your project</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Estimate'}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g., House in Quezon City"
                    className="mt-1"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </Label>
                    <select
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value as Location)}
                      className="w-full mt-1 h-10 px-3 rounded-md border border-input bg-background"
                    >
                      {Object.entries(
                        LOCATIONS.reduce((acc, loc) => {
                          if (!acc[loc.region]) acc[loc.region] = [];
                          acc[loc.region].push(loc);
                          return acc;
                        }, {} as Record<string, typeof LOCATIONS>)
                      ).map(([region, locations]) => (
                        <optgroup key={region} label={region}>
                          {locations.map((loc) => (
                            <option key={loc.value} value={loc.value}>
                              {loc.label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="projectType" className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Project Type
                    </Label>
                    <select
                      id="projectType"
                      value={projectType}
                      onChange={(e) => {
                        const newType = e.target.value as ProjectType;
                        setProjectType(newType);
                        // Update default measurements
                        const defaults = PROJECT_TYPE_DEFINITIONS[newType]?.defaultMeasurements;
                        if (defaults) {
                          if (defaults.area) setArea(defaults.area);
                          if (defaults.rooms) setRooms(defaults.rooms);
                          if (defaults.floors) setFloors(defaults.floors);
                          if (defaults.length) setLength(defaults.length || 0);
                          if (defaults.height) setHeight(defaults.height || 0);
                        }
                      }}
                      className="w-full mt-1 h-10 px-3 rounded-md border border-input bg-background"
                    >
                      {Object.entries(projectTypesByCategory).map(([category, types]) => (
                        <optgroup key={category} label={`${category} (${types.length})`}>
                          {types.map((type) => {
                            const def = PROJECT_TYPE_DEFINITIONS[type];
                            const allowed = isProjectTypeAllowed(type);
                            return (
                              <option 
                                key={type} 
                                value={type}
                                disabled={!allowed}
                              >
                                {def.name} {!allowed ? `(${def.tier})` : ''}
                              </option>
                            );
                          })}
                        </optgroup>
                      ))}
                    </select>
                    {projectTypeInfo && !isProjectTypeAllowed(projectType) && (
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Upgrade to {projectTypeInfo.tier} to access this project type
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Measurements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-blue-600" />
                  Measurements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="area" className="flex items-center gap-2">
                      Area (sqm)
                      {length > 0 && width > 0 && (
                        <span className="text-xs text-blue-600">(auto: L×W)</span>
                      )}
                    </Label>
                    <Input
                      id="area"
                      type="number"
                      value={area}
                      onChange={(e) => setArea(Number(e.target.value))}
                      min={1}
                      className={`mt-1 ${length > 0 && width > 0 ? 'bg-blue-50' : ''}`}
                    />
                  </div>
                  <div>
                    <Label htmlFor="length">Length (m)</Label>
                    <Input
                      id="length"
                      type="number"
                      value={length || ''}
                      onChange={(e) => setLength(Number(e.target.value))}
                      placeholder="Enter length"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="width">Width (m)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={width || ''}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      placeholder="Enter width"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (m)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={height || ''}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      placeholder="For walls/fences"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rooms">Rooms</Label>
                    <Input
                      id="rooms"
                      type="number"
                      value={rooms}
                      onChange={(e) => setRooms(Number(e.target.value))}
                      min={1}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="floors">Floors</Label>
                    <Input
                      id="floors"
                      type="number"
                      value={floors}
                      onChange={(e) => setFloors(Number(e.target.value))}
                      min={1}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PREMIUM: Material Selector */}
            {isPremium && (
              <Card>
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => setShowMaterialSelector(!showMaterialSelector)}
                >
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      Custom Material Selection
                      <Badge className="bg-amber-500">PREMIUM</Badge>
                    </div>
                    {showMaterialSelector ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </CardTitle>
                </CardHeader>
                
                {showMaterialSelector && (
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">
                      Select specific materials for your project. Leave empty to use auto-calculated materials.
                    </p>
                    
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        placeholder="Search materials..."
                        value={materialSearch}
                        onChange={(e) => setMaterialSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveCategory(null)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          activeCategory === null 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        All
                      </button>
                      {MATERIAL_CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-colors flex items-center gap-1 ${
                            activeCategory === cat.id 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span>{cat.icon}</span>
                          {cat.name}
                        </button>
                      ))}
                    </div>
                    
                    {/* Materials List */}
                    <div className="max-h-80 overflow-y-auto border rounded-lg">
                      {filteredMaterials.map((material) => (
                        <div 
                          key={material.id}
                          className={`flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-slate-50 transition-colors ${
                            selectedMaterials.has(material.id) ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedMaterials.has(material.id)}
                              onCheckedChange={() => toggleMaterial(material.id)}
                            />
                            <div>
                              <p className="font-medium text-slate-900">{material.name}</p>
                              <p className="text-xs text-slate-500">
                                {material.category} • ₱{material.basePrice}/{material.unit}
                              </p>
                            </div>
                          </div>
                          {selectedMaterials.has(material.id) && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateCustomQuantity(material.id, (customQuantities[material.id] || 1) - 1)}
                                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center font-medium">
                                {customQuantities[material.id] || 1}
                              </span>
                              <button
                                onClick={() => updateCustomQuantity(material.id, (customQuantities[material.id] || 1) + 1)}
                                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {selectedMaterials.size > 0 && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm text-blue-700">
                          {selectedMaterials.size} materials selected
                        </span>
                        <button
                          onClick={() => { setSelectedMaterials(new Set()); setCustomQuantities({}); }}
                          className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Clear All
                        </button>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )}

            {/* Premium Section */}
            <Card className={!isPremium ? 'opacity-75' : ''}>
              <CardHeader 
                className="cursor-pointer"
                onClick={() => isPremium && setShowPremiumSection(!showPremiumSection)}
              >
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!isPremium && <Lock className="w-4 h-4 text-amber-500" />}
                    <span className={!isPremium ? 'text-slate-500' : ''}>
                      Cost Breakdown Options
                    </span>
                    {isPremium && <Badge className="bg-amber-500">PREMIUM</Badge>}
                  </div>
                  {isPremium && (showPremiumSection ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />)}
                </CardTitle>
              </CardHeader>
              
              {isPremium && showPremiumSection && (
                <CardContent className="space-y-6">
                  {/* Labor */}
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="includeLabor"
                      checked={includeLabor}
                      onCheckedChange={(checked) => setIncludeLabor(checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="includeLabor" className="font-medium">
                        Include Labor Costs
                      </Label>
                      
                      {includeLabor && (
                        <div className="grid sm:grid-cols-2 gap-4 mt-3">
                          <div>
                            <Label className="text-sm text-slate-500">Daily Rate (₱)</Label>
                            <Input
                              type="number"
                              value={laborRate}
                              onChange={(e) => setLaborRate(Number(e.target.value))}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm text-slate-500">Man-Days</Label>
                            <Input
                              type="number"
                              value={laborDays}
                              onChange={(e) => setLaborDays(Number(e.target.value))}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Equipment */}
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      Equipment Cost
                      <Info className="w-4 h-4 text-slate-400" />
                    </Label>
                    <Input
                      type="number"
                      value={equipmentCost}
                      onChange={(e) => setEquipmentCost(Number(e.target.value))}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>

                  {/* Sliders */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="flex items-center gap-2">
                          Overhead (%)
                          <Info className="w-4 h-4 text-slate-400" />
                        </Label>
                        <span className="text-sm font-medium">{overheadPercent}%</span>
                      </div>
                      <Slider
                        value={[overheadPercent]}
                        onValueChange={(value) => setOverheadPercent(value[0])}
                        min={0}
                        max={30}
                        step={1}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="flex items-center gap-2">
                          Contingency (%)
                          <Info className="w-4 h-4 text-slate-400" />
                        </Label>
                        <span className="text-sm font-medium">{contingencyPercent}%</span>
                      </div>
                      <Slider
                        value={[contingencyPercent]}
                        onValueChange={(value) => setContingencyPercent(value[0])}
                        min={0}
                        max={20}
                        step={1}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="flex items-center gap-2">
                          Profit Margin (%)
                          <Info className="w-4 h-4 text-slate-400" />
                        </Label>
                        <span className="text-sm font-medium">{profitPercent}%</span>
                      </div>
                      <Slider
                        value={[profitPercent]}
                        onValueChange={(value) => setProfitPercent(value[0])}
                        min={0}
                        max={50}
                        step={1}
                      />
                    </div>
                  </div>
                </CardContent>
              )}
              
              {!isPremium && (
                <CardContent>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-800">
                      Upgrade to Premium to unlock labor calculations, equipment costs, overhead, contingency, and profit margin controls.
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Right Column - Results */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {calculation && (
                  <div className="space-y-4">
                    {/* Project Type Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="text-xs">
                        {PROJECT_TYPE_DEFINITIONS[projectType]?.category}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {PROJECT_TYPE_DEFINITIONS[projectType]?.name}
                      </span>
                    </div>

                    {/* Materials List */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-2">
                        Materials ({calculation.materials.length} items)
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {calculation.materials.map((material) => (
                          <div 
                            key={material.materialId}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50"
                          >
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {material.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {material.quantity} {material.unit} × {formatCurrency(material.unitPrice)}
                              </p>
                            </div>
                            <span className="text-sm font-medium text-slate-900">
                              {formatCurrency(material.total)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600">Materials Subtotal</span>
                        <span className="font-medium">{formatCurrency(calculation.materialsSubtotal)}</span>
                      </div>

                      {/* Premium Line Items */}
                      {isPremium && includeLabor && calculation.laborCost && calculation.laborCost > 0 && (
                        <div className="flex items-center justify-between mb-2 text-blue-600">
                          <span>Labor ({laborDays} days @ {formatCurrency(laborRate)})</span>
                          <span className="font-medium">{formatCurrency(calculation.laborCost)}</span>
                        </div>
                      )}
                      
                      {isPremium && calculation.equipmentCost && calculation.equipmentCost > 0 && (
                        <div className="flex items-center justify-between mb-2 text-blue-600">
                          <span>Equipment</span>
                          <span className="font-medium">{formatCurrency(calculation.equipmentCost)}</span>
                        </div>
                      )}
                      
                      {isPremium && calculation.overheadAmount && calculation.overheadAmount > 0 && (
                        <div className="flex items-center justify-between mb-2 text-blue-600">
                          <span>Overhead ({overheadPercent}%)</span>
                          <span className="font-medium">{formatCurrency(calculation.overheadAmount)}</span>
                        </div>
                      )}
                      
                      {isPremium && calculation.contingencyAmount && calculation.contingencyAmount > 0 && (
                        <div className="flex items-center justify-between mb-2 text-amber-600">
                          <span>Contingency ({contingencyPercent}%)</span>
                          <span className="font-medium">{formatCurrency(calculation.contingencyAmount)}</span>
                        </div>
                      )}
                      
                      {isPremium && calculation.profitAmount && calculation.profitAmount > 0 && (
                        <div className="flex items-center justify-between mb-2 text-green-600">
                          <span>Profit ({profitPercent}%)</span>
                          <span className="font-medium">{formatCurrency(calculation.profitAmount)}</span>
                        </div>
                      )}

                      <div className="border-t border-slate-200 pt-4 mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-slate-900">Grand Total</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {formatCurrency(calculation.grandTotal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Export Button */}
                    <Button
                      onClick={handleExportPDF}
                      variant="outline"
                      className="w-full"
                      disabled={!isPremium}
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      Export PDF
                      {!isPremium && <Lock className="w-3 h-3 ml-2" />}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
