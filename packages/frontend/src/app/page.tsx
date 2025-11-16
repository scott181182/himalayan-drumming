"use client";

import { HomeView } from "@/components/HomeView";
import { DashboardProvider } from "@/contexts/DashboardContext";
import { EnumProvider } from "@/contexts/EnumContext";



export default function HomePage() {
    return (
        <EnumProvider>
            <DashboardProvider>
                <HomeView/>
            </DashboardProvider>
        </EnumProvider>
    );
}
