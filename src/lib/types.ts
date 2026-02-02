import type { GeoPoint, Timestamp } from 'firebase/firestore';

export type UserRole = 'requester' | 'helper';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Timestamp;
}

export type ServiceType = 'tyre' | 'breakdown' | 'fuel' | 'battery' | 'engine' | 'other';

export const serviceTypes: ServiceType[] = ['tyre', 'engine', 'battery', 'fuel', 'breakdown', 'other'];

export type RequestStatus = 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';

export interface ServiceRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterLocation: GeoPoint;
  helperId?: string;
  helperName?: string;
  helperLocation?: GeoPoint;
  serviceType: ServiceType;
  vehicleDetails: string;
  description: string;
  status: RequestStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  rating?: number;
  feedback?: string;
}
