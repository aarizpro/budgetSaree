import React, { useState,useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditCustomer = ({show, handleClose, clients}) => {
    const url = "https://budget.dingdong.co.in/";
    
    const [custName, setCustName] = useState('');
    const [custMob, setCustMob] = useState('');
    const [custEmail, setCustEmail] = useState('');
    const [custAddr, setCustAddr] = useState('');
    const [custPincode, setCustPincode] = useState('');
   const [custDesc, setCustDesc] = useState('');
    useEffect(() => {
        if (clients) {
            setCustName(clients.custName);
            setCustEmail(clients.custEmail);
            setCustAddr(clients.custAddr);
            setCustMob(clients.custMobile);
            setCustPincode(clients.custPincode);
            setCustDesc(clients.custArea);
        }
    }, [clients]);
    const handleSave = async () => {
        try {
            const newTeacher = {
                custName:custName,
                custAddr:custAddr,
                custMobile:custMob,
                custEmail:custEmail,
                custPincode:custPincode,
                custArea:custDesc
            };

            await axios.put(`${url}api/client/${clients._id}`, newTeacher);
            toast.success('Customer added successfully');
            setCustName("");
            setCustEmail("");
            setCustAddr("");
            setCustMob("");
            setCustPincode("");
            setCustDesc("");
           
        } catch (error) {
           toast.error('Failed to Update Customer');
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Customer Name</Form.Label>
                        <Form.Control type="text" value={custName}  onChange={(e) => setCustName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Customer Address</Form.Label>
                        <Form.Control type="text" value={custAddr} onChange={(e) => setCustAddr(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Customer Mobile</Form.Label>
                        <Form.Control type="text" value={custMob} onChange={(e) => setCustMob(e.target.value)} />
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
                            placeholder="Enter Area"
                            value={custDesc}
                            onChange={(e) => setCustDesc(e.target.value)}
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

export default EditCustomer;
