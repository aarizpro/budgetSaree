import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import AddCategory from '../Components/AddCategory';
import EditCategory from '../Components/EditCategory';

const Category = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedClients, setSelectedClients] = useState(null);
  const [showModal1, setShowModal1] = useState(false);
   const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const url = "https://budget.dingdong.co.in/";
  const fetchData = async () => {
    try {
      const response = await axios.get(`${url}api/category`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };
  useEffect(()=>{
    fetchData();
  },[]);

  const filteredData = data.filter(row => 
    row.categoryName.toLowerCase().includes(search.toLowerCase())
  );
  const columns = [
    {
        name: 'Category Code',
        selector: row => row.categoryCode,
      },
    {
      name: 'Name',
      selector: row => row.categoryName,
    },
    {
      name: 'Description',
      selector: row => row.categoryDescription,
    },
    {
      name: 'Price',
      selector: row => row.categoryPrice,
    },
   
    {
      name: 'Action',
      cell: row => (
        <div className="d-flex justify-content-between p-2">
            <div className='p-2'> 
          <button
            onClick={() => editAirway(row)}
            class="btn btn-success"
          >
           <i class="bi bi-pencil-square"></i> 
          </button>
          </div>

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
  const editAirway = (row) => {
   
    handleEdit(row);
    fetchData();
  };
  const handleEdit = (clients) => {
    setSelectedClients(clients);
    setShowModal(true);
    fetchData();
    
  };
  const handleClose = () => {
    setShowModal1(false);
    setShowModal(false);
    setSelectedClients(null);
    fetchData();
    
   };
   const handleAdd = () => {
    setShowModal1(true);
    fetchData();
};
  const deleteAirway = async (id) => {
    try {
      await axios.delete(`${url}api/category/${id}`);
      toast.success('Deleted Successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
      console.log(error);
    }
  };

  return (
    <div className='flex'>
      <div className='w-1/2 max-w-lg bg-white shadow-lg p-7 rounded mt-2'>
        <h2 className='font-semibold  mb-2 block text-center'>
         Category Details
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
        <div className='p-2'>
        <button type="button" class="btn btn-success" onClick={handleAdd}><i class="bi bi-person-plus-fill"></i></button>
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
      {selectedClients && (
                <EditCategory
                    show={showModal}
                    handleClose={handleClose}
                    clients={selectedClients}
                    
                />
            )}
      <AddCategory
                show={showModal1}
                handleClose={handleClose}
       />

      </div>
  )
}

export default Category