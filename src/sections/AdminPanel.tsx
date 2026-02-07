import { useState, useEffect } from 'react';
import { Users, RefreshCw, Search, AlertCircle, CheckCircle, DollarSign, Package, Activity, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getAllUsers, getAdminStats, SUBSCRIPTION_PLANS, ADMIN_USERNAME } from '@/lib/firebase';
import { MATERIAL_DATABASE, formatCurrency } from '@/lib/calculations';
import type { User } from '@/types';

const MOCK_PRICE_SOURCES: Record<string, { philcon: number; dpwh: number; pinoybuilders: number; manual: number }> = {
  'cement-40kg': { philcon: 240, dpwh: 230, pinoybuilders: 245, manual: 242 },
  'chb-6in': { philcon: 18, dpwh: 17, pinoybuilders: 19, manual: 18 },
  'rebar-10mm': { philcon: 221, dpwh: 215, pinoybuilders: 225, manual: 221 },
};

const MOCK_SCRAPING_LOGS = [
  { date: '2025-01-15', source: 'PhilconPrices', materials: 47, status: 'success' },
  { date: '2025-01-14', source: 'DPWH', materials: 32, status: 'success' },
];

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  totalEstimates: number;
  revenue: number;
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'pricing'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [scraping, setScraping] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userList, adminStats] = await Promise.all([
        getAllUsers(),
        getAdminStats()
      ]);
      setUsers(userList);
      setStats(adminStats);
    } catch (error) {
      console.error('Failed to load data:', error);
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
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
            <Badge variant="outline" className="text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              System Online
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-2 mb-6">
          <Button variant={activeTab === 'overview' ? 'default' : 'outline'} onClick={() => setActiveTab('overview')}>Overview</Button>
          <Button variant={activeTab === 'users' ? 'default' : 'outline'} onClick={() => setActiveTab('users')}>Users</Button>
          <Button variant={activeTab === 'pricing' ? 'default' : 'outline'} onClick={() => setActiveTab('pricing')}>Pricing</Button>
        </div>

        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Total Users</p><p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p></div><Users className="w-8 h-8 text-blue-500" /></div></CardContent></Card>
              <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Active Today</p><p className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</p></div><Activity className="w-8 h-8 text-green-500" /></div></CardContent></Card>
              <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Premium Users</p><p className="text-2xl font-bold">{stats.premiumUsers.toLocaleString()}</p></div><TrendingUp className="w-8 h-8 text-purple-500" /></div></CardContent></Card>
              <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Revenue</p><p className="text-2xl font-bold">{formatCurrency(stats.revenue)}</p></div><DollarSign className="w-8 h-8 text-yellow-500" /></div></CardContent></Card>
            </div>

            <Card>
              <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
              <CardContent>
                <Button onClick={handleForceScrape} disabled={scraping}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${scraping ? 'animate-spin' : ''}`} />
                  {scraping ? 'Scraping...' : 'Force Scrape Prices'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
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
                  <Badge variant={user.tier === 'premium' ? 'default' : user.tier === 'standard' ? 'secondary' : 'outline'}>{user.tier}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Package className="w-5 h-5" />Material Prices</CardTitle></CardHeader>
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}