import { useState } from "react";
import { Link } from "react-router-dom";
import RegisterModal from "./RegisterModal";

const Navbar = () => {
  const [register, setRegister] = useState(false);

  return (
    <>
      <nav className="flex justify-between items-center py-3 px-2 bg-purple-950">
        <div>
          <Link to={"/"}>
            <img
              src="/photonobg.png"
              className="h-16 w-48  object-cover"
              alt="photomania"
            />
          </Link>
        </div>
        <div className="flex gap-5 text-black px-5">
          <Link
            to="/"
            className="text-lg rounded-full  text-white border-2 border-gray-400 hover:bg-white hover:text-black transition-all duration-300 px-4 py-1"
          >
            Home
          </Link>
          <Link
            to="/profile"
            className="text-lg rounded-full   text-white border-2 border-gray-400 hover:bg-white hover:text-black transition-all duration-300 px-4 py-1"
          >
            Profile
          </Link>
          <button
            className="text-lg rounded-full   text-white border-2 border-gray-400 hover:bg-white hover:text-black transition-all duration-300 px-4 py-1"
            onClick={() => setRegister(true)}
          >
            Register
          </button>
        </div>
      </nav>
      <RegisterModal register={register} setRegister={setRegister} />
    </>
  );
};

export default Navbar;
