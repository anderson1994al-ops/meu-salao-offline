import { ReactNode } from "react";
import BottomNavigation from "@/components/BottomNavigation";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground h-14 flex items-center justify-center shadow-md">
        <h1 className="text-lg font-bold uppercase tracking-wide">{title}</h1>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto pb-16">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Layout;
