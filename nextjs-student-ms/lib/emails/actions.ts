"use server";

import nodemailer from "nodemailer";
import { EmailObject } from "@/types";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SENDER_HOST,
    port: Number(process.env.EMAIL_SENDER_PORT) || 465,
    secure: Number(process.env.EMAIL_SENDER_PORT) === 465, // true for 465, false for other ports (e.g. 587)
    auth: {
        user: process.env.EMAIL_SENDER_USERNAME,
        pass: process.env.EMAIL_SENDER_PASSWORD,
    },
});

export async function sendEmail({ to, subject, htmlData, appName = "Solvit Student MS" }: EmailObject) {
    try {
        const fromAddress =
            process.env.EMAIL_FROM ||
            process.env.EMAIL_SENDER_USERNAME ||
            "notifications@solvit.rw";

        const info = await transporter.sendMail({
            from: `"${appName}" <${fromAddress}>`,
            to,
            subject,
            html: htmlData,
        });

        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error("Error sending email via SMTP:", error);
        return { success: false, error: error.message || "Failed to send email" };
    }
}

