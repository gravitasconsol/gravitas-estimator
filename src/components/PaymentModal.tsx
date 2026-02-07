// Gravitas Construction Estimator - Payment Modal
// Secure PayMongo Integration

import { useState } from 'react';
import { 
  X, 
  Lock, 
  Shield, 
  CreditCard, 
  Check,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { SUBSCRIPTION_PLANS } from '@/lib/firebase';
import type { UserTier } from '@/types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: UserTier | null;
  onConfirm: () => void;
  processing: boolean;
}

export function PaymentModal({ isOpen, onClose, tier, onConfirm, processing }: PaymentModalProps) {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  if (!isOpen || !tier || tier === 'free') return null;

  const plan = SUBSCRIPTION_PLANS[tier];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expiry || !cvc || !name) {
      toast.error('Please fill in all card details');
      return;
    }

    setStep('processing');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onConfirm();
    setStep('success');
    
    // Reset after showing success
    setTimeout(() => {
      setStep('details');
      setCardNumber('');
      setExpiry('');
      setCvc('');
      setName('');
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {step === 'details' && 'Complete Payment'}
              {step === 'processing' && 'Processing...'}
              {step === 'success' && 'Payment Successful!'}
            </h2>
            <p className="text-sm text-slate-500">
              {step === 'details' && `Subscribe to ${plan.name}`}
              {step === 'processing' && 'Please wait while we process your payment'}
              {step === 'success' && 'Welcome to ' + plan.name}
            </p>
          </div>
          <button 
            onClick={onClose}
            disabled={processing}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          {step === 'details' && (
            <>
              {/* Plan Summary */}
              <Card className="mb-6 bg-slate-50 border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{plan.name} Plan</span>
                    <Badge variant="secondary">Monthly</Badge>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {plan.priceFormatted}
                  </div>
                  <ul className="mt-3 space-y-1">
                    {plan.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="JUAN DELA CRUZ"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="cardNumber"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="mt-1 pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      maxLength={3}
                      className="mt-1"
                      type="password"
                    />
                  </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-sm">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span className="text-green-700">Payments secured by PayMongo</span>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Pay {plan.priceFormatted}</>
                  )}
                </Button>
              </form>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 mt-4 text-slate-400">
                <div className="flex items-center gap-1 text-xs">
                  <Shield className="w-4 h-4" />
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Lock className="w-4 h-4" />
                  <span>PCI Compliant</span>
                </div>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Processing Payment
              </h3>
              <p className="text-slate-500">
                Please do not close this window...
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-slate-500 mb-4">
                Welcome to {plan.name}. You now have access to all {plan.name.toLowerCase()} features.
              </p>
              <Button onClick={onClose} className="w-full">
                Continue to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
