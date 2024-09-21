import React, { useState,useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditCategory = ({show, handleClose, clients}) => {
    const url = "https://budget.dingdong.co.in/";
    
    const [categoryCode, setCategoryCode] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categoryPrice, setCategoryPrice] = useState('');
    
    useEffect(() => {
        if (clients) {
            setCategoryCode(clients.categoryCode);
            setCategoryName(clients.categoryName);
            setCategoryDescription(clients.categoryDescription);
            setCategoryPrice(clients.categoryPrice);
           
        }
    }, [clients]);
    const handleSave = async () => {
        try {
            const newTeacher = {
                categoryCode:categoryCode,
                categoryName:categoryName,
                categoryDescription:categoryDescription,
                categoryPrice:categoryPrice
            };

            await axios.put(`${url}api/category/${clients._id}`, newTeacher);
            toast.success('Category Updated successfully');
            setCustName("");
            setCustEmail("");
            setCustAddr("");
            setCustMob("");
            setCustPincode("");
            setCustDesc("");
           
        } catch (error) {
          
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Category Code</Form.Label>
                        <Form.Control type="text" value={categoryCode}  onChange={(e) => setCategoryCode(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Category Description</Form.Label>
                        <Form.Control type="text" value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Category Price</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Pincode"
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

export default EditCategory;
