import RequesterView from "@/components/dashboard/RequesterView";

export default function DashboardPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4 font-headline">Requester Dashboard</h1>
            <RequesterView />
        </div>
    );
}
