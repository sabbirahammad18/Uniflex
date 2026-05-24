import { Outlet } from "react-router-dom";
import Header from "../components/Header.tsx";
import Sidebar from "../components/Sidebar.tsx";
import Footer from "../components/Footer.tsx";
import { useState } from "react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-107.5 min-h-screen relative overflow-x-hidden ">
      <Header setSidebarOpen={setSidebarOpen} />

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="pt-14">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
