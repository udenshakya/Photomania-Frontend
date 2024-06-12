import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <main className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-grow px-10 py-5">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default Layout;
