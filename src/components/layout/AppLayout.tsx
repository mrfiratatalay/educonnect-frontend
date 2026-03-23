import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";
import ChatBubble from "@/components/chat/ChatBubble";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 pb-20 lg:pb-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <MobileNav />
      <ChatBubble />
    </div>
  );
}
