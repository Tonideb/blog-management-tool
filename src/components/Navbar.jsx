import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      {/* Left side - Logo/Brand */}
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl" to="/">
          Logo
        </Link>
      </div>

      {/* Center-aligned navigation items */}
      <div className="flex-1 justify-center">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link to="/all-blogs">All Blogs</Link>
          </li>
          <li>
            <Link to="/create-blog">Create Blog</Link>
          </li>
        </ul>
      </div>

      {/* Right-aligned auth buttons */}
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <button disabled className="btn">
              Login
            </button>
          </li>
          <li>
            <button disabled className="btn">
              Sign Up
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
