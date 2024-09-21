import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';

const InvoiceReport = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const url = "https://budget.dingdong.co.in/";
  //const url ="https://tilesapi.onrender.com/"
 
  
  useEffect(() => {
    fetchData();
  }, []);
 
  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}api/invoice`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };

  const filteredData = data.filter(row => 
    row.invCustName.toLowerCase().includes(search.toLowerCase())
  );

  

  const columns = [
    {
        name: 'Invoice Date',
        selector: row => row.invDate,
        sortable: true, 
        csvKey: 'invDate' 
      },
    {
      name: 'Invoice No',
      selector: row => row.invNumber,
      sortable: true, 
        csvKey: 'invNumber' 
    },
    {
      name: 'Customer',
      selector: row => row.invCustName,
      sortable: true, 
        csvKey: 'custName' 
    },
    {
      name: 'Mobile',
      selector: row => row.invAmount,
      sortable: true, 
        csvKey: 'invAmount' 
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
  const deleteAirway = async (id) => {
    try {
      await axios.delete(`${url}api/invoice/${id}`);
      toast.success('Deleted Successfully');
      fetchData();
    } catch (error) {
      //toast.error('Failed to delete');
      console.log(error);
    }
    fetchData();
  };

  return (
    <div className='flex'>
      <div className='w-1/2 max-w-lg bg-white shadow-lg p-7 rounded mt-2'>
        <h2 className='font-semibold  mb-2 block text-center'>
         Invoice  Details
        </h2>
        
      </div>

      <div className='w-1/1 pt-4 pl-4 rounded flex flex-col'>
      <div className="d-flex justify-content-between mb-2 p-2">
        <div className='p-2'>
        <input 
          type="text" 
          placeholder="Search by Customer Name" 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className='mb-4 p-2 border border-gray-300 rounded'
        />
        </div>
       
        </div>
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
     
    </div>
  );
}

export default InvoiceReport;
