// Gravitas Construction Estimator - Main App Component
// Philippines Construction Cost Estimation App

import { useState, useEffect, Suspense } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { Button } from '@/components/ui/button';
import type { User, UserTier } from '@/types';
import { 
  onAuthStateChange, 
  updateUserTier,
  createSubscription,
  SUBSCRIPTION_PLANS,
  logout
} from '@/lib/firebase';
import { LandingScreen } from '@/sections/LandingScreen';
import { DashboardScreen } from '@/sections/DashboardScreen';
import { EstimateBuilderScreen } from '@/sections/EstimateBuilderScreen';
import { AdminPanel } from '@/sections/AdminPanel';
import { PaymentModal } from '@/components/PaymentModal';

export type AppScreen = 'landing' | 'dashboard' | 'estimate' | 'admin';

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<UserTier | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    try {
      unsubscribe = onAuthStateChange((currentUser) => {
        setUser(currentUser);
        setLoading(false);
        
        // Redirect based on auth state
        if (currentUser) {
          if (currentScreen === 'landing') {
            setCurrentScreen('dashboard');
          }
        } else {
          setCurrentScreen('landing');
        }
      });
    } catch (err) {
      console.error('Auth state error:', err);
      setError('Failed to initialize authentication. Please refresh the page.');
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentScreen]);

  const handleSubscribe = (tier: UserTier) => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }
    
    if (tier === 'free') {
      toast.info('You are already on the Free plan');
      return;
    }
    
    setSelectedTier(tier);
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async () => {
    if (!selectedTier || selectedTier === 'free') return;
    
    setProcessingPayment(true);
    
    try {
      // Call Firebase Cloud Function (simulated)
      await createSubscription(selectedTier);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user tier
      await updateUserTier(user!.uid, selectedTier);
      
      toast.success(`Welcome to ${SUBSCRIPTION_PLANS[selectedTier].name}!`);
      setShowPaymentModal(false);
      setCurrentScreen('dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleNewEstimate = () => {
    if (!user) {
      toast.error('Please sign in first');
      return;
    }
    
    // Check tier limits
    const plan = SUBSCRIPTION_PLANS[user.tier];
    const maxEstimates = plan.maxEstimates;
    
    if (maxEstimates !== 'unlimited' && user.estimatesUsedThisMonth >= maxEstimates) {
      toast.error(`You've reached your ${maxEstimates} estimate limit. Upgrade to create more.`);
      return;
    }
    
    setCurrentScreen('estimate');
  };

  const handleSaveEstimate = () => {
    toast.success('Estimate saved successfully!');
    setCurrentScreen('dashboard');
  };

  const handleGoToAdmin = () => {
    if (user?.isAdmin) {
      setCurrentScreen('admin');
    } else {
      toast.error('Admin access required');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      setCurrentScreen('landing');
    } catch (err: any) {
      toast.error(err.message || 'Logout failed');
    }
  };

  if (loading) {
    return <LoadingFallback />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Error</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-center" richColors />
      
      {/* Navigation Header */}
      {user && (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setCurrentScreen('dashboard')}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <span className="font-semibold text-slate-800 hidden sm:block">
                  Gravitas Estimator
                </span>
              </div>
              
              <nav className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentScreen('dashboard')}
                  className={`text-sm font-medium transition-colors ${
                    currentScreen === 'dashboard' 
                      ? 'text-blue-600' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={handleNewEstimate}
                  className={`text-sm font-medium transition-colors ${
                    currentScreen === 'estimate' 
                      ? 'text-blue-600' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  New Estimate
                </button>
                {user.isAdmin && (
                  <button
                    onClick={handleGoToAdmin}
                    className={`text-sm font-medium transition-colors ${
                      currentScreen === 'admin' 
                        ? 'text-blue-600' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Admin
                  </button>
                )}
              </nav>
              
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 hidden sm:block">
                  {user.tier === 'premium' && '⭐ '}
                  {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}
                </span>
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-slate-600 text-sm font-medium">
                    {user.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main>
        <Suspense fallback={<LoadingFallback />}>
          {currentScreen === 'landing' && (
            <LandingScreen 
              onSubscribe={handleSubscribe}
              user={user}
            />
          )}
          
          {currentScreen === 'dashboard' && user && (
            <DashboardScreen 
              user={user}
              onNewEstimate={handleNewEstimate}
              onSubscribe={handleSubscribe}
            />
          )}
          
          {currentScreen === 'estimate' && user && (
            <EstimateBuilderScreen 
              user={user}
              onSave={handleSaveEstimate}
              onCancel={() => setCurrentScreen('dashboard')}
            />
          )}
          
          {currentScreen === 'admin' && user?.isAdmin && (
            <AdminPanel />
          )}
        </Suspense>
      </main>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        tier={selectedTier}
        onConfirm={handlePaymentConfirm}
        processing={processingPayment}
      />
    </div>
  );
}

export default App;
