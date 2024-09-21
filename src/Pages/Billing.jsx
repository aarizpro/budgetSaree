import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react'
import AddBilling from '../Components/AddBilling';
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import logo from '../assets/ProfileLogo.jpg';
import { numberToWords } from 'number-to-words';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Billing = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceNo, setInvoiceNo] = useState('');
  const url = "https://budget.dingdong.co.in/";
  const [shopDetails, setShopDetails] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);
  const [custMobile, setCustMobile] = useState('');
  const [custName, setCustName] = useState('');
  const [custAddr, setCustAddr] = useState('Chennai');
  const [custPincode, setCustPincode] = useState('600001');
  const [custGstNo, setCustGstNo] = useState('Chennai');
  const [custEmail, setCustEmail] = useState('xyz@gmail.com');
  const [showModal1, setShowModal1] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [medialurl,setMediaurl]=useState("");
  const [totalInvoice, setTotalInvoice] = useState(0);
  
 
  const printRef = useRef();
  const [words, setWords] = useState('');
  const generateImage = async () => {
    if (printRef.current) {
      try {
        const canvas = await html2canvas(printRef.current);
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
       const formData = new FormData();
        formData.append("file", blob, "AirwayBill.png");
        const response = await axios.post(`${url}api/image/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response.data);
        setMediaurl(response.data);
        toast.success("Image generated and file uploaded successfully");
        
      } catch (error) {
        toast.error("Failed to generate image or upload file");
        console.error(error);
      }
    }
  };
  const handleClick = async () => {
    try {
      
      const media_url='https://aishubudgetsaree.s3.ap-south-1.amazonaws.com/AirwayBill.png';
      const messageText = "Thank You for using Aishu Budget Saree.  Have a Nice Day...."; 
      const response = await fetch(`https://bot.betablaster.in/api/send?number=91${custMobile}&type=media&message=${messageText}&media_url=${media_url}&instance_id=${shopDetails.shopInstanceId}&access_token=${shopDetails.shopAccessToken}`, {
        method: 'GET',
      });
      console.log(response.data);
      
    } catch (error) {
      console.error('Error sending message:', error);
     
    }
  };
  const saveCustomer = async () => {
    try {
      // Fetch the invoice based on the invoice number
      const response = await axios.get(`${url}api/client/search?field[]=custMobile&value[]=${custMobile}`);
      
      // Check if the invoice already exists in the database
      if (response.data.length === 0) { // Assuming response.data contains the search result
        const newInvoice = {
          custName: custName,
          custMobile: custMobile,
          custArea: custGstNo,
          custAddr:custAddr,
          custPincode:custPincode,
          custEmail:custEmail
          
        };
        
        // Save the new invoice
        await axios.post(`${url}api/client`, newInvoice);
      } 
      
    } catch (error) {
      console.log(error);
      
    }
  };
 
  const saveInvoice = async () => {
    if(totalInvoice===0){
      alert("First Add Product and Generate Invoice");
    }else{

   
    try {
      // Fetch the invoice based on the invoice number
      const response = await axios.get(`${url}api/invoice/search?field[]=invNumber&value[]=${invoiceNo}`);
      
      // Check if the invoice already exists in the database
      if (response.data.length === 0) { // Assuming response.data contains the search result
        const newInvoice = {
          invCustName: custName,
          invCustMob: custMobile,
          invDate: date,
          invNumber: invoiceNo,
          invAmount: totalInvoice
        };
        
        // Save the new invoice
        await axios.post(`${url}api/invoice`, newInvoice);
        toast.success('Invoice added successfully');
        
        // Proceed to download the image
        await saveCustomer();
        await downloadImage();
      } else {
        // If the invoice already exists
        toast.info('Invoice already saved');
        
        // Download image if needed for existing invoice
       
        await downloadImage();
      }
      
    } catch (error) {
      console.log(error);
      toast.error('Failed to add Invoice');
    }
  }
  };
  const downloadImage = async() => {
    if (printRef.current) {
      await generateImage();
      await handleClick();
      try {
      
        const canvas = await html2canvas(printRef.current);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('Invoice.pdf');

        toast.success('Downloaded');
      } catch (error) {
        console.error('Failed to generate PDF:', error);
        toast.error('Failed to download the PDF');
      }
    }
    
  }
  
  const handleConvert = () => {
    const numericAmount = parseFloat(totalInvoice);
    if (!isNaN(numericAmount)) {
      setWords(` Rupees ${numberToWords.toWords(numericAmount)}  Only.`);
    } else {
      setWords('Invalid input');
    }
  };
  // const generateInvoiceNo = async() => {
  //  const prefix = 'INV';
  //   const randomNumber = Math.floor(100000 + Math.random() * 900000);
  //   return `${prefix}-${randomNumber}`;
  // };
  const generateInvoiceNo = async () => {
    let maxInv = 0; 
    try {
        const response = await axios.get(`${url}api/invoice`); 
        let invoices = response.data;
        invoices.forEach(invoice => {
            if (invoice.invNumber > maxInv) {
                maxInv = invoice.invNumber; 
            }
        });
        setInvoiceNo(formatNumber(maxInv+1));
    } catch (error) {
        console.log(error); // Handle errors
    }

    return maxInv; // Return the maximum invNumber
};
const formatNumber = (num) => {
  // Define the total length of the string you want, e.g., 5 characters
  const length = 5;
  return num.toString().padStart(length, '0');
};

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}api/profile/66ee6cb6696d1dcc380fd583`);
      setShopDetails(response.data);
      //console.log(shopGstNo);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };
  const clearCustomerDetails = () => {
    setCustName("");
    setCustAddr("Chennai");
    setCustPincode("600001");
    setCustEmail("xyz@gmail.com");
    setCustGstNo("Chennai");
  };
  const fetchData1 = async (mobileNo) => {
    try {
      const response = await axios.get(`${url}api/client/search`, {
        params: {
          'field[]': 'custMobile',
          'value[]': mobileNo,
        },
      });
  
      const data = response.data;
  
      if (data.length > 0) {
        const customer = data[0];
        setCustName(customer.custName || "");
        setCustAddr(customer.custAddr || "");
        setCustPincode(customer.custPincode || "");
        setCustEmail(customer.custEmail || "");
        setCustGstNo(customer.custArea || "");
        setCustomerDetails(customer);
      } else {
        clearCustomerDetails(); // Call the function to clear details
      }
    } catch (error) {
      clearCustomerDetails(); // Clear in case of an error
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch customer data');
    }
  };
  const handleMobno = (e) => {
    const mobileNo = e.target.value;
    setCustMobile(mobileNo);
    
    if (mobileNo.length === 10) {
      fetchData1(mobileNo);
    }else {
     
      setCustName("");
      setCustAddr("");
      setCustPincode("");
      setCustEmail("");
      setCustGstNo("");
    }

  }
  useEffect(() => {
    fetchData();
   generateInvoiceNo();

  }, []);
  useEffect(() => {
    handleConvert();
  }, [totalInvoice]);
  const AddProduct = () => {

    if (custMobile === "" || custName === "" || custAddr === "" || custPincode === "" || custEmail === "" || custGstNo === "") {
      alert("Enter All Details");
    } else {
      setShowModal1(true);
      fetchData2(invoiceNo);

    }

  }
  const handleClose = () => {
    setShowModal1(false);
    fetchData2(invoiceNo);


  };
  const deleteAirway = async (id) => {
    try {
      await axios.delete(`${url}api/billing/${id}`);
      toast.success('Deleted Successfully');
      
    } catch (error) {
      //toast.error('Failed to delete');
      console.log(error);
    }
    fetchData();
      fetchData2(invoiceNo);

  };
  const fetchData2 = async (inno) => {
    try {
      const response = await axios.get(`${url}api/billing/search?field[]=billInvNumber&value[]=${inno}`);
      const data = response.data;

      const totalInvoiceValue = data.reduce((sum, item) => sum + parseFloat(item.billAmount || 0), 0);
      setData(data);
      setTotalInvoice(totalInvoiceValue.toFixed(2));

    } catch (error) {
      console.error('Error fetching data:', error);
      // toast.error('Failed to fetch data');
    }
  };

  const filteredData = data.filter(row =>
    row.billProductName.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      name: 'Date',
      selector: row => row.billDate,
    },
    {
      name: 'Invoice No',
      selector: row => row.billInvNumber,
    },
    {
      name: 'Cust Name',
      selector: row => row.billCustName,
    },
    {
      name: 'Product Name',
      selector: row => row.billProductName,
      wrap: true, // Ensures the text is wrapped
      style: {
        width: '200px', // Fix the column width
      },
    },
    {
      name: 'Category',
      selector: row => row.billProductCategory,
      wrap: true, // Ensures the text is wrapped
      style: {
        width: '200px', // Fix the column width
      },
    },
    {
      name: 'Unit Price',
      selector: row => row.billFinalAmount,
    },
    {
      name: 'Count',
      selector: row => row.billQuantity,
    },
    {
      name: 'Invoice Value',
      selector: row => row.billAmount,
    },
    {
      name: 'Action',
      cell: row => (
        <div className="d-flex justify-content-between p-2">
          <div className='p-2'>
            <button
              onClick={() => deleteAirway(row._id)}
              class="btn btn-danger"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      ),
    },
  ];

  const columns1 = [

    {
      name: 'Product Name',
      selector: row => row.billProductName,
    },
    {
      name: 'Category',
      selector: row => row.billProductCategory,
    },
    {
      name: 'Unit Price',
      selector: row => row.billFinalAmount,
      right: true
    },
    {
      name: 'Count',
      selector: row => row.billQuantity,
      center: true
    },
    {
      name: 'Bill Value',
      selector: row => row.billAmount,
      right: true
    }
  ];
  const handleInvoice = (e) => {
    const a = e.target.value.toUpperCase();
    setInvoiceNo(a);
    fetchData2(a);

  }

  return (
    <div className="container p-1 w-75">
      <div className="row mb-2">
        <div className="input-group col-md-2">
          <span class="input-group-text">Date:</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-control"
          />

          <span class="input-group-text">Invoice No:</span>

          <input
            type="text"
            value={invoiceNo}
            onChange={handleInvoice}
            className="form-control"
          />
         
          
        </div>
      </div>
      <div className="row mb-2">
        <div className="input-group col-md-2">
          <span class="input-group-text">Mobile No:</span>

          <input
            type="text"
            value={custMobile}
            onChange={handleMobno}
            className="form-control"
            placeholder='Enter Customer Mobile No'
          />
          <span class="input-group-text">Customer Name:</span>

          <input
            type="text"
            value={custName}
            onChange={(e) => setCustName(e.target.value.toUpperCase())}
            className="form-control"
            placeholder='Enter Customer Name'
          />
        </div>
      </div>
      <div className="row mb-2">
        <div className="input-group col-md-2">
          <span class="input-group-text">Address:</span>

          <textarea
            type="text"
            value={custAddr}
            onChange={(e) => setCustAddr(e.target.value.toUpperCase())}
            className="form-control"
            placeholder='Enter Customer Address'
          />

        </div>
      </div>
      <div className="row mb-2">
        <div className="input-group col-md-2">
          <span class="input-group-text">Pincode:</span>
          <input
            type="number"
            value={custPincode}
            onChange={(e) => setCustPincode(e.target.value)}
            className="form-control"
            placeholder='Enter Pincode'
          />

          <span class="input-group-text">Email ID:</span>

          <input
            type="text"
            value={custEmail}
            onChange={(e) => setCustEmail(e.target.value)}
            className="form-control"
            placeholder='Enter Email ID'
          />
          <span class="input-group-text">Area :</span>

          <input
            type="text"
            value={custGstNo}
            onChange={(e) => setCustGstNo(e.target.value.toUpperCase())}
            className="form-control"
            placeholder='Enter Area Name'
          />
        </div>
      </div>
      <div className="row mb-2">
        <div className="input-group col-md-2">
          
          <span class="input-group-text">Total Invoice Value: </span>
          <input
            type="text"
            value={totalInvoice}
            onChange={(e) => setTotalInvoice(e.target.value.toUpperCase())}
            className="form-control"
            placeholder='0.00'
            style={{ textAlign: 'right' }}
          />
          <button className='btn btn-primary' onClick={saveInvoice}><i class="bi bi-key-fill"></i> Genrate Invoice</button>
          <button className='btn btn-success' onClick={AddProduct}><i class="bi bi-cart-plus-fill"></i> Add Item</button>
        </div>
      </div>

      <div className='w-1/1 pt-4 pl-4 rounded flex flex-col'>
        <div className="flex-grow">
          <DataTable
            columns={columns}
            data={filteredData}
            selectableRows
            fixedHeader
            pagination
          />
        </div>
      </div>
      <AddBilling
        show={showModal1}
        shopDet={shopDetails}
        custName={custName}
        custAddr={custAddr}
        custEmail={custEmail}
        custMobile={custMobile}
        custPincode={custPincode}
        custGstNo={custGstNo}
        invoiceNo={invoiceNo}
        invDate={date}
        handleClose={handleClose}
      />
      {/* <div ref={printRef} className="my-4 border border-dark">
        <div className="row mb-2">
          <div className="col-md-12 p-2 d-flex justify-content-center align-items-center w-100">
            <img src={logo} alt="Agency Logo" className="img-fluid w-75" style={{ height: '100%', objectFit: 'cover' }} />
          </div>

        </div>
        <div className="row mb-2">
          <div className="col-md-6 p-2 d-flex justify-content-start align-items-center border border-dark">
            <p>Date:</p>
          </div>
          <div className="col-md-6 p-2 d-flex justify-content-end align-items-center border border-dark">
            <p>GST No:</p>
          </div>
        </div>
      </div> */}
      <div ref={printRef} className="my-4 border border-dark" style={{ overflow: 'hidden' }}>
        <div className='p-4'>
        <div className="row mb-2">
          <div className="col-md-12 p-2 d-flex justify-content-center align-items-center w-100">
            <img src={logo} alt="Agency Logo" className="img-fluid" style={{   width: "800px", height: "120px"}} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12  d-flex justify-content-center align-items-center border border-dark">
            <p className='fw-bold'>INVOICE</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6  d-flex justify-content-start align-items-center border border-dark">
            <p className='px-2'>Date: {date}</p>
          </div>
          <div className="col-md-6 d-flex justify-content-end align-items-center border border-dark">
            <p></p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 d-flex flex-column justify-content-start align-items-start border border-dark">
            <p className="px-2 fw-bold mb-2">Ship/Bill To:</p>
            <p className="px-2 mb-2">{custName}</p>
            <p className="px-2 mb-2">{custAddr}</p>
            <p className="px-2 mb-2">{custPincode}</p>
            <p className="px-2 mb-2">{custMobile}</p>
            <p className="px-2 mb-2">{custEmail}</p>
            <p className="px-2 mb-2">{custGstNo}</p>
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-start align-items-end border border-dark">
            <p className="mb-2">Invoice No: {invoiceNo}</p>
            <p className="mb-2">Invoice Date: {date}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12  d-flex justify-content-center align-items-center border border-dark">
            <DataTable
              columns={columns1}
              data={filteredData}
              fixedHeader
              style={{ width: '100%' }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6  d-flex justify-content-start align-items-start border border-dark">
            <p className='fw-bold p-2'>Amount in Words: </p>
            <p className='p-2'>{words}</p>
          </div>
          <div className="col-md-6 d-flex flex-column justify-content-start align-items-end border border-dark">
            <p className="mb-2 fw-bold"></p>
            <p className="mb-2 fw-bold"></p>
            <p className="mb-2 fw-bold">Total Invoice Amount: {totalInvoice}</p>
          </div>
        </div>
        <div className="row">
        <div className="col-md-12 d-flex flex-column justify-content-start align-items-end border border-dark">
            <p className="mb-5">For Aishu Budget Sarees</p>
            <p className="mb-2">Authorised Signature </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Billing