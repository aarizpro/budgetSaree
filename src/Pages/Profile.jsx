import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/ProfileLogo.jpg'

const Profile = () => {
    const url = "https://budget.dingdong.co.in/";
    const [shopName, setShopName] = useState('');
    const [shopOwner, setShopOwner] = useState('');
    const [shopMobile, setShopMobile] = useState('');
    const [shopAddr, setShopAddr] = useState('');
    const [shopEmail, setShopEmail] = useState('');
    const [shopPincode, setShopPincode] = useState('');
    const [shopInstanceId, setShopInstanceId] = useState('');
    const [shopAccessToken, setShopAccessToken] = useState('');
    const [shopLogo, setShopLogo] = useState('');
    const [file, setFile] = useState(null);
    const fetchData = async () => {
        try {
            const response = await axios.get(`${url}api/profile/66ee6cb6696d1dcc380fd583`);
            setShopName(response.data.shopName);
            setShopOwner(response.data.shopOwner);
            setShopMobile(response.data.shopMobile);
            setShopAddr(response.data.shopAddr);
            setShopEmail(response.data.shopEmail);
            setShopInstanceId(response.data.shopInstanceId);
            setShopAccessToken(response.data.shopAccessToken);
            setShopPincode(response.data.shopPincode);
            setShopLogo(response.data.shopLogo);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const saveShop = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${url}api/profile/66ee6cb6696d1dcc380fd583`, {
                shopName: shopName,
                shopOwner: shopOwner,
                shopAddr: shopAddr,
                shopMobile: shopMobile,
                shopEmail: shopEmail,
                shopPincode: shopPincode,
                shopInstanceId: shopInstanceId,
                shopAccessToken: shopAccessToken,
                shopLogo: shopLogo
            });
            toast.success("Updated Successfully...")
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }
    const uploadFile = async () => {
        if (!file) {
          alert("Please select a file first");
          return;
        }
    
        const formData = new FormData();
        formData.append("file", file);
    
        try {
          const response = await axios.post(`${url}api/image/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log(response.data);
          setShopLogo(response.data.location); // Ensure you are setting a valid string
          toast.success("File uploaded successfully");
        } catch (error) {
          toast.error("File upload failed");
          console.log(error);
        }
      };

    return (
        <div className='w-50 align-center'>
            <div className="max-w-lg shadow-lg mx-auto p-2 rounded " style={{ backgroundColor: "gray" }}>
                <div className="mb-2">
                    <img src={logo} className="img-fluid rounded " alt="Shop Logo" style={{ width: "650px", height: "130px" }} />
                </div>
                <form onSubmit={saveShop}>
                    <div className="input-group mb-3">
                        <span class="input-group-text">Shop Name</span>
                        <input
                            type="text"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value.toUpperCase())}
                            className="form-control"
                        />
                    </div>
                    <div className="input-group mb-3">
                        <span class="input-group-text">Owner Name</span>
                        <input
                            type="text"
                            value={shopOwner}
                            onChange={(e) => setShopOwner(e.target.value.toUpperCase())}
                            className="form-control"
                        />
                        <span class="input-group-text">Mobile</span>
                        <input
                            type="number"
                            value={shopMobile}
                            onChange={(e) => setShopMobile(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="input-group mb-3">
                        <span class="input-group-text">Address</span>
                        <textarea class="form-control"
                            value={shopAddr}
                            onChange={(e) => setShopAddr(e.target.value.toUpperCase())}
                        >

                        </textarea>
                    </div>
                    <div className="input-group mb-3">
                        <span class="input-group-text">Pincode</span>
                        <input
                            type="number"
                            value={shopPincode}
                            onChange={(e) => setShopPincode(e.target.value)}
                            className="form-control"
                        />
                        <span class="input-group-text">Email</span>
                        <input
                            type="text"
                            value={shopEmail}
                            onChange={(e) => setShopEmail(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="input-group mb-3">
                        <span class="input-group-text">Instance ID:</span>
                        <input
                            type="text"
                            value={shopInstanceId}
                            onChange={(e) => setShopInstanceId(e.target.value.toUpperCase())}
                            className="form-control"
                        />
                        <span class="input-group-text">Access Token:</span>
                        <input
                            type="text"
                            value={shopAccessToken}
                            onChange={(e) => setShopAccessToken(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="input-group mb-3">
                       
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="form-control"
                        />
                        <button
                            type="button"
                            onClick={uploadFile}
                            className="form-control btn btn-primary w-100 mt-2"
                        >
                            Upload
                        </button>
                    </div>
                    <div className="input-group mb-3">
                    <span class="input-group-text">Shop Logo Link:</span>
                        <input
                            type="text"
                            value={shopLogo}
                            onChange={(e) => setShopLogo(e.target.value)}
                            placeholder="Enter Courier Image URL"
                            readOnly
                            className="form-control"
                        />
                    </div>
                    <button className='btn btn-primary w-100'>Save</button>
                </form>
            </div>


        </div>
    )
}

export default Profile