import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddBilling = ({ show, handleClose, shopDet, custName,custMobile,custAddr,custPincode,custEmail,custGstNo, invDate, invoiceNo }) => {
    const url = "https://budget.dingdong.co.in/";
   //const url ="https://tilesapi.onrender.com/"
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState('');
    const [productCode, setProductCode] = useState('');
    const [productDesc, setProductDesc] = useState('');
    const [productUnitPrice, setProductUnitPrice] = useState('');
    const [productGstPrice, setProductGstPrice] = useState('');
    const [discPrice, setDiscPrice] = useState(0);
    const [finalPrice, setFinalPrice] = useState('');
    const [invValue,setInvValue] =useState('');
    const[gstAmount,setGstAmount]=useState('');
    const[productCount,setProductCount]=useState('');
    const[totalAmount,setTotalAmount]=useState('');
    const handleSave = async () => {
        try {
            const newTeacher = {
                billCustName:custName,
                billCustMob:custMobile,
                billCustAddr:custAddr,
                billCustPincode:custPincode,
                billCustEmail:custEmail,
                billCustArea:custGstNo,
                billInvNumber:invoiceNo,
                billDate:invDate,
                billProductName: productName,
                billProductCategory: productGstPrice,
                billProductPrice: productUnitPrice,
                billQuantity:productCount,
                billAmount:invValue,
                billDiscount:discPrice,
                billFinalAmount:finalPrice
            };

            await axios.post(`${url}api/billing`, newTeacher);
            toast.success('Product added successfully');
            clear();

        } catch (error) {
            toast.error('Failed to add Product');
            console.error(error);
        }
    };

    const clear=()=>{
        setFinalPrice('');
        setGstAmount('');
        setTotalAmount('');
        setInvValue('');
        setProductCount('');
        setDiscPrice(0);

    }
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${url}api/product`);
            setProducts(response.data);
           
        } catch (error) {
            console.error('Error fetching courier names:', error);
        }
    };
    useEffect(() => {
        clear();
        fetchProducts();

    }, []);
    const handleCust = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        setProductName(selectedOption.value);
        setProductCode(selectedOption.getAttribute('data-productCode'));
        setProductUnitPrice(parseFloat(selectedOption.getAttribute('data-productUnitPrice')).toFixed(2));
        setProductGstPrice(selectedOption.getAttribute('data-productGstPrice'));
        setProductDesc(selectedOption.getAttribute('data-productDesc'));
        setDiscPrice(0);
       setFinalPrice(parseFloat(selectedOption.getAttribute('data-productUnitPrice')).toFixed(2));
    }

    const calcItem=(p)=>{
        var a = productGstPrice;
        var inv = p * finalPrice;
        var gst = inv * (a/100);
        var tot = inv + gst;
        setInvValue(inv.toFixed(2));
        setGstAmount(gst.toFixed(2));
        setTotalAmount(tot.toFixed(2));
    }
    const calcProduct =(e)=>{
        const p = e.target.value;
        setProductCount(p);
        calcItem(p);
    }
    const handleClose1=()=>{
        clear();
        handleClose();
    }
    const handleFinal = (e) => {
        const discount = parseFloat(e.target.value)||'0'; // Get the discount value
        const unitPrice = parseFloat(productUnitPrice); // Ensure the productUnitPrice is a number
    
        if (isNaN(discount) || isNaN(unitPrice)) {
            alert("Invalid input. Please enter valid numbers.");
            return;
        }
    
        if (discount <= unitPrice) {
            const finalPrice = unitPrice - discount;
            setFinalPrice(finalPrice >= 0 ? finalPrice : 0); // Ensure final price never goes below 0
        } else {
            alert("Discount can't exceed the MRP (unit price). Setting final price to 0.");
            setFinalPrice(0); // Set final price to 0 if discount exceeds the product unit price
        }
    };
    
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Items</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <div className='row mb-2'>
                        <div className="input-group col-md-2">
                        <span class="input-group-text">Product:</span>
                        <select
                                value={productName}
                                onChange={handleCust}
                                onClick={handleCust}
                                class="form-control "
                            >
                                <option value='' disabled>Select Product</option>
                                {products.map((name) => (
                                    <option key={name._id} value={name.productName}
                                             data-key={name._id} 
                                             data-productCode={name.productCode} 
                                             data-productUnitPrice={name.productPrice}
                                             data-productDesc={name.productDescription}
                                             data-productGstPrice={name.productCategory} >
                                        {name.productName}

                                    </option>
                                ))}
                            </select>
                        </div>
                        </div>
                        <div className='row mb-2'>
                        <div className="input-group col-md-2">
                        <span class="input-group-text">Category:</span>
                        <input
                        type="text"
                        value={productGstPrice}
                        onChange={(e) => setProductGstPrice(e.target.value)}
                        className="form-control"
                        />
                       
                        
                        </div>
                        </div>
                        <div className='row mb-2'>
                        <div className="input-group col-md-2">
                        <span class="input-group-text">Description:</span>
                        <input
                        type="text"
                        value={productDesc}
                        onChange={(e) => setProductDesc(e.target.value)}
                        className="form-control"
                        />
                        </div>
                        </div>
                        <div className='row mb-2'>
                        <div className="input-group col-md-2">
                        <span class="input-group-text">Price Per Unit:</span>
                        <input
                        type="text"
                        value={productUnitPrice}
                        onChange={(e) => setProductUnitPrice(e.target.value)}
                        className="form-control"
                        style={{ textAlign: 'right' }}
                        />
                       
                        <span class="input-group-text">Discount:</span>
                        <input
                        type="text"
                        onChange={handleFinal}
                        
                        className="form-control"
                        style={{ textAlign: 'right' }}
                        />
                         <span class="input-group-text">Final Price:</span>
                        <input
                        type="text"
                        value={finalPrice}
                        onChange={(e) => setFinalPrice(e.target.value)}
                        className="form-control"
                        style={{ textAlign: 'right' }}
                        />
                        </div>
                        </div>
                        <div className='row mb-2'>
                        <div className="input-group col-md-2">
                        <span class="input-group-text">Billing Count:</span>
                        <input
                        type="text"
                        value={productCount}
                        onChange={calcProduct}
                        className="form-control"
                        style={{ textAlign: 'center' }}
                        />
                         <span class="input-group-text">Invoice Value:</span>
                        <input
                        type="text"
                        value={invValue}
                        onChange={(e) => setInvValue(e.target.value)}
                        className="form-control"
                        style={{ textAlign: 'right' }}
                        />
                         </div>
                        </div>
                       
                    </Form.Group>
                                      
                   


                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose1}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddBilling;
