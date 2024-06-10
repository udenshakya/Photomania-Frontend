import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <Link to="/">Goto HOme </Link>
      <Link to="/profile">Goto Profile </Link>
    </nav>
  );
};

export default Navbar;
