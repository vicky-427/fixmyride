
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { NewRequestSheet } from './NewRequestSheet';
import RequestMap from './RequestMap';
import type { ServiceRequest } from '@/lib/types';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import RequestCard from './RequestCard';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function RequesterView() {
  const { userProfile } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error.message);
          setLocationError("Could not get your location. Please enable location services in your browser and refresh.");
        }
      );
    } else {
        setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (!userProfile) return;

    setLoading(true);
    const q = query(
      collection(db, 'serviceRequests'),
      where('requesterId', '==', userProfile.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userRequests = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ServiceRequest));
      setRequests(userRequests);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userProfile]);
  
  const activeRequest = requests.find(r => r.status === 'accepted' || r.status === 'in-progress');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold font-headline">Your Service Requests</h2>
            <NewRequestSheet userLocation={userLocation}/>
        </div>
        <div className="space-y-4">
            {loading && (
                <>
                    <Skeleton className='h-40 w-full' />
                    <Skeleton className='h-40 w-full' />
                </>
            )}
            {!loading && requests.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">You have no service requests.</p>
                <p className="text-sm text-muted-foreground mt-2">Click "Request Help" to create a new one.</p>
              </div>
            )}
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
      </div>

      <div className="lg:col-span-1 space-y-6 lg:sticky top-24">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl">Active Request Status</CardTitle>
            </CardHeader>
            <CardContent>
                {activeRequest ? (
                <div>
                    <p className='text-sm'>A helper is on the way for your <span className='font-bold capitalize'>{activeRequest.serviceType}</span> issue.</p>
                    <p className='mt-2 text-sm'>Helper: <span className='font-semibold'>{activeRequest.helperName}</span></p>
                    <p className='mt-2 text-sm'>Status: <span className='font-bold capitalize p-1 px-2 rounded-md bg-secondary text-secondary-foreground'>{activeRequest.status}</span></p>
                </div>
                ) : (
                <p className="text-sm text-muted-foreground">You have no active requests. Click "Request Help" to create one.</p>
                )}
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl">Your Location</CardTitle>
            </CardHeader>
             <CardContent>
                <div className="h-[300px] w-full rounded-md overflow-hidden bg-muted">
                    {userLocation ? (
                    <RequestMap 
                        center={userLocation} 
                        zoom={15} 
                        requests={activeRequest ? [activeRequest] : []}
                        userLocation={userLocation}
                        />
                    ) : (
                        <div className='flex items-center justify-center h-full text-center p-4'>
                            <p className='text-muted-foreground text-sm'>{locationError || "Fetching your location..."}</p>
                        </div>
                    )}
                </div>
             </CardContent>
        </Card>
      </div>
    </div>
  );
}
