// Gravitas Construction Estimator - Admin Panel

import { useState, useEffect } from 'react';
import { 
  Users, 
  RefreshCw, 
  Search,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Package,
  FileText,
  TrendingUp,
  Activity,
  HardHat,
  Download,
  Settings,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { getAdminStats, ADMIN_USERNAME } from '@/lib/firebase';
import { MATERIAL_DATABASE, formatCurrency } from '@/lib/calculations';
import { SUPPORT_EMAIL } from '@/types';

// Mock price sources
const MOCK_PRICE_SOURCES: Record<string, { philcon: number; dpwh: number; pinoybuilders: number; manual: number }> = {
  'cement-40kg': { philcon: 240, dpwh: 230, pinoybuilders: 245, manual: 242 },
  'chb-6in': { philcon: 18, dpwh: 17, pinoybuilders: 19, manual: 18 },
  'rebar-10mm': { philcon: 221, dpwh: 215, pinoybuilders: 225, manual: 221 },
  'sand': { philcon: 5250, dpwh: 5100, pinoybuilders: 5350, manual: 5250 },
  'gravel-3-4': { philcon: 4800, dpwh: 4650, pinoybuilders: 4900, manual: 4800 },
};

// Mock scraping logs
const MOCK_SCRAPING_LOGS = [
  {
    id: 'log-1',
    scheduledTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    actualStart: new Date(Date.now() - 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
    completionStatus: 'success' as const,
    materialsUpdated: 47,
    materialsFailed: 3,
    durationSeconds: 1245,
  },
  {
    id: 'log-2',
    scheduledTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    actualStart: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 1000),
    completionStatus: 'partial' as const,
    materialsUpdated: 45,
    materialsFailed: 5,
    durationSeconds: 1567,
  },
];

// Mock recent subscriptions
const MOCK_SUBSCRIPTIONS = [
  { email: 'juan@email.com', tier: 'Standard', date: new Date(Date.now() - 24 * 60 * 60 * 1000), company: 'Juan Construction' },
  { email: 'maria@email.com', tier: 'Premium', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), company: 'Maria Builders' },
  { email: 'pedro@email.com', tier: 'Standard', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), company: 'Pedro Corp' },
  { email: 'santos.construction@email.com', tier: 'Premium', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), company: 'Santos Construction Inc.' },
];

export function AdminPanel() {
  const [stats, setStats] = useState({
    freeUsers: 127,
    standardUsers: 34,
    premiumUsers: 12,
    revenueThisMonth: 34932,
    totalEstimates: 456,
    activeToday: 28,
  });
  const [, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIAL_DATABASE[0]);
  const [manualPrice, setManualPrice] = useState('');
  const [scraping, setScraping] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const adminStats = await getAdminStats();
      setStats(adminStats);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const handleForceScrape = async () => {
    setScraping(true);
    toast.info('Starting price scraping...');
    
    // Simulate scraping
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast.success('Price scraping completed! 47 materials updated.');
    setScraping(false);
  };

  const handleSavePrice = () => {
    if (!manualPrice) {
      toast.error('Please enter a price');
      return;
    }
    toast.success(`Updated ${selectedMaterial.name} price to ₱${manualPrice}`);
    setManualPrice('');
  };

  const handleExportData = () => {
    toast.success('Data export started. You will receive an email when ready.');
  };

  const totalUsers = stats.freeUsers + stats.standardUsers + stats.premiumUsers;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
              <p className="text-slate-500">Manage prices, users, and system settings</p>
            </div>
          </div>
          <div className="mt-2 text-sm text-slate-500">
            Logged in as: <span className="font-medium text-slate-700">{ADMIN_USERNAME}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Free Users</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.freeUsers}</p>
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Standard Users</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.standardUsers}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <HardHat className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Premium Users</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.premiumUsers}</p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Revenue This Month</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.revenueThisMonth)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Estimates</p>
                  <p className="text-xl font-bold text-slate-900">{stats.totalEstimates}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Active Today</p>
                  <p className="text-xl font-bold text-slate-900">{stats.activeToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Users</p>
                  <p className="text-xl font-bold text-slate-900">{totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Price Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Price Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Material Selector */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  Select Material
                </label>
                <select
                  value={selectedMaterial.id}
                  onChange={(e) => {
                    const material = MATERIAL_DATABASE.find(m => m.id === e.target.value);
                    if (material) setSelectedMaterial(material);
                  }}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  {MATERIAL_DATABASE.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} - ₱{m.basePrice}/{m.unit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Sources */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-medium text-slate-700">Price Sources</h4>
                
                {MOCK_PRICE_SOURCES[selectedMaterial.id] ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">PhilconPrices</span>
                      <span className="font-medium">
                        {formatCurrency(MOCK_PRICE_SOURCES[selectedMaterial.id].philcon)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">DPWH Average</span>
                      <span className="font-medium">
                        {formatCurrency(MOCK_PRICE_SOURCES[selectedMaterial.id].dpwh)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">PinoyBuilders</span>
                      <span className="font-medium">
                        {formatCurrency(MOCK_PRICE_SOURCES[selectedMaterial.id].pinoybuilders)}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">No price data available for this material</p>
                )}

                <div className="border-t border-slate-200 pt-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Manual override"
                      value={manualPrice}
                      onChange={(e) => setManualPrice(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSavePrice} size="sm">
                      Save
                    </Button>
                  </div>
                </div>
              </div>

              {/* Scraping Status */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-slate-700">Scraping Status</h4>
                  <Button 
                    onClick={handleForceScrape} 
                    disabled={scraping}
                    size="sm"
                    variant="outline"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${scraping ? 'animate-spin' : ''}`} />
                    {scraping ? 'Scraping...' : 'Force Update'}
                  </Button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-slate-600">Last run: Jan 15 (Success)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-500" />
                    <span className="text-slate-600">Materials updated: 47/50</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-slate-600">Failed: 3 (retry scheduled)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by email or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Subscription Stats */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Subscription Distribution</h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Free</span>
                      <span className="font-medium">{stats.freeUsers} ({Math.round(stats.freeUsers/totalUsers*100)}%)</span>
                    </div>
                    <Progress value={(stats.freeUsers/totalUsers)*100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Standard</span>
                      <span className="font-medium">{stats.standardUsers} ({Math.round(stats.standardUsers/totalUsers*100)}%)</span>
                    </div>
                    <Progress value={(stats.standardUsers/totalUsers)*100} className="h-2 bg-blue-100" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Premium</span>
                      <span className="font-medium">{stats.premiumUsers} ({Math.round(stats.premiumUsers/totalUsers*100)}%)</span>
                    </div>
                    <Progress value={(stats.premiumUsers/totalUsers)*100} className="h-2 bg-amber-100" />
                  </div>
                </div>
              </div>

              {/* Recent Subscriptions */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-3">Recent Subscriptions</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {MOCK_SUBSCRIPTIONS.map((sub, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">{sub.company}</p>
                        <p className="text-xs text-slate-500">{sub.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={sub.tier === 'Premium' ? 'default' : 'secondary'}
                          className={sub.tier === 'Premium' ? 'bg-amber-500' : ''}
                        >
                          {sub.tier}
                        </Badge>
                        <p className="text-xs text-slate-400 mt-1">
                          {sub.date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scraping Logs */}
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Scraping Logs
            </CardTitle>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Updated</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Failed</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-700">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_SCRAPING_LOGS.map((log) => (
                    <tr key={log.id} className="border-b border-slate-100">
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {log.scheduledTime.toLocaleDateString('en-PH', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant={log.completionStatus === 'success' ? 'default' : 'secondary'}
                          className={log.completionStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}
                        >
                          {log.completionStatus === 'success' ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Success</>
                          ) : (
                            <><AlertCircle className="w-3 h-3 mr-1" /> Partial</>
                          )}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{log.materialsUpdated}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{log.materialsFailed}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {Math.floor(log.durationSeconds / 60)}m {log.durationSeconds % 60}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Support Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Support Email:</span>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="ml-2 text-blue-600 hover:underline">
                  {SUPPORT_EMAIL}
                </a>
              </div>
              <div>
                <span className="text-slate-500">Admin Username:</span>
                <span className="ml-2 font-medium">{ADMIN_USERNAME}</span>
              </div>
              <div>
                <span className="text-slate-500">Total Materials:</span>
                <span className="ml-2 font-medium">{MATERIAL_DATABASE.length}</span>
              </div>
              <div>
                <span className="text-slate-500">Version:</span>
                <span className="ml-2 font-medium">v1.0.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
