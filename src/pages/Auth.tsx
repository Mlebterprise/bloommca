import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Heart, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp && !acceptedTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      let result;
      
      if (isSignUp) {
        result = await signUp(formData.email, formData.password, formData.name);
        if (!result.error) {
          toast({
            title: "Welcome to Bloom! 🌸",
            description: "Please check your email to verify your account.",
          });
          setIsSignUp(false);
        }
      } else {
        result = await signIn(formData.email, formData.password);
        if (!result.error) {
          toast({
            title: "Welcome back! 💚",
            description: "You're successfully signed in.",
          });
          navigate('/');
        }
      }

      if (result.error) {
        let errorMessage = "An error occurred. Please try again.";
        
        if (result.error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password. Please check your credentials.";
        } else if (result.error.message.includes("User already registered")) {
          errorMessage = "This email is already registered. Try signing in instead.";
        } else if (result.error.message.includes("Email not confirmed")) {
          errorMessage = "Please check your email and click the verification link.";
        }

        toast({
          title: "Authentication Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-wellness-primary" />
            <h1 className="text-3xl font-bold text-wellness-primary">Bloom</h1>
          </div>
          <p className="text-muted-foreground">
            Your personal wellness and mental health companion
          </p>
        </div>

        {/* Auth Card */}
        <Card className="bg-gradient-card shadow-soft border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-wellness-primary">
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isSignUp 
                ? 'Join thousands of women on their wellness journey' 
                : 'Continue your wellness journey'
              }
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {isSignUp && (
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters long
                  </p>
                )}
              </div>

              {isSignUp && (
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                    disabled={loading}
                  />
                  <Label 
                    htmlFor="terms" 
                    className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
                  >
                    I accept the{' '}
                    <span className="text-wellness-primary hover:underline">
                      Terms of Service
                    </span>{' '}
                    and{' '}
                    <span className="text-wellness-primary hover:underline">
                      Privacy Policy
                    </span>
                    . I consent to the processing of my personal data for wellness coaching purposes.
                  </Label>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-wellness-primary hover:bg-wellness-secondary"
                disabled={loading || (isSignUp && (!acceptedTerms || !formData.name || !formData.email || !formData.password))}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <Separator />
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                </p>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setFormData({ name: '', email: '', password: '' });
                    setAcceptedTerms(false);
                  }}
                  disabled={loading}
                  className="text-wellness-primary hover:text-wellness-secondary"
                >
                  {isSignUp ? 'Sign In' : 'Create Account'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-muted-foreground">
          <p>Your data is encrypted and secure</p>
          <p className="mt-1">🔒 Protected by enterprise-grade security</p>
        </div>
      </div>
    </div>
  );
};