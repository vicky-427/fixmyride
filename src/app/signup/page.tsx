import { AuthForm } from '@/components/auth/AuthForm';
import { Logo } from '@/components/icons';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="flex items-center mb-8 text-2xl font-headline font-bold text-primary">
            <Logo className="h-8 w-8 mr-2" />
            FixMyRide
        </div>
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-headline">Create an Account</h1>
          <p className="text-muted-foreground">Join our network to get or provide help on the road.</p>
        </div>
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
