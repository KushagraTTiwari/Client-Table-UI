const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ debug: false });

const clientRoutes = require('./routes/client.route');

const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use('/api', clientRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
