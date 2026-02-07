// Gravitas Construction Estimator - Screen 1: Landing & Pricing
// Professional Filipino Contractor Tool

import { useState, useEffect } from 'react';
import { 
  Check, 
  Shield, 
  Building2, 
  Calculator, 
  TrendingUp, 
  Lock,
  Mail,
  Chrome,
  Facebook,
  User as UserIcon,
  Crown,
  Phone,
  MapPin,
  HardHat,
  Star,
  Award,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  signUpWithEmail, 
  loginWithEmail, 
  loginWithUsername,
  signInWithGoogle,
  signInWithFacebook,
  loginAsAdmin,
  SUBSCRIPTION_PLANS,
  CONTRACTOR_SCALES
} from '@/lib/firebase';
import { SUPPORT_EMAIL } from '@/types';
import type { User, UserTier, ContractorScale } from '@/types';

interface LandingScreenProps {
  onSubscribe: (tier: UserTier) => void;
  user: User | null;
}

// Mission statement data
const MISSION_POINTS = [
  {
    title: "End Lawballing",
    desc: "Transparent pricing eliminates undercutting that leads to tofu dreg construction and abandoned projects.",
    icon: Shield
  },
  {
    title: "Build to Last",
    desc: "Quality construction that stands for generations, not just until the next typhoon.",
    icon: Building2
  },
  {
    title: "Asset Appreciation",
    desc: "Properly built homes increase in value and can be passed down to future generations.",
    icon: TrendingUp
  },
  {
    title: "Flood Resilience",
    desc: "Better standards mean better drainage, stronger foundations, and homes that weather the storms.",
    icon: MapPin
  }
];

// Testimonials from Filipino contractors
const TESTIMONIALS = [
  {
    name: "Engr. Maria Santos",
    role: "Licensed Engineer",
    location: "Metro Manila",
    quote: "Accurate estimates every time. The location-based pricing keeps my bids competitive.",
    avatar: "MS"
  },
  {
    name: "Robert Tan",
    role: "Construction Firm Owner",
    location: "Davao",
    quote: "From small repairs to major projects, Gravitas has become essential for our business.",
    avatar: "RT"
  },
  {
    name: "Juan Dela Cruz",
    role: "Independent Contractor",
    location: "Cebu",
    quote: "The material calculations are spot on. I can now bid with confidence.",
    avatar: "JD"
  }
];

// Features for architects and engineers
const PRO_FEATURES = [
  {
    icon: Calculator,
    title: "60+ Project Types",
    desc: "From fences to underground parking, septic tanks to home basements"
  },
  {
    icon: TrendingUp,
    title: "200+ Materials",
    desc: "Full material library with sizes, grades, and alternatives"
  },
  {
    icon: MapPin,
    title: "82 Provinces Covered",
    desc: "Location-specific pricing from Batanes to Tawi-Tawi"
  },
  {
    icon: Shield,
    title: "Premium Freedom",
    desc: "Pick exact materials, sizes, brands - total control for paid users"
  }
];

// Project type examples
const PROJECT_EXAMPLES = [
  { name: "Fence & Gate", icon: "🚧", category: "Outdoor" },
  { name: "Septic Tank", icon: "🚽", category: "Infrastructure" },
  { name: "Underground Parking", icon: "🅿️", category: "Infrastructure" },
  { name: "Home Basement", icon: "🏠", category: "Residential" },
  { name: "Swimming Pool", icon: "🏊", category: "Outdoor" },
  { name: "Dirty Kitchen", icon: "🍳", category: "Outdoor" },
  { name: "Carport/Garage", icon: "🚗", category: "Outdoor" },
  { name: "Driveway", icon: "🛣️", category: "Outdoor" },
  { name: "Retaining Wall", icon: "🧱", category: "Outdoor" },
  { name: "Patio/Deck", icon: "🌳", category: "Outdoor" },
  { name: "Subdivision", icon: "🏘️", category: "Development" },
  { name: "Guard House", icon: "👮", category: "Outdoor" },
];

export function LandingScreen({ onSubscribe, user }: LandingScreenProps) {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'admin'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'username'>('email');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [contractorScale, setContractorScale] = useState<ContractorScale>('small');
  const [contactNumber, setContactNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({ users: 0, estimates: 0, provinces: 0 });

  // Animate stats on load
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedStats({
        users: Math.floor(173 * easeOut),
        estimates: Math.floor(1247 * easeOut),
        provinces: Math.floor(82 * easeOut),
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Welcome! Successfully logged in.');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    try {
      await signInWithFacebook();
      toast.success('Welcome! Successfully logged in.');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (authMode === 'signup') {
        await signUpWithEmail(email, password, displayName || email.split('@')[0], {
          companyName: companyName || undefined,
          contactNumber,
          address: '',
          scale: contractorScale,
        });
        toast.success('Account created successfully.');
      } else {
        await loginWithEmail(email, password);
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await loginWithUsername(username, password);
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error(error.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await loginAsAdmin(username, password);
      toast.success('Admin access granted!');
    } catch (error: any) {
      toast.error(error.message || 'Admin login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-white pattern-filipino">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Gravitas
                </h1>
                <p className="text-sm text-slate-500 font-medium">Construction Estimator</p>
              </div>
            </div>
          </div>

          {/* Animated Stats */}
          <div className="flex justify-center gap-8 mb-10 animate-fade-in stagger-1">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{animatedStats.users}+</p>
              <p className="text-xs text-slate-500">Contractors</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{animatedStats.estimates}+</p>
              <p className="text-xs text-slate-500">Estimates</p>
            </div>
            <div className="w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{animatedStats.provinces}</p>
              <p className="text-xs text-slate-500">Provinces</p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in stagger-2">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
              <Star className="w-3 h-3 mr-1" /> #1 Construction Estimator in the Philippines
            </Badge>
            
            <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Professional Construction{' '}
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Cost Estimation
              </span>
            </h2>
            
            <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Accurate material calculations and cost estimates for contractors, engineers, and architects across the Philippines.
            </p>
            
            {/* CTA Buttons */}
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuth(true);
                    setTimeout(() => {
                      document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                  }}
                  className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => { 
                    setAuthMode('admin'); 
                    setShowAuth(true);
                    setTimeout(() => {
                      document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                  }}
                  className="h-14 px-8 text-lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Admin
                </Button>
              </div>
            )}
          </div>

          {/* Mission Section */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white">
              <div className="text-center mb-10">
                <Badge className="mb-4 bg-white/10 text-white border-white/20">
                  Our Mission
                </Badge>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  Building a Better Standard
                </h3>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                  The Philippines deserves construction that lasts generations, not just until the next typhoon.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MISSION_POINTS.map((point, index) => (
                  <div 
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                  >
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                      <point.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{point.title}</h4>
                    <p className="text-sm text-slate-400">{point.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Auth Section */}
          {!user && showAuth && (
            <div id="auth-section" className="max-w-md mx-auto mb-20 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8">
                {/* Auth Mode Tabs */}
                {authMode !== 'admin' && (
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setAuthMode('signup')}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                        authMode === 'signup' 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={() => setAuthMode('login')}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                        authMode === 'login' 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Login
                    </button>
                  </div>
                )}

                {/* Admin Login Header */}
                {authMode === 'admin' && (
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Crown className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">Admin Access</h3>
                    <p className="text-sm text-slate-500">Restricted to authorized personnel</p>
                  </div>
                )}
                
                {/* Login Method Toggle */}
                {authMode === 'login' && (
                  <div className="flex gap-2 mb-4 p-1 bg-slate-100 rounded-lg">
                    <button
                      onClick={() => setLoginMethod('email')}
                      className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
                        loginMethod === 'email' 
                          ? 'bg-white text-slate-900 shadow-sm' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Mail className="w-3 h-3 inline mr-1" />
                      Email
                    </button>
                    <button
                      onClick={() => setLoginMethod('username')}
                      className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
                        loginMethod === 'username' 
                          ? 'bg-white text-slate-900 shadow-sm' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <UserIcon className="w-3 h-3 inline mr-1" />
                      Username
                    </button>
                  </div>
                )}

                {/* Social Login */}
                {authMode !== 'admin' && (
                  <div className="space-y-3 mb-6">
                    <Button
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      variant="outline"
                      className="w-full h-12"
                    >
                      <Chrome className="w-5 h-5 mr-2" />
                      Continue with Google
                    </Button>
                    <Button
                      onClick={handleFacebookSignIn}
                      disabled={loading}
                      variant="outline"
                      className="w-full h-12 bg-[#1877F2]/10 border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2]/20"
                    >
                      <Facebook className="w-5 h-5 mr-2" />
                      Continue with Facebook
                    </Button>
                  </div>
                )}
                
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">or</span>
                  </div>
                </div>
                
                {/* Forms */}
                {authMode === 'admin' ? (
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="adminUsername">Username</Label>
                      <Input
                        id="adminUsername"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter admin username"
                        required
                        className="h-12 mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="adminPassword">Password</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        required
                        className="h-12 mt-1"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    >
                      {loading ? 'Processing...' : 'Admin Login'}
                    </Button>
                  </form>
                ) : authMode === 'login' && loginMethod === 'username' ? (
                  <form onSubmit={handleUsernameAuth} className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                        className="h-12 mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="h-12 mt-1"
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-12">
                      {loading ? 'Processing...' : 'Login'}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleEmailAuth} className="space-y-4">
                    {authMode === 'signup' && (
                      <>
                        <div>
                          <Label htmlFor="displayName">Full Name</Label>
                          <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Juan Dela Cruz"
                            className="h-12 mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="companyName">Company Name (Optional)</Label>
                          <Input
                            id="companyName"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="Juan Construction Services"
                            className="h-12 mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactNumber">Contact Number</Label>
                          <Input
                            id="contactNumber"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            placeholder="09XX XXX XXXX"
                            className="h-12 mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contractorScale">Contractor Scale</Label>
                          <select
                            id="contractorScale"
                            value={contractorScale}
                            onChange={(e) => setContractorScale(e.target.value as ContractorScale)}
                            className="w-full mt-1 h-12 px-3 rounded-md border border-input bg-background"
                          >
                            {Object.entries(CONTRACTOR_SCALES).map(([key, scale]) => (
                              <option key={key} value={key}>
                                {scale.name}
                              </option>
                            ))}
                          </select>
                          <p className="text-xs text-slate-500 mt-1">
                            {CONTRACTOR_SCALES[contractorScale].description}
                          </p>
                        </div>
                      </>
                    )}
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="h-12 mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="h-12 mt-1"
                      />
                    </div>
                    
                    <Button type="submit" disabled={loading} className="w-full h-12">
                      {loading ? 'Processing...' : authMode === 'signup' ? 'Create Account' : 'Sign In'}
                    </Button>
                  </form>
                )}
                
                <button
                  onClick={() => { setShowAuth(false); setAuthMode('login'); setLoginMethod('email'); }}
                  className="w-full text-center text-sm text-slate-500 mt-4 hover:text-slate-700"
                >
                  ← Back to home
                </button>
              </div>
            </div>
          )}

          {/* Pro Features */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Bakit Gravitas?</Badge>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Built for Filipino Contractors
              </h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Designed with input from real contractors, architects, and engineers across the Philippines.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRO_FEATURES.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 card-hover animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-slate-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Project Types Showcase */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-green-100 text-green-700">
                <Zap className="w-3 h-3 mr-1" /> 60+ Project Types
              </Badge>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Lahat ng Kailangan Mo, Nandito
              </h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                From simple fences to complex underground parking - 
                estimate any project with precision.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {PROJECT_EXAMPLES.map((project, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 card-hover animate-fade-in text-center"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="text-3xl mb-2">{project.icon}</div>
                  <p className="font-medium text-slate-900 text-sm">{project.name}</p>
                  <p className="text-xs text-slate-500">{project.category}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-6">
              <p className="text-sm text-slate-500">
                And 50+ more project types including subdivisions, schools, hospitals, roads, bridges...
              </p>
            </div>
          </div>

          {/* Quality vs Lawball Comparison */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4">The Real Cost</Badge>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Why Lawballing Hurts Everyone
              </h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Cutting corners today means bigger problems tomorrow. Here's what happens when contractors underbid:
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Lawball Side */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">⚠️</span>
                  </div>
                  <h4 className="text-xl font-bold text-red-800">The Lawball Trap</h4>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <div>
                      <p className="font-medium text-red-900">Tofu Dreg Construction</p>
                      <p className="text-sm text-red-700">Weak materials that crumble under pressure</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <div>
                      <p className="font-medium text-red-900">Contractor Disappears</p>
                      <p className="text-sm text-red-700">Budget runs out, project abandoned</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <div>
                      <p className="font-medium text-red-900">Flood Vulnerability</p>
                      <p className="text-sm text-red-700">Poor drainage, weak foundations</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <div>
                      <p className="font-medium text-red-900">Zero Asset Value</p>
                      <p className="text-sm text-red-700">Property depreciates instead of appreciating</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              {/* Quality Side */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">✓</span>
                  </div>
                  <h4 className="text-xl font-bold text-green-800">Built to Last</h4>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <div>
                      <p className="font-medium text-green-900">Quality Materials</p>
                      <p className="text-sm text-green-700">Proper specs that meet standards</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <div>
                      <p className="font-medium text-green-900">Transparent Pricing</p>
                      <p className="text-sm text-green-700">Fair bids, completed projects</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <div>
                      <p className="font-medium text-green-900">Flood Resilient</p>
                      <p className="text-sm text-green-700">Strong foundations, proper drainage</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <div>
                      <p className="font-medium text-green-900">Generational Asset</p>
                      <p className="text-sm text-green-700">Property value increases over time</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contractor Scales */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                For All Contractor Sizes
              </h3>
              <p className="text-slate-600">From small teams to large firms</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(CONTRACTOR_SCALES).map(([key, scale], index) => (
                <div 
                  key={key}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 text-center card-hover animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20">
                    <HardHat className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">{scale.name}</h4>
                  <p className="text-xs text-slate-500 mb-3">{scale.description}</p>
                  <Badge variant="outline" className="text-xs bg-blue-50">
                    {SUBSCRIPTION_PLANS[scale.recommendedPlan as keyof typeof SUBSCRIPTION_PLANS].name}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="text-center mb-10">
              <Badge variant="outline" className="mb-4">Testimonials</Badge>
              <h3 className="text-2xl font-bold text-slate-900">
                Ano ang Sabi ng mga Contractor?
              </h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 card-hover animate-fade-in"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="text-xs text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-green-100 text-green-700">
                <Zap className="w-3 h-3 mr-1" /> Simple Pricing
              </Badge>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Pricing Plans
              </h3>
              <p className="text-slate-600">Choose the plan that fits your business</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden card-hover animate-fade-in">
                <div className="p-6">
                  <div className="text-sm font-medium text-slate-500 mb-2">FREE</div>
                  <div className="text-4xl font-bold text-slate-900 mb-1">₱0</div>
                  <div className="text-sm text-slate-500 mb-6">/month</div>
                  
                  <ul className="space-y-3 mb-6">
                    {SUBSCRIPTION_PLANS.free.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="px-6 pb-6">
                  <Button
                    onClick={() => onSubscribe('free')}
                    variant="outline"
                    className="w-full"
                    disabled={user?.tier === 'free'}
                  >
                    {user?.tier === 'free' ? 'Current Plan' : 'Start Free'}
                  </Button>
                </div>
              </div>

              {/* Standard Plan */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-500 overflow-hidden relative card-hover animate-fade-in stagger-1">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium px-4 py-1.5 rounded-bl-lg">
                  MOST POPULAR
                </div>
                
                <div className="p-6">
                  <div className="text-sm font-medium text-blue-600 mb-2">STANDARD</div>
                  <div className="text-4xl font-bold text-slate-900 mb-1">₱499</div>
                  <div className="text-sm text-slate-500 mb-6">/month</div>
                  
                  <ul className="space-y-3 mb-6">
                    {SUBSCRIPTION_PLANS.standard.features.slice(0, 5).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="px-6 pb-6">
                  <Button
                    onClick={() => onSubscribe('standard')}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/25"
                    disabled={user?.tier === 'standard'}
                  >
                    {user?.tier === 'standard' ? 'Current Plan' : 'Get Standard'}
                  </Button>
                </div>
              </div>

              {/* Premium Plan */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-xl overflow-hidden card-hover animate-fade-in stagger-2">
                <div className="p-6">
                  <div className="text-sm font-medium text-amber-400 mb-2">PREMIUM</div>
                  <div className="text-4xl font-bold text-white mb-1">₱1,499</div>
                  <div className="text-sm text-slate-400 mb-6">/month</div>
                  
                  <ul className="space-y-3 mb-6">
                    {SUBSCRIPTION_PLANS.premium.features.slice(0, 6).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <Check className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="px-6 pb-6">
                  <Button
                    onClick={() => onSubscribe('premium')}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/25"
                    disabled={user?.tier === 'premium'}
                  >
                    {user?.tier === 'premium' ? 'Current Plan' : 'Get Premium'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>PayMongo Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>DPWH-Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Section */}
      <div className="bg-amber-50 border-y border-amber-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 mb-2">Important Disclaimer</h4>
              <p className="text-sm text-amber-800 leading-relaxed">
                Gravitas Construction Estimator provides <strong>material cost estimates only</strong>. 
                All calculations are based on standard industry formulas and average market prices. 
                Actual material requirements and costs may vary depending on site conditions, 
                design specifications, and supplier pricing. We recommend consulting with a 
                licensed engineer or architect for final project specifications. 
                Gravitas is not liable for any discrepancies between estimates and actual project costs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white text-lg">Gravitas</span>
              </div>
              <p className="text-sm leading-relaxed">
                Professional construction cost estimation for contractors, engineers, and architects across the Philippines.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-white transition-colors">
                    {SUPPORT_EMAIL}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+63 (2) 8XXX-XXXX</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">
              © 2026 Gravitas Construction Estimator. All rights reserved.
            </p>
            <p className="text-sm">
              Made with ❤️ for Filipino contractors
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
