const mongoose = require('mongoose');
const { INDIVIDUAL, COMPANY } = require('../utils/enum');

const clientSchema = new mongoose.Schema({
    clientId: { type: Number, required: true, unique: true },
    clientName: { type: String, required: true },
    clientType: { type: String, enum: [INDIVIDUAL, COMPANY], required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
