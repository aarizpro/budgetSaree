import React, { useState,useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditProduct = ({show, handleClose, clients}) => {
    const url = "https://budget.dingdong.co.in/";
    const [category, setCategory] = useState([]);
    const [productCode, setProductCode] = useState('');
    const [productName, setProductName] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    useEffect(() => {
        if (clients) {
          setProductCode(clients.productCode);
          setProductName(clients.productName);
          setProductCategory(clients.productCategory);
          setProductDescription(clients.productDescription);
          setProductPrice(clients.productPrice);
           
        }
    }, [clients]);
    const handleCust = (e) => {
      const selectedOption = e.target.options[e.target.selectedIndex];
      setProductCategory(selectedOption.value);
  }
  const fetchProducts = async () => {
      try {
          const response = await axios.get(`${url}api/category`);
          setCategory(response.data);
      } catch (error) {
          console.error('Error fetching courier names:', error);
      }
  };
  useEffect(() => {
     
      fetchProducts();
      

  }, []);
    const handleSave = async () => {
        try {
            const newTeacher = {
              productCode: productCode,
              productName: productName,
              productCategory: productCategory,
              productDescription: productDescription,
              productPrice:productPrice
            };

            await axios.put(`${url}api/product/${clients._id}`, newTeacher);
            toast.success('Customer added successfully');
            setProductCode("");
            setProductName("");
            setProductCategory("");
            setProductDescription("");
            setProductPrice("");
            
           
        } catch (error) {
           toast.error('Failed to Update Customer');
            console.error(error);
        }
    };

    return (
      <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <Form>
              <Form.Group>
                  <Form.Label>Product Code</Form.Label>
                  <Form.Control type="text"
                   placeholder='Enter Code ' 
                   value={productCode} onChange={(e) => 
                   setProductCode(e.target.value.toUpperCase())} />
              </Form.Group>
              <Form.Group>
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control type="text"
                   value={productName} 
                   placeholder='Enter Product Name'
                    onChange={(e) => setProductName(e.target.value.toUpperCase())} />
              </Form.Group>
              <div className='row p-2'>
                  <div className="input-group col-md-2">
                  <span class="input-group-text">Category:</span>
                  <select
                          value={productCategory}
                          onChange={handleCust}
                          onClick={handleCust}
                          class="form-control "
                      >
                          <option value='' disabled>Select Category</option>
                          {category.map((name) => (
                              <option key={name._id} value={name.categoryName}
                                       data-key={name._id} 
                                        >
                                  {name.categoryName}

                              </option>
                          ))}
                      </select>
                  </div>
                  </div>
              <Form.Group>
                  <Form.Label>Product Description</Form.Label>
                  <Form.Control type="text" value={productDescription} placeholder='Enter Description' onChange={(e) => setProductDescription(e.target.value.toUpperCase())} />
              </Form.Group>

              <Form.Group>
                  <Form.Label>Product Price</Form.Label>
                  <Form.Control
                      type="text"
                      placeholder="Enter Price"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                  />
              </Form.Group>
             
          </Form>
      </Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
              Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
              Save
          </Button>
      </Modal.Footer>
  </Modal>
    );
};

export default EditProduct;
