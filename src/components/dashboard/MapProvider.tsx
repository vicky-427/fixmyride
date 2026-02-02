"use client"

import { APIProvider } from "@vis.gl/react-google-maps";

export function MapProvider({ children }: { children: React.ReactNode }) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Google Maps API Key is missing.</h2>
                    <p className="text-muted-foreground">Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file.</p>
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
