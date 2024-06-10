import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <main>
      <Navbar />
      <div className="">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default Layout;
