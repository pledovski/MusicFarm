import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
<nav className="navbar bg-dark">
      <h1>
        <Link to="/"><i className="fab fa-earlybirds"></i> MusicFarm</Link>
      </h1>
      <ul>
        <li><Link to="!#">Artists</Link></li>
        <li><Link to="!#">Records</Link></li>
        <li><Link to="!#">Labels</Link></li>
        <li><Link to="/register" className="btn btn-primary">Sign Up</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar
