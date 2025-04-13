import React from "react";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";

export const dynamic = "force-dynamic";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) return redirect("/sign-in");

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#3DA5D9] via-[#2B8FC4] to-[#1A7BAF]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/assets/images/grid.svg')] opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#3DA5D9]/20 via-transparent to-[#1A7BAF]/20" />
      
      {/* Main Layout */}
      <div className="relative flex h-screen">
        {/* Sidebar - Visible on sm and up, hidden on mobile */}
        <aside className="hidden sm:block fixed left-0 top-0 z-50 h-screen w-[280px] xl:w-[325px]">
          <Sidebar {...currentUser} />
        </aside>

        <div className="flex h-full w-full flex-1 flex-col sm:ml-[280px] xl:ml-[325px]">
          {/* Header - Fixed at the top */}
          <header className="sticky top-0 z-40">
            <Header userId={currentUser.$id} accountId={currentUser.accountId} />
          </header>

          {/* Mobile Navigation - Only visible on mobile */}
          <div className="fixed top-0 right-0 z-50 sm:hidden">
            <MobileNavigation {...currentUser} />
          </div>

          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-auto">
            <div className="main-content">
              {children}
            </div>
          </div>
        </div>

        <Toaster />
      </div>
    </main>
  );
};

export default Layout;
