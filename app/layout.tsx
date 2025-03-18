import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ResumeProvider } from "./context/ResumeContext";
import { InterviewProvider } from "./context/InterviewContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartHire - AI-Powered Interview Platform",
  description: "Prepare for technical interviews with AI-powered mock interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <ResumeProvider>
          <InterviewProvider>
            {children}
          </InterviewProvider>
        </ResumeProvider>
      </body>
    </html>
  );
}
