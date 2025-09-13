
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BookMarkedIcon } from '@/components/Header';
import { Loader2 } from 'lucide-react';
import { FirebaseError } from 'firebase/app';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast({ title: 'Login Successful', description: 'Welcome back!' });
      router.push('/catalog');
    } catch (error: any) {
        let errorMessage = 'An unknown error occurred.';
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    errorMessage = 'Invalid email or password. Please try again.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Please enter a valid email address.';
                    break;
                default:
                    errorMessage = 'An unexpected error occurred during login. Please try again later.';
                    break;
            }
        }
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: errorMessage,
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent text-foreground font-body">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
            <Link href="/" className="flex items-center justify-center gap-3 mb-4">
                <BookMarkedIcon className="h-10 w-10 text-foreground" />
                <h1 className="text-4xl font-headline font-bold">Verdant Library</h1>
            </Link>
            <p className="text-muted-foreground">Welcome back! Please sign in to your account.</p>
        </div>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline hover:text-primary">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
