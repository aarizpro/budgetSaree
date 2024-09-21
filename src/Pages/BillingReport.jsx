import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { CSVLink } from 'react-csv';

const BillingReport = () => {
  const [data, setData] = useState([]);
  const [searchAwb, setSearchAwb] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const url = "https://budget.dingdong.co.in/";
 //const url ="https://tilesapi.onrender.com/"
  
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}api/billing?sortBy[]=createdAt&sortOrder[]=desc`);
      console.log(response.data); // Log data to check structure
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };
  const filterDataByDate = () => {
    const filteredData = data.filter(row => {
      const rowDate = new Date(row.createdAt);
      const start = fromDate ? new Date(fromDate) : new Date("1900-01-01");
      const end = toDate ? new Date(toDate) : new Date();
  
      // Set end date time to the end of the day to include entries on that date
      end.setHours(23, 59, 59, 999);
  
      return rowDate >= start && rowDate <= end;
    });
    setData(filteredData);
  };
  const filteredData = data.filter(row => 
    (searchAwb === "" || row.billInvNumber.toLowerCase().includes(searchAwb.toLowerCase()))
  );

  console.log("Filtered Data:", filteredData); // Log filtered data

  const columns = [
    { name: 'Date', selector: row => row.billDate, sortable: true, csvKey: 'billDate' },
    { name: 'Name', selector: row => row.billCustName, sortable: true, csvKey: 'billCustName' },
    { name: 'Address', selector: row => row.billCustAddr, sortable: true, csvKey: 'billCustAddr' },
    { name: 'Mobile', selector: row => row.billCustMob, sortable: true, csvKey: 'billCustMob' },
    { name: 'Email', selector: row => row.billCustEmail, sortable: true, csvKey: 'billCustEmail' },
    { name: 'Pincode', selector: row => row.billCustPincode, sortable: true, csvKey: 'billCustPincode' },
    { name: 'Area', selector: row => row.billCustArea, sortable: true, csvKey: 'billCustArea' },
    { name: 'Invoice No', selector: row => row.billInvNumber, sortable: true, csvKey: 'billInvNumber' },
    { name: 'Category', selector: row => row.billProductCategory, sortable: true, csvKey: 'billProductCategory' },
    { name: 'Product', selector: row => row.billProductName, sortable: true, csvKey: 'billProductName' },
    { name: 'Unit Price', selector: row => row.billFinalAmount, sortable: true, csvKey: 'billFinalAmount' },
    { name: 'Quantity', selector: row => row.billQuantity, sortable: true, csvKey: 'billQuantity' },
    { name: 'Bill Amount', selector: row => row.billAmount, sortable: true, csvKey: 'billAmount' },
    {
      name: 'Action',
      cell: row => (
        <div>
          <button
            onClick={() => deleteAirway(row._id)}
            className='btn btn-danger'
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const csvHeaders = columns
    .filter(col => col.csvKey) // Filter out columns that don't have a `csvKey`
    .map(col => ({ label: col.name, key: col.csvKey }));

  const deleteAirway = async (id) => {
    try {
      await axios.delete(`${url}api/billing/${id}`);
      toast.success('Deleted Successfully');
      
    } catch (error) {
      //toast.error('Failed to delete');
      console.log(error);
    }
    fetchData();
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div className="bg-white shadow-lg p-4 rounded-lg container">
      <h1 className="text-center font-weight-bold mb-3">
        Billing Details
      </h1>
      <div className="d-flex justify-content-end mb-3">
        <CSVLink
          data={filteredData}
          headers={csvHeaders}
          filename={"billing-report.csv"}
          className="btn btn-primary"
        >
          Download CSV
        </CSVLink>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-auto">
          <label className="form-label">From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-auto">
          <label className="form-label">To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-auto align-self-end">
          <button
            onClick={filterDataByDate}
            className="btn btn-primary"
          >
            Show Data
          </button>
        </div>
        <div className="col-auto align-self-end">
          <input
            type="text"
            placeholder="Search by Invoice No"
            value={searchAwb}
            onChange={(e) => setSearchAwb(e.target.value)}
            className="form-control"
          />
        </div>
       
      </div>
      <div className="flex-grow-1">
        <DataTable
          columns={columns}
          data={filteredData}
          fixedHeader
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5]}
          responsive
          highlightOnHover
          striped
          customStyles={{
            headCells: {
              style: {
                fontSize: '16px',
                fontWeight: 'bold',
                backgroundColor: '#f5f5f5',
                textAlign: 'center',
              },
            },
            cells: {
              style: {
                fontSize: '14px',
                textAlign: 'center',
              },
            },
            rows: {
              style: {
                minHeight: '56px',
              },
            },
          }}
        />
      </div>
    </div>
  </div>
  
  );
};

export default BillingReport;
