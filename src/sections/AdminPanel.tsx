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
import { getAllUsers, SUBSCRIPTION_PLANS } from '@/lib/firebase';
import { MATERIAL_DATABASE, formatCurrency } from '@/lib/calculations';
import type { User } from '@/types';

// Mock price sources
const MOCK_PRICE_SOURCES: Record<string, { philcon: number; dpwh: number; pinoybuilders: number; manual: number }> = {
  'cement-40kg': { philcon: 240, dpwh: 230, pinoybuilders: 245, manual: 242 },
  'chb-6in': { philcon: 18, dpwh: 17, pinoybuilders: 19, manual: 18 },
  'rebar-10mm': { philcon: 221, dpwh: 215, pinoybuilders: 225, manual: 221 },
  'sand': { philcon: 5250, dpwh: 5100, pinoybuilders: 5350, manual: 5250 },
  'gravel-3-4': { philcon: 4800, dpwh: 4650, pinoybuilders: 4900, manual: 4800 },
};

const MOCK_SCRAPING_LOGS = [
  { date: '2025-01-15', source: 'PhilconPrices', materials: 47, status: 'success' },
  { date: '2025-01-14', source: 'DPWH', materials: 32, status: 'success' },
  { date: '2025-01-13', source: 'PinoyBuilders', materials: 28, status: 'partial' },
  { date: '2025-01-12', source: 'Manual Update', materials: 15, status: 'success' },
];

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  totalEstimates: number;
  revenue: number;
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'pricing' | 'settings'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [scraping, setScraping] = useState(false);

  // Mock stats
  const stats: AdminStats = {
    totalUsers: 1247,
    activeUsers: 892,
    premiumUsers: 156,
    totalEstimates: 3421,
    revenue: 234567
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const userList = await getAllUsers();
      setUsers(userList);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForceScrape = async () => {
    setScraping(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    toast.success('Price scraping completed! 47 materials updated.');
    setScraping(false);
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Today</p>
                <p className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Premium Users</p>
                <p className="text-2xl font-bold">{stats.premiumUsers.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.revenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleForceScrape} disabled={scraping}>
              <RefreshCw className={`w-4 h-4 mr-2 ${scraping ? 'animate-spin' : ''}`} />
              {scraping ? 'Scraping...' : 'Force Scrape Prices'}
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export User Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Price Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_SCRAPING_LOGS.map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {log.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <div>
                    <p className="font-medium">{log.source}</p>
                    <p className="text-sm text-slate-500">{log.date}</p>
                  </div>
                </div>
                <Badge variant={log.status === 'success' ? 'default' : 'secondary'}>
                  {log.materials} materials
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        {filteredUsers.map((user) => (
          <div key={user.uid} className="flex items-center justify-between p-4 bg-white border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <span className="font-medium">{user.displayName?.[0] || 'U'}</span>
              </div>
              <div>
                <p className="font-medium">{user.displayName}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={user.tier === 'premium' ? 'default' : user.tier === 'standard' ? 'secondary' : 'outline'}>
                {user.tier}
              </Badge>
              {user.isAdmin && (
                <Badge variant="destructive">Admin</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="w-5 h-5" />
            Material Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(MOCK_PRICE_SOURCES).map(([key, prices]) => {
              const material = MATERIAL_DATABASE.find(m => m.id === key);
              if (!material) return null;
              return (
                <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">{material.name}</p>
                    <p className="text-sm text-slate-500">Base: {formatCurrency(material.basePrice)}</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-blue-600">Philcon: {formatCurrency(prices.philcon)}</span>
                    <span className="text-green-600">DPWH: {formatCurrency(prices.dpwh)}</span>
                    <span className="text-purple-600">PinoyBuilders: {formatCurrency(prices.pinoybuilders)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Panel</h1>
                <p className="text-sm text-slate-500">Gravitas Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                System Online
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
          >
            Users
          </Button>
          <Button
            variant={activeTab === 'pricing' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pricing')}
          >
            Pricing
          </Button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'pricing' && renderPricing()}
      </div>
    </div>
  );
}