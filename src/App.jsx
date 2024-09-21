import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import Profile from "./Pages/Profile";
import Billing from "./Pages/Billing";
import Client from "./Pages/Client";
import Category from "./Pages/Category";
import Product  from "./Pages/Product";
import BillingReport from "./Pages/BillingReport";
import InvoiceReport from "./Pages/InvoiceReport";
import SendImage from "./Pages/SendImage";
import SendVideo from "./Pages/SendVideo";
function App() {
  const user = localStorage.getItem("token");
  return (
    <div>
       <Sidebar />
       <div style={{ marginLeft: '200px' }}> {/* Ensure content area takes remaining width */}
        <Navbar />
        <div className="container-fluid py-3">
        <Routes>
        {user ? (
          <>
          <Route path="/" exact element={<Profile />} />
          <Route path="/profile" exact element={<Profile />} />
          <Route path="/billing" exact element={<Billing />} />
          <Route path="/addclient" exact element={<Client />} />
          <Route path="/addcategory" exact element={<Category />} />
          <Route path="/addproduct" exact element={<Product />} />
          <Route path="/billingreport" exact element={<BillingReport />} />
          <Route path="/invoicereport" exact element={<InvoiceReport />} />
          <Route path="/sendimage" exact element={<SendImage />} />
          <Route path="/sendvideo" exact element={<SendVideo />} />
          </>
        ):(
          <>
          <Route path="/signup" exact element={<Signup />} />
					<Route path="/login" exact element={<Login />} />
					<Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/profile" element={<Navigate replace to="/login" />} />
          <Route path="/addclient" element={<Navigate replace to="/login" />} />
          <Route path="/addcategory" element={<Navigate replace to="/login" />} />
          <Route path="/addproduct" element={<Navigate replace to="/login" />} />
          <Route path="/billing" element={<Navigate replace to="/login" />} />
          <Route path="/billingreport" element={<Navigate replace to="/login" />} />
          <Route path="/invoicereport" element={<Navigate replace to="/login" />} />
          <Route path="/sendimage" element={<Navigate replace to="/login" />} />
          <Route path="/sendvideo" element={<Navigate replace to="/login" />} />
          </>
        )}
        </Routes>
        </div>
        </div>
        <ToastContainer/>
    </div>
  )
}

export default App
