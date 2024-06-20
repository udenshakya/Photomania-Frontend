import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "./Button";
import CreatePostModal from "./CreatePostModal";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const Navbar = () => {
  const [register, setRegister] = useState(false);
  const [login, setLogin] = useState(false);
  const [createPost, setCreatePost] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) setLoggedIn(true);
  }, [login]);

  const handleLogout = () => {
    navigate("/");
    Cookies.remove("token");
    setLoggedIn(false);
    toast.success("Logout successful");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActiveLink = (path: string) => {
    return location.pathname === path
      ? "bg-gray-600/70 text-white"
      : "text-white hover:bg-white hover:text-black";
  };

  return (
    <>
      <nav className="flex justify-between items-center py-3 px-2 bg-purple-950 relative">
        <div>
          <Link to="/">
            <img
              src="/photonobg.png"
              className="h-16 w-48 object-cover"
              alt="photomania"
            />
          </Link>
        </div>
        <div className="md:flex hidden gap-5 text-black px-5">
          <Link
            to="/"
            className={`text-lg rounded-full border-2 border-gray-400 transition-all duration-300 px-4 py-1 ${isActiveLink(
              "/"
            )}`}
          >
            Explore
          </Link>
          {loggedIn && (
            <>
              <Button
                className="bg-red-700"
                onClick={() => setCreatePost(true)}
              >
                Create Post
              </Button>
              <Link
                to="/profile"
                className={`text-lg rounded-full border-2 border-gray-400 transition-all duration-300 px-4 py-1 ${isActiveLink(
                  "/profile"
                )}`}
              >
                Profile
              </Link>
            </>
          )}
          {loggedIn ? (
            <>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button onClick={() => setLogin(true)}>Login</Button>
              <Button onClick={() => setRegister(true)}>Register</Button>
            </>
          )}
        </div>
        <div className="md:hidden flex items-center">
          <button
            className="text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <div className="text-2xl mr-3 ">
              <GiHamburgerMenu />
            </div>
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden absolute top-14 right-0 bg-purple-950 w-full flex flex-col items-center gap-4 py-4 z-50">
            <Link
              to="/"
              className={`text-lg rounded-full border-2 border-gray-400 transition-all duration-300 px-4 py-1 ${isActiveLink(
                "/"
              )}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            {loggedIn && (
              <>
                <Button
                  className="bg-red-700"
                  onClick={() => {
                    setCreatePost(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Create Post
                </Button>
                <Link
                  to="/profile"
                  className={`text-lg rounded-full border-2 border-gray-400 transition-all duration-300 px-4 py-1 ${isActiveLink(
                    "/profile"
                  )}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            )}
            {loggedIn ? (
              <Button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setLogin(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    setRegister(true);
                    setIsMenuOpen(false);
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        )}
      </nav>
      <RegisterModal
        register={register}
        setRegister={setRegister}
        setLogin={setLogin}
      />
      <LoginModal login={login} setLogin={setLogin} setRegister={setRegister} />
      <CreatePostModal
        isOpen={createPost}
        onClose={() => setCreatePost(false)}
      />
    </>
  );
};

export default Navbar;
