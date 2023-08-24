import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../assets/globals.scss";
import { AppLayout } from "@/components/AppLayout";
import { AuthLayout } from "@/components/AuthLayout";
import type { LayoutProps } from "@/utils/layout";




const inter = Inter({ subsets: ["latin"] });



export const metadata: Metadata = {
    title: "Himalayan Drumming",
    description: "Dashboard for enabling research into Himalayan Drumming patterns",
};



export default function RootLayout({
    children,
}: LayoutProps) {
    return (
        <html lang="en">
            <head>
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                    crossOrigin=""
                />
            </head>
            <body className={inter.className}>
                <AuthLayout>
                    <AppLayout>
                        {children}
                    </AppLayout>
                </AuthLayout>
            </body>
        </html>
    );
}
