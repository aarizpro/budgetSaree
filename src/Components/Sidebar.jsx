import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'
const Sidebar = () => {
  return (
    <div className=" text-white vh-100" style={{ width: '200px', position: 'fixed', top: 0, left: 0,backgroundColor:'#4f4545' }}>
      <div className="d-flex flex-column align-items-start p-3">
        <a href="/" className="text-white text-decoration-none mb-3">
          <img
            src={logo}
            width="180"
            height="90"
            className="d-inline-block align-top"
            style={{borderRadius:"10%"}}
            alt=""
          />
        </a>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to={'/profile'} className="nav-link text-white custom-link" ><i class="bi bi-award-fill"></i> Profile</Link>
          </li>
          <li>
            <Link to={'/addclient'} className="nav-link text-white custom-link" ><i class="bi bi-building-fill-check"></i> Add Clients</Link>
          </li>
          
          <li>
            <Link to={'/addcategory'} className="nav-link text-white custom-link" ><i class="bi bi-bus-front-fill"></i>  Add Category</Link>
          </li>
          <li>
           
            <Link to={'/addproduct'} className="nav-link text-white custom-link" ><i class="bi bi-fire"></i>  Add Product</Link>
          </li>
          <li>
            
            <Link to={'/billing'} className="nav-link text-white custom-link" ><i class="bi bi-boombox-fill"></i>   Billing</Link>
          </li>
          <li>
            
            <Link to={'/billingreport'} className="nav-link text-white custom-link" ><i class="bi bi-binoculars-fill"></i>  Billing Report</Link>
          </li>
          <li>
            <Link to={'/invoicereport'} className="nav-link text-white custom-link" ><i class="bi bi-briefcase-fill"></i>  Invoice Report</Link>
          </li>
          <li>
            <Link to={'/sendimage'} className="nav-link text-white custom-link" ><i class="bi bi-person-bounding-box"></i>  Send Image</Link>
          </li>
          <li>
            <Link to={'/sendvideo'} className="nav-link text-white custom-link" ><i class="bi bi-camera-reels-fill"></i> Send Video</Link>
          </li>
         
        </ul>
        <hr />
      </div>
    </div>
  );
};

export default Sidebar;
