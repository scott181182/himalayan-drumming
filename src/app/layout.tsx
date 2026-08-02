import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { PropsWithChildren } from "react";

import { AppLayout } from "@/components/AppLayout";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// oxlint-disable-next-line react/only-export-components
export const metadata: Metadata = {
  title: "Himalayan Drumming",
  description: "Dashboard for enabling research into Himalayan Drumming patterns",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
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
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
