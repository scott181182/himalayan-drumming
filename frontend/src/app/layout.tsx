import { AppLayout } from "@/components/AppLayout";
import "./globals.css";
import { Inter } from "next/font/google";

import { LayoutProps } from "@/utils/layout";

const inter = Inter({ subsets: ["latin"] });



export const metadata = {
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
                <AppLayout>
                    {children}
                </AppLayout>
            </body>
        </html>
    );
}