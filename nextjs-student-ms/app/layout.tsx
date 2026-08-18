import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://solvit-bunsenplus.vercel.app"),
    title: {
        default: "Solvit - Modern Student Management & Academic Attendance System",
        template: "%s | Solvit Student Management",
    },
    description: "Secure, high-performance academic management portal for course attendance tracking, leave requests, and student administration.",
    keywords: ["student management system", "academic portal", "university LMS", "leave management", "course enrollment", "student records", "academic planning"],
    authors: [{name: "Solvit Learning", url: "https://solvit-africa.com"}],
    creator: "Solvit",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://solvit-bunsenplus.vercel.app",
        title: "Solvit - Modern Student Management & Academic Attendance System",
        description: "Secure, high-performance academic management portal for course attendance tracking, leave requests, and student administration.",
        siteName: "Solvit Student Management",
        images: [
            {
                url: "https://solvit-bunsenplus.vercel.app/og-image.png",
                width: 1200,
                height: 630,
                alt: "Solvit Student Management",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Solvit Student Management System",
        description: "Academic management system for students, teachers, and administrators.",
    },
    icons: {
        icon: [
            {url: "/favicon-standard.svg", type: "image/svg+xml"},
            {url: "/favicon-standard.png", sizes: "32x32", type: "image/png"},
        ],
        apple: [
            {url: "/favicon-retina.png", sizes: "180x180", type: "image/png"},
        ],
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
        <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
