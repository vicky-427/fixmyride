"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { collection, addDoc, serverTimestamp, GeoPoint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { serviceTypes, ServiceType } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const requestSchema = z.object({
  serviceType: z.enum(serviceTypes, { required_error: 'Please select a service type.' }),
  vehicleDetails: z.string().min(3, { message: 'Please provide your vehicle make and model.' }),
  description: z.string().min(10, { message: 'Please describe the issue in at least 10 characters.' }),
});

interface NewRequestSheetProps {
    userLocation: { lat: number; lng: number } | null;
}

export function NewRequestSheet({userLocation}: NewRequestSheetProps) {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      vehicleDetails: '',
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof requestSchema>) => {
    if (!userProfile || !userLocation) {
        toast({
            title: 'Error',
            description: 'You must be logged in and have location services enabled.',
            variant: 'destructive',
        });
        return;
    }
    setIsLoading(true);
    try {
        await addDoc(collection(db, 'serviceRequests'), {
            requesterId: userProfile.uid,
            requesterName: userProfile.name,
            requesterLocation: new GeoPoint(userLocation.lat, userLocation.lng),
            ...values,
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        toast({
            title: 'Request Sent!',
            description: 'Nearby helpers have been notified.',
        });
        form.reset();
        setOpen(false);
    } catch (error) {
        console.error("Error creating request: ", error);
        toast({
            title: 'Request Failed',
            description: 'Could not send your request. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Request Help</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>New Service Request</SheetTitle>
          <SheetDescription>
            Fill out the details below. Your location will be shared with the service provider.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="serviceType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Service Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select the type of issue" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {serviceTypes.map((type) => (
                                        <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="vehicleDetails"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vehicle (e.g., Honda Civic 2022)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your vehicle make, model, and year" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Problem Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="e.g., Front left tyre is flat. I have a spare but no tools."
                                    className="resize-none"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <SheetFooter className="pt-4">
                        <SheetClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </SheetClose>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit Request
                        </Button>
                    </SheetFooter>
                </form>
            </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
