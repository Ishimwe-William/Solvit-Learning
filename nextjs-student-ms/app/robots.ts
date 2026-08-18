import {MetadataRoute} from "next";
import {userAgent} from "next/server";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://solvit-bunsenplus.vercel.app/";

    return {
        rules: [
            {
                userAgent: '*',
                disallow: ['/teacher/', '/student/', '/api/', '/reset-password', '/pending-approval', '/suspended'],
                allow: ['/', '/login', '/register', '/forgot-password'],
            }
        ],
        sitemap: `$${baseUrl}/sitemap.xml`
    }
}