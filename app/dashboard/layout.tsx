
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import TopBanner from "@/components/dashboard/TopBanner";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            <DashboardSidebar />
            <main className="flex-1 p-6 md:p-8 bg-gray-100 dark:bg-gray-900 ml-64">
                <TopBanner />
                {children}
            </main>
        </div>
    );
}
