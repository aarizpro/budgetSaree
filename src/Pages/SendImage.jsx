import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SendImage = () => {
  const [instanceId, setInstanceID] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [file, setFile] = useState(null);
  const [cimgurl, setCimgurl] = useState("");
  const [customers, setCustomers] = useState([]);
  const [custArea, setCustArea] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const url = "https://budget.dingdong.co.in/";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${url}api/profile`);
      setInstanceID(response.data[0].shopInstanceId);
      setAccessToken(response.data[0].shopAccessToken);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('You will face Error in WhatsApp Message');
    }
  };

  const fetchCustomer = async () => {
    try {
      const response = await axios.get(`${url}api/client/search?field[]=custArea&value[]=${custArea}`);
      setCustomers(response.data); // Store the customer data
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch customer data');
    }
  };

  const handleClick = async () => {
    setLoading(true); // Start loading state
    toast.info("Sending greetings, please wait...");

    await fetchCustomer();

    if (!instanceId || !accessToken || !cimgurl) {
      toast.error("Missing required data to send greetings");
      setLoading(false); // Stop loading if there's an error
      return;
    }

    try {
      const sendMessages = customers.map(customer => {
        const mobNo = customer.custMobile;
        return fetch(
          `https://bot.betablaster.in/api/send?number=91${mobNo}&type=media&media_url=${cimgurl}&instance_id=${instanceId}&access_token=${accessToken}`,
          { method: 'GET' }
        );
      });

      await Promise.all(sendMessages);

      // Notify on success
      toast.success("Messages sent successfully!");
    } catch (error) {
      // Notify on error
      //toast.error("Failed to send messages");
      console.error(error);
    } finally {
      setLoading(false); // End loading state when process completes
    }
  };

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
          'Content-Type': 'multipart/form-data',
        },
      });
      setCimgurl(response.data.location);
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("File upload failed");
      console.log(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-80">
      <div className="p-2" style={{ width: '320px' }}>
        <div className="d-grid gap-3">
          <div>
            <label>Upload File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="form-control mt-2"
            />
            <button
              type="button"
              onClick={uploadFile}
              className="btn btn-primary w-100 mt-2"
            >
              Upload
            </button>
          </div>
          <div style={{ width: '300px', height: '400px' }}>
            {cimgurl ? (
              <img src={cimgurl} className="w-100 h-100 object-fit-cover" alt="Uploaded" />
            ) : (
              <p>No image uploaded</p>
            )}
          </div>
          <div className="input-group col-md-2">
            <span className="input-group-text">Category:</span>
            <input
              type="text"
              value={custArea}
              onChange={(e) => setCustArea(e.target.value.toUpperCase())}
              className="form-control"
              placeholder="Enter Area Name"
            />
          </div>
          <button
            className="btn btn-success w-100 mt-3"
            onClick={handleClick}
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Sending..." : "Send Image"} {/* Show progress */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendImage;
