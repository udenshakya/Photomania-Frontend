import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Button from "./Button";
import CreatePostModal from "./CreatePostModal";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const Navbar = () => {
  const [register, setRegister] = useState(false);
  const [login, setLogin] = useState(false);
  const [createPost, setCreatePost] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) setLoggedIn(true);
  }, [login]);

  const handleLogout = () => {
    Cookies.remove("token");
    setLoggedIn(false);
    toast.success("Logout successful");
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
            Explore
          </Link>
          {loggedIn && (
            <>
              <Button
                className={"bg-red-500"}
                onClick={() => setCreatePost(true)}
              >
                Create Post
              </Button>
              <Link
                to="/profile"
                className="text-lg rounded-full text-white border-2 border-gray-400 hover:bg-white hover:text-black transition-all duration-300 px-4 py-1"
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
      </nav>
      <RegisterModal register={register} setRegister={setRegister} />
      <LoginModal login={login} setLogin={setLogin} />
      <CreatePostModal
        isOpen={createPost}
        onClose={() => setCreatePost(false)}
      />
    </>
  );
};

export default Navbar;
