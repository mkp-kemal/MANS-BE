const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, payProducts, login, decodeToken, validateLogin } = require('../controller/products.controller');
const protectRoute = require('../middleware/protected');
const router = express.Router();

router.get('/all-products', protectRoute, getAllProducts);
router.post('/add-products', createProduct);
router.put('/update-product/:barcode', updateProduct);
router.delete('/delete-product/:barcode', deleteProduct);
router.post('/pay', payProducts);
router.post('/login', login);
router.get('/me', protectRoute, decodeToken);
router.get('/validate', validateLogin);


module.exports = router;
