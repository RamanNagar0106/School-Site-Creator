import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { AnnouncementTicker } from "@/components/AnnouncementTicker";
import { BackToTop } from "@/components/BackToTop";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <ScrollProgressBar />
      <Navbar />
      <AnnouncementTicker />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
