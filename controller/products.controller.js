const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Use path.join with __dirname to ensure the file path is correct
const filePath = path.join(__dirname, '../productList.json');
const adminDataPath = path.join(__dirname, '../admin.json');

const readProducts = () => {
    try {
        if (!fs.existsSync(filePath)) {
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading product list:", error);
        return [];
    }
};

const readAdminData = () => {
    try {
        if (!fs.existsSync(adminDataPath)) {
            return [];
        }
        const data = fs.readFileSync(adminDataPath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading product list:", error);
        return [];
    }

};

const writeProducts = (products) => {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
};

const getAllProducts = (req, res) => {
    try {
        const products = readProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error("Failed:", error);
        res.status(500).json({ message: error.message });
    }
};

const createProduct = (req, res) => {
    const newProduct = req.body;
    const products = readProducts();

    products.push(newProduct);
    writeProducts(products);

    res.status(201).json({ message: 'Product added successfully' });
};

const updateProduct = (req, res) => {
    const { barcode } = req.params;
    const updatedProduct = req.body;

    let products = readProducts();

    const productIndex = products.findIndex((product) => product.barcode === barcode);

    if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...updatedProduct };

        writeProducts(products);

        res.status(200).json({ message: 'Product updated successfully' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
}

const deleteProduct = (req, res) => {
    const { barcode } = req.params;

    let products = readProducts();

    const newProductList = products.filter((product) => product.barcode !== barcode);

    if (newProductList.length !== products.length) {
        writeProducts(newProductList);
        res.status(200).json({ message: 'Product deleted successfully' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
}

const payProducts = (req, res) => {
    const { barcode, quantity } = req.body;

    let products = readProducts();

    const productIndex = products.findIndex((product) => product.barcode === barcode);

    if (productIndex !== -1) {
        const product = products[productIndex];
        if (product.stock >= quantity) {
            product.stock -= quantity;

            writeProducts(products);
            res.status(200).json({ message: 'Payment successful', product });
        } else {
            res.status(400).json({ message: 'Not enough stock available' });
        }
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
}

const login = (req, res) => {
    const { username, password } = req.body;
    const adminData = readAdminData();

    if (!adminData) {
        return res.status(500).json({ message: 'Data admin tidak ditemukan' });
    }

    const admin = adminData.admin.find(
        (admin) => admin.username === username && admin.password === password
    );

    if (admin) {
        const token = jwt.sign(
            { id: adminData.admin.username, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('jwt', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
        res.status(200).json({
            message: 'Login berhasil',
            token
        });
    } else {
        res.status(401).json({ message: 'Username atau password salah' });
    }
};

const decodeToken = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json(decoded.username);
};


const validateLogin = (req, res) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: 'Sesi belum dibuat' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid session' });
        }
        // Session is valid
        res.status(200).json({ message: 'Session active', user: decoded });
    });
};



module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    payProducts,
    login,
    decodeToken,
    validateLogin
};
