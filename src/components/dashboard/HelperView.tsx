
"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ServiceRequest } from '@/lib/types';
import RequestCard from './RequestCard';
import RequestMap from './RequestMap';
import { Skeleton } from '../ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function HelperView() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [openRequests, setOpenRequests] = useState<ServiceRequest[]>([]);
  const [myJobs, setMyJobs] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');

  useEffect(() => {
    setLoading(true);
    // Listen for open requests
    const openRequestsQuery = query(
      collection(db, 'serviceRequests'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeOpen = onSnapshot(openRequestsQuery, (querySnapshot) => {
      const requests = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ServiceRequest));
      setOpenRequests(requests);
      setLoading(false);
    });

    if (userProfile) {
        // Listen for jobs accepted by me
        const myJobsQuery = query(
            collection(db, 'serviceRequests'),
            where('helperId', '==', userProfile.uid),
            orderBy('updatedAt', 'desc')
        );

        const unsubscribeMyJobs = onSnapshot(myJobsQuery, (querySnapshot) => {
            const jobs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ServiceRequest));
            setMyJobs(jobs);
        });
        
        return () => {
            unsubscribeOpen();
            unsubscribeMyJobs();
        };
    }

    return () => unsubscribeOpen();
  }, [userProfile]);

  const handleAcceptRequest = async (requestId: string) => {
    if (!userProfile) return;
    const requestRef = doc(db, 'serviceRequests', requestId);

    try {
        const requestSnap = await getDoc(requestRef);
        if(requestSnap.exists() && requestSnap.data().status !== 'pending') {
            toast({ title: "Job Already Taken", description: "Another helper has already accepted this job.", variant: "destructive" });
            return;
        }

        await updateDoc(requestRef, {
            status: 'accepted',
            helperId: userProfile.uid,
            helperName: userProfile.name,
            updatedAt: new Date(),
        });
        toast({ title: "Job Accepted", description: "You can now see this job in 'My Jobs'." });
        setActiveTab('my-jobs');
    } catch (error) {
        console.error("Error accepting request: ", error);
        toast({ title: "Error", description: "Could not accept the job.", variant: "destructive" });
    }
  };

  const mapRequests = activeTab === 'available' ? openRequests : myJobs.filter(j => j.status === 'accepted' || j.status === 'in-progress');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available Requests ({openRequests.length})</TabsTrigger>
            <TabsTrigger value="my-jobs">My Jobs ({myJobs.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="available" className="mt-6">
             <div className="space-y-4">
                {loading && Array.from({length: 3}).map((_, i) => <Skeleton key={i} className='h-40 w-full' />)}
                {!loading && openRequests.length === 0 && (
                  <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No open requests right now. Check back soon!</p>
                  </div>
                )}
                {openRequests.map((request) => (
                  <div key={request.id} className="flex items-center gap-4">
                    <div className="flex-grow">
                      <RequestCard request={request} isHelperView />
                    </div>
                    <Button onClick={() => handleAcceptRequest(request.id)}>Accept</Button>
                  </div>
                ))}
              </div>
          </TabsContent>
          <TabsContent value="my-jobs" className="mt-6">
            <div className="space-y-4">
                {loading && Array.from({length: 2}).map((_, i) => <Skeleton key={i} className='h-40 w-full' />)}
                {!loading && myJobs.length === 0 && (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">You haven't accepted any jobs yet.</p>
                    </div>
                )}
                {myJobs.map((request) => (
                    <RequestCard key={request.id} request={request} isHelperView={true} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="lg:col-span-1 h-[450px] lg:h-auto lg:sticky top-24">
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="font-headline text-xl">Request Map</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-76px)]">
                <div className="h-full w-full rounded-md overflow-hidden bg-muted">
                    <RequestMap center={{ lat: 20.5937, lng: 78.9629 }} zoom={4.5} requests={mapRequests} />
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
