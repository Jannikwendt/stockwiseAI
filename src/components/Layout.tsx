
import React, { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, BarChart2, MessageSquare, ChevronRight, PieChart, BookOpen, Bell, Settings, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useLocation } from "react-router-dom";

type SidebarItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "StockWise AI" }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    { name: "Chat", icon: <MessageSquare size={20} />, path: "/" },
    { name: "Market Overview", icon: <BarChart2 size={20} />, path: "/market" },
    { name: "My Portfolio", icon: <PieChart size={20} />, path: "/portfolio" },
    { name: "Learn", icon: <BookOpen size={20} />, path: "/learn" },
    { name: "Alerts", icon: <Bell size={20} />, path: "/alerts" },
  ];

  const closeSidebarIfMobile = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out",
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <h1 className="text-xl font-semibold tracking-tight">
            <span className="text-primary">Stock</span>Wise AI
          </h1>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="h-8 w-8"
            >
              <X size={18} />
            </Button>
          )}
        </div>

        <nav className="mt-6 flex flex-1 flex-col px-3">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = 
                (item.path === "/" && location.pathname === "/") || 
                (item.path !== "/" && location.pathname.startsWith(item.path));
              
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 px-3 transition-all duration-200",
                    isActive && "font-medium"
                  )}
                  asChild
                >
                  <Link to={item.path} onClick={closeSidebarIfMobile}>
                    {item.icon}
                    <span>{item.name}</span>
                    {isActive && (
                      <ChevronRight
                        size={16}
                        className="ml-auto text-muted-foreground"
                      />
                    )}
                  </Link>
                </Button>
              );
            })}
          </div>
        </nav>

        <div className="mt-auto border-t border-border p-4">
          <Button variant="outline" className="w-full justify-start gap-2">
            <User size={18} />
            <span>Profile</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="mt-2 w-full justify-start gap-2"
          >
            <Settings size={18} />
            <span>Settings</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={cn(
          "flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out",
          isMobile && !sidebarOpen ? "ml-0" : "ml-64"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="mr-2"
            >
              <Menu size={20} />
            </Button>
          )}
          <h1 className="text-lg font-medium">{title}</h1>
          <div className="flex items-center gap-2">
            {/* This div is kept empty intentionally to maintain the header layout */}
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
