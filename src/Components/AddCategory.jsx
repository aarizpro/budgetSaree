import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddCategory = ({ show, handleClose }) => {
    const url = "https://budget.dingdong.co.in/";
    const [categoryCode, setCategoryCode] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categoryPrice, setCategoryPrice] = useState('');
   
    const handleSave = async () => {
        try {
            const newTeacher = {
                categoryCode: categoryCode,
                categoryName: categoryName,
                categoryDescription: categoryDescription,
                categoryPrice: categoryPrice
            };

            await axios.post(`${url}api/category`, newTeacher);
            toast.success('Category added successfully');


        } catch (error) {
            toast.error('Failed to add Category');
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Category Code</Form.Label>
                        <Form.Control type="text" placeholder='Enter Code ' value={categoryCode} onChange={(e) => setCategoryCode(e.target.value.toUpperCase())} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control type="text" value={categoryName} placeholder='Enter Category Name' onChange={(e) => setCategoryName(e.target.value.toUpperCase())} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Category Description</Form.Label>
                        <Form.Control type="text" value={categoryDescription} placeholder='Enter Description' onChange={(e) => setCategoryDescription(e.target.value.toUpperCase())} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Category Price</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Price"
                            value={categoryPrice}
                            onChange={(e) => setCategoryPrice(e.target.value)}
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

export default AddCategory;
