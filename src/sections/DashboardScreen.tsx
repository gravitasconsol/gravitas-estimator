// Gravitas Construction Estimator - Screen 2: Dashboard

import { useState, useEffect } from 'react';
import { 
  Plus, 
  FileText, 
  TrendingUp, 
  AlertCircle,
  ChevronRight,
  Crown,
  Zap,
  Mail,
  Phone,
  HardHat,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getUserEstimates, deleteEstimate, SUBSCRIPTION_PLANS, CONTRACTOR_SCALES } from '@/lib/firebase';
import { SUPPORT_EMAIL } from '@/types';
import type { User, Estimate } from '@/types';
import { formatCurrency } from '@/lib/calculations';

interface DashboardScreenProps {
  user: User;
  onNewEstimate: () => void;
  onSubscribe: (tier: 'standard' | 'premium') => void;
}

export function DashboardScreen({ user, onNewEstimate, onSubscribe }: DashboardScreenProps) {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const plan = SUBSCRIPTION_PLANS[user.tier];
  const maxEstimates = plan.maxEstimates;
  const estimateCount = user.estimatesUsedThisMonth;
  const estimatePercentage = maxEstimates === 'unlimited' 
    ? 0 
    : Math.min((estimateCount / (maxEstimates as number)) * 100, 100);
  
  const nextResetDate = new Date(user.lastEstimateReset);
  nextResetDate.setMonth(nextResetDate.getMonth() + 1);
  
  const isNearLimit = maxEstimates !== 'unlimited' && estimateCount >= (maxEstimates as number) * 0.8;
  const isAtLimit = maxEstimates !== 'unlimited' && estimateCount >= (maxEstimates as number);

  useEffect(() => {
    loadEstimates();
  }, [user.uid]);

  const loadEstimates = async () => {
    try {
      const userEstimates = await getUserEstimates(user.uid);
      setEstimates(userEstimates.slice(0, 10)); // Show last 10
    } catch (error: any) {
      toast.error(error.message || 'Failed to load estimates');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    if (user.tier === 'free') {
      onSubscribe('standard');
    } else if (user.tier === 'standard') {
      onSubscribe('premium');
    }
  };

  const handleDeleteEstimate = async (estimateId: string) => {
    if (!confirm('Are you sure you want to delete this estimate?')) return;
    
    setDeleting(estimateId);
    try {
      await deleteEstimate(estimateId);
      setEstimates(estimates.filter(e => e.id !== estimateId));
      toast.success('Estimate deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete estimate');
    } finally {
      setDeleting(null);
    }
  };

  const totalValue = estimates.reduce((sum, e) => sum + e.grandTotal, 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user.displayName.split(' ')[0]}!
          </h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant={user.tier === 'premium' ? 'default' : 'secondary'} className="capitalize">
              {user.tier === 'premium' && <Crown className="w-3 h-3 mr-1" />}
              {user.tier} Plan
            </Badge>
            {maxEstimates !== 'unlimited' && (
              <span className="text-sm text-slate-500">
                {estimateCount}/{maxEstimates} estimates this month
              </span>
            )}
            {user.isAdmin && (
              <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                Admin
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Estimates</p>
                  <p className="text-xl font-bold text-slate-900">{estimates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Value</p>
                  <p className="text-xl font-bold text-slate-900">{formatCurrency(totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <HardHat className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Contractor Scale</p>
                  <p className="text-xl font-bold text-slate-900">
                    {CONTRACTOR_SCALES[user.tier === 'premium' ? 'conglomerate' : user.tier === 'standard' ? 'medium' : 'small'].name}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Card */}
        {maxEstimates !== 'unlimited' && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900">Usage This Month</h3>
                  <p className="text-sm text-slate-500">
                    Resets {nextResetDate.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-slate-900">{estimateCount}</span>
                  <span className="text-slate-500">/{maxEstimates}</span>
                </div>
              </div>
              
              <Progress 
                value={estimatePercentage} 
                className={`h-2 ${isNearLimit ? 'bg-red-100' : ''}`}
              />
              
              {isNearLimit && !isAtLimit && (
                <div className="flex items-center gap-2 mt-3 text-amber-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>You're approaching your monthly limit. Upgrade for more estimates.</span>
                </div>
              )}
              
              {isAtLimit && (
                <div className="flex items-center gap-2 mt-3 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>You've reached your monthly limit. Upgrade to create more estimates.</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Button 
            onClick={onNewEstimate}
            disabled={isAtLimit}
            className="h-16 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Estimate
          </Button>
          
          {user.tier !== 'premium' && (
            <Button 
              onClick={handleUpgrade}
              variant="outline"
              className="h-16 text-lg border-amber-500 text-amber-700 hover:bg-amber-50"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade to Premium
            </Button>
          )}
        </div>

        {/* Price Status */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Price Status</p>
                  <p className="text-sm text-slate-500">
                    Updated {new Date().toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Next update</p>
                <p className="font-medium text-slate-900">
                  {user.tier === 'free' && '1st of next month'}
                  {user.tier === 'standard' && '1st & 15th of month'}
                  {user.tier === 'premium' && 'Weekly (every 7 days)'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Estimates */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Recent Estimates</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-500">
                Loading estimates...
              </div>
            ) : estimates.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 mb-4">No estimates yet</p>
                <Button onClick={onNewEstimate} variant="outline">
                  Create your first estimate
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {estimates.map((estimate) => (
                  <div 
                    key={estimate.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{estimate.projectName}</p>
                      <p className="text-sm text-slate-500">
                        {estimate.measurements.area} sqm • {estimate.createdAt.toLocaleDateString('en-PH')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(estimate.grandTotal)}
                      </span>
                      <button
                        onClick={() => handleDeleteEstimate(estimate.id)}
                        disabled={deleting === estimate.id}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan Features Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Your Plan Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-sm text-slate-600">{feature}</span>
                </div>
              ))}
            </div>
            
            {plan.limitations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500 mb-2">Upgrade to unlock:</p>
                <div className="flex flex-wrap gap-2">
                  {plan.limitations.map((limitation, index) => (
                    <Badge key={index} variant="outline" className="text-slate-500">
                      {limitation}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Our support team is here to help you with any questions or issues.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href={`mailto:${SUPPORT_EMAIL}`}
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <Mail className="w-4 h-4" />
                {SUPPORT_EMAIL}
              </a>
              <a 
                href="tel:+6328XXXXXXX"
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <Phone className="w-4 h-4" />
                +63 (2) 8XXX-XXXX
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
