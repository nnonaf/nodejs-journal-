var Transaction = require('../data/transaction');
var { omit, hasIn, get } = require('lodash');

module.exports = {
  get: async (req, res) => {
    if (req.params.id) {
      try {
        let transaction = await Transaction.getTransaction(req.params.id, req.query);
        res.json(transaction);
      } catch (error) {
        res.status(404).json({ message: 'failed to retrieve transaction' });
        console.log(error);
      }
    } else {
      try {

      
        let transaction = await Transaction.getTransactions(req.query);
        res.json(transaction);
      } catch (error) {
        res.status(400).json({ message: 'failed to retrieve transaction' });
        console.log(error);
      }
    }
  },
  post: async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(400).json({ message: 'operation not allowed' });
    }
    try {
      let transaction = await Transaction.createTransaction(req.body);
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: 'failed to create transaction' });
      console.log(error);
    }
  },
  put: async (req, res) => {

    if (!req.user.isAdmin) {
      return res.status(400).json({ message: 'operation not allowed' });
    }
    var update = req.body;
    try {
      let transaction = await Transaction.getTransaction(req.params.id);
      if (transaction) {
        let transaction = await Transaction.updateTransaction(req.params.id, update);
        res.json(transaction);
      } else {
        res.status(400).json({ message: 'operation not allowed' });
      }
    } catch (error) {
      res.status(400).json({ message: 'failed to update transaction' });
      console.log(error);
    }
  }
}