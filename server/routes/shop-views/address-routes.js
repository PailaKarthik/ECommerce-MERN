
const express = require('express');
const router = express.Router();

const {addAddress,fetchAllAddress,editAddress,deleteAddress} = require('../../controllers/shop/address-controller')


// Get all addresses for a user
router.post('/add', addAddress);
router.get('/get/:userId', fetchAllAddress);
router.put('/edit/:userId/:addressId', editAddress);
router.delete('/delete/:userId/:addressId', deleteAddress);

module.exports = router;