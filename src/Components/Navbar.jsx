import React from 'react';
import './Sidebar.css';
const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="ml-auto " style={{ position: 'relative' }}>
      <nav className="navbar p-1" style={{backgroundColor:'#4f4545'}}>
        <a className="navbar-brand" style={{color:"whitesmoke"}} href="#">
        "Elevate your style effortlessly with Budget Saree Collection – where elegance meets affordability."
        </a>
        <button type="button" className="btn btn-dark" onClick={handleLogout}>
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Navbar;
