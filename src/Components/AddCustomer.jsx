import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddCustomer = ({ show, handleClose }) => {
    const url = "https://budget.dingdong.co.in/";
    const [custName, setCustName] = useState('');
    const [custMobile, setCustMobile] = useState('');
    const [custEmail, setCustEmail] = useState('');
    const [custAddr, setCustAddr] = useState('');
    const [custPincode, setCustPincode] = useState('');
    const [custArea, setCustArea] = useState('');
    const handleSave = async () => {
        try {
            const newTeacher = {
                custName: custName,
                custAddr: custAddr,
                custMobile: custMobile,
                custEmail: custEmail,
                custPincode: custPincode,
                custArea: custArea
            };

            await axios.post(`${url}api/client`, newTeacher);
            toast.success('Customer added successfully');


        } catch (error) {
            toast.error('Failed to add Customer');
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Customer Mobile</Form.Label>
                        <Form.Control type="text" placeholder='Enter Mobile ' value={custMobile} onChange={(e) => setCustMobile(e.target.value.toUpperCase())} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Customer Name</Form.Label>
                        <Form.Control type="text" value={custName} placeholder='Enter Customer Name ' onChange={(e) => setCustName(e.target.value.toUpperCase())} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Customer Address</Form.Label>
                        <Form.Control type="text" value={custAddr} placeholder='Enter Address' onChange={(e) => setCustAddr(e.target.value.toUpperCase())} />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Customer Pincode</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Pincode"
                            value={custPincode}
                            onChange={(e) => setCustPincode(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Customer Email</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Email"
                            value={custEmail}
                            onChange={(e) => setCustEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Customer Area</Form.Label>
                        <Form.Control 
                        type="text"  
                        placeholder='Enter Area '
                        value={custArea} 
                        onChange={(e) => setCustArea(e.target.value.toUpperCase())} />
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

export default AddCustomer;
