import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Car, Wrench } from 'lucide-react';
import Header from '@/components/layout/Header';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline text-primary">
                    Stranded? Get Help Fast with FixMyRide.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    The real-time platform connecting you with trusted roadside assistance, anytime, anywhere. Don&apos;t let a breakdown ruin your day.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
                      Request Assistance Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Become a Service Provider
                    </Button>
                  </Link>
                </div>
              </div>
              <Image
                src={placeholderImages.placeholderImages[0].imageUrl}
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint={placeholderImages.placeholderImages[0].imageHint}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">How FixMyRide Works for You</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We've streamlined the process of getting roadside help to be as simple and stress-free as possible.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <div className="grid gap-1 text-center p-4 rounded-lg hover:bg-background transition-colors">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
                    <Car className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold font-headline">For Vehicle Owners</h3>
                <p className="text-sm text-muted-foreground">
                  Instantly broadcast your location and issue to nearby mechanics. Track their arrival in real-time and get back on the road faster.
                </p>
              </div>
              <div className="grid gap-1 text-center p-4 rounded-lg hover:bg-background transition-colors">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
                    <Wrench className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold font-headline">For Service Providers</h3>
                <p className="text-sm text-muted-foreground">
                  Find new customers in your area. Accept jobs that fit your schedule and skills. Grow your business with FixMyRide.
                </p>
              </div>
              <div className="grid gap-1 text-center p-4 rounded-lg hover:bg-background transition-colors">
                 <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
                    <ArrowRight className="h-8 w-8" />
                 </div>
                <h3 className="text-lg font-bold font-headline">Real-Time & Reliable</h3>
                <p className="text-sm text-muted-foreground">
                  Our platform uses live location data to ensure the closest available helper is dispatched to you for the quickest response time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 FixMyRide. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
