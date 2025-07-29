const express = require('express');
const router = express.Router();
const clientController = require('../controller/client.controller');

router.get('/clients', clientController.getClients);
router.post('/clients', clientController.insertSingleClient); // <- Single insert
router.post('/clients/bulk', clientController.bulkInsertClients);

module.exports = router;
