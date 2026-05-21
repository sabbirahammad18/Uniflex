
import {Outlet } from "react-router-dom"
import Header from "../components/Header.tsx";
import Sidebar from "../components/Sidebar.tsx";
import Footer from "../components/Footer.tsx";
import {useState} from "react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-107.5 min-h-screen relative overflow-x-hidden pb-16">

      <Header setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="pt-14">
        <Outlet />
      </main>

      <footer className="py-4 flex justify-center border-t border-slate-100 opacity-70">
        <p className="text-[10px] font-mono tracking-wider uppercase text-slate-400">
          Developed by HSBLCO V2.1
        </p>
      </footer>

      <Footer/>

    </div>
  );
};
