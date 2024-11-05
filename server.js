const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const userRoutes = require('./routes/api.routes');
const cookieParser = require('cookie-parser');
const PORT = 5000;

//config .env
dotenv.config();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
// Use cookie-parser
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Routes
app.use('/v1/api/', userRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
