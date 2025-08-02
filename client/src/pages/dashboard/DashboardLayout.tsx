import { Outlet } from "react-router";
import { AppSidebar } from "@/components/sidebar";
import Navbar from "@/components/navbar";
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";

export default function DashboardLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-3 bg-muted/50 rounded-lg">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
