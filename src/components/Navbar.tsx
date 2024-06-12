import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const Navbar = () => {
  const [register, setRegister] = useState(false);
  const [login, setLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // setLoggedIn(token !== null && token !== undefined);
    setLoggedIn(!!token); // Set loggedIn to true if token is present, false otherwise
  }, [login]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <>
      <nav className="flex justify-between items-center py-3 px-2 bg-purple-950">
        <div>
          <Link to={"/"}>
            <img
              src="/photonobg.png"
              className="h-16 w-48 object-cover"
              alt="photomania"
            />
          </Link>
        </div>
        <div className="flex gap-5 text-black px-5">
          <Link
            to="/"
            className="text-lg rounded-full text-white border-2 border-gray-400 hover:bg-white hover:text-black transition-all duration-300 px-4 py-1"
          >
            Home
          </Link>
          {loggedIn && (
            <Link
              to="/profile"
              className="text-lg rounded-full text-white border-2 border-gray-400 hover:bg-white hover:text-black transition-all duration-300 px-4 py-1"
            >
              Profile
            </Link>
          )}
          {loggedIn ? (
            <button
              className="text-lg rounded-full text-white border-2 border-gray-400 hover:bg-white hover:text-black transition-all duration-300 px-4 py-1"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <>
              <button
                className="text-lg rounded-full text-white border-2 border-gray-400 hover:bg-white hover:text-black transition-all duration-300 px-4 py-1"
                onClick={() => setLogin(true)}
              >
                Login
              </button>
              <button
                className="text-lg rounded-full text-white border-2 border-gray-400 hover:bg-white hover:text-black transition-all duration-300 px-4 py-1"
                onClick={() => setRegister(true)}
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>
      <RegisterModal register={register} setRegister={setRegister} />
      <LoginModal login={login} setLogin={setLogin} setLoggedIn={setLoggedIn} />
    </>
  );
};

export default Navbar;
