
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ServiceRequest, RequestStatus } from '@/lib/types';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Clock, Wrench, Fuel, Battery, Cog, HelpCircle, Star, User } from 'lucide-react';
import { TyreIcon } from '../icons';
import { useAuth } from '@/hooks/use-auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { LeaveReviewDialog } from './LeaveReviewDialog';
import { cn } from '@/lib/utils';

interface RequestCardProps {
  request: ServiceRequest;
  isHelperView?: boolean;
}

const serviceIcons = {
  tyre: <TyreIcon className="h-5 w-5" />,
  breakdown: <Wrench className="h-5 w-5" />,
  fuel: <Fuel className="h-5 w-5" />,
  battery: <Battery className="h-5 w-5" />,
  engine: <Cog className="h-5 w-5" />,
  other: <HelpCircle className="h-5 w-5" />,
};

const statusColors: { [key in RequestStatus]: string } = {
    pending: 'bg-yellow-500 hover:bg-yellow-500/90',
    accepted: 'bg-blue-500 hover:bg-blue-500/90',
    'in-progress': 'bg-indigo-500 hover:bg-indigo-500/90',
    completed: 'bg-green-500 hover:bg-green-500/90',
    cancelled: 'bg-red-500 hover:bg-red-500/90',
};

function renderStars(rating: number) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i <= rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"
        )}
      />
    );
  }
  return <div className="flex items-center">{stars}</div>;
}

export default function RequestCard({ request, isHelperView = false }: RequestCardProps) {
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const handleStatusUpdate = async (newStatus: RequestStatus) => {
    if (!userProfile || userProfile.uid !== request.helperId) return;

    const requestRef = doc(db, 'serviceRequests', request.id);
    try {
      await updateDoc(requestRef, {
        status: newStatus,
        updatedAt: new Date(),
      });
      toast({ title: 'Status Updated', description: `Job status changed to ${newStatus}.` });
    } catch (error) {
      console.error("Error updating status: ", error);
      toast({ title: "Error", description: "Could not update job status.", variant: "destructive" });
    }
  };

  const isMyJob = userProfile?.role === 'helper' && userProfile.uid === request.helperId;

  return (
    <Card className="w-full transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                {serviceIcons[request.serviceType]}
              </div>
              <div>
                  <CardTitle className="text-lg font-headline">
                    <span className="capitalize">{request.serviceType} Trouble</span>
                  </CardTitle>
                  <CardDescription>
                    {request.vehicleDetails}
                  </CardDescription>
              </div>
            </div>
            <Badge className={cn("capitalize text-white", statusColors[request.status])}>{request.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{request.description}</p>
        
        {request.helperName && (
          <div className='flex items-center text-sm mt-4 text-muted-foreground gap-2'>
            <User className='h-4 w-4'/>
            <span>Helper: {request.helperName}</span>
          </div>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground py-3">
        <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{new Date(request.createdAt.seconds * 1000).toLocaleDateString()}</span>
        </div>
        
        {isHelperView && isMyJob && (
            <div className="flex gap-2">
                {request.status === 'accepted' && (
                    <Button size="sm" onClick={() => handleStatusUpdate('in-progress')}>On My Way</Button>
                )}
                 {request.status === 'in-progress' && (
                    <Button size="sm" onClick={() => handleStatusUpdate('completed')}>Mark as Completed</Button>
                )}
            </div>
        )}

        {!isHelperView && request.status === 'completed' && !request.rating && (
           <LeaveReviewDialog requestId={request.id}>
             <Button size="sm" variant="outline"><Star className='w-4 h-4 mr-2' />Leave a Review</Button>
           </LeaveReviewDialog>
        )}
        
        {request.rating && (
          <div className='flex items-center gap-2'>
            {renderStars(request.rating)}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
