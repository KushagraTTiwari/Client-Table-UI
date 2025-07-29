const Client = require('../model/client.model');

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.bulkInsertClients = async (req, res) => {
  try {
    const clients = req.body;
    if (!Array.isArray(clients)) {
      return res.status(400).json({ message: 'Data must be an array' });
    }

    const max = await Client.findOne().sort({ clientId: -1 }).select('clientId');
    let nextId = max?.clientId || 0;

    const clientsWithId = clients.map(client => ({
      ...client,
      clientId: ++nextId,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    const inserted = await Client.insertMany(clientsWithId, { ordered: false });
    res.status(201).json({ message: 'Clients inserted successfully', data: inserted });
  } catch (err) {
    res.status(500).json({ message: 'Bulk insert error', error: err.message });
  }
};

exports.insertSingleClient = async (req, res) => {
  try {
    const { clientName, clientType, email } = req.body;

    const max = await Client.findOne().sort({ clientId: -1 }).select('clientId');
    const nextClientId = (max?.clientId || 0) + 1;

    const newClient = new Client({
      clientId: nextClientId,
      clientName,
      clientType,
      email,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedClient = await newClient.save();
    res.status(201).json({ message: 'Client added successfully', data: savedClient });
  } catch (err) {
    res.status(500).json({ message: 'Single insert error', error: err.message });
  }
};
