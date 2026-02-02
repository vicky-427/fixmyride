"use client"

import { APIProvider } from "@vis.gl/react-google-maps";
import { firebaseConfig } from "@/lib/firebase";

export function MapProvider({ children }: { children: React.ReactNode }) {
    const apiKey = firebaseConfig.apiKey;

    if (!apiKey) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Google Maps API Key is missing.</h2>
                    <p className="text-muted-foreground">Could not retrieve API key from Firebase configuration.</p>
                </div>
            </div>
        )
    }

    return (
        <APIProvider apiKey={apiKey}>
            {children}
        </APIProvider>
    )
}
