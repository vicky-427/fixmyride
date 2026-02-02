"use client";

import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import type { ServiceRequest } from '@/lib/types';

interface RequestMapProps {
  requests: ServiceRequest[];
  center: { lat: number; lng: number };
  zoom: number;
  userLocation?: { lat: number; lng: number };
}

export default function RequestMap({ requests, center, zoom, userLocation }: RequestMapProps) {
  return (
    <Map
      style={{ width: '100%', height: '100%' }}
      defaultCenter={center}
      defaultZoom={zoom}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
      mapId="fixmyride-map"
    >
      {requests.map((request) => (
        <AdvancedMarker
          key={request.id}
          position={{ lat: request.requesterLocation.latitude, lng: request.requesterLocation.longitude }}
          title={request.serviceType}
        >
            <Pin backgroundColor={'var(--primary)'} glyphColor={'white'} borderColor={'white'} />
        </AdvancedMarker>
      ))}

      {userLocation && (
         <AdvancedMarker
            position={userLocation}
            title={"Your Location"}
          >
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>
          </AdvancedMarker>
      )}
    </Map>
  );
}
