var Customer = require('../data/customer');
var { omit, hasIn, get } = require('lodash');

module.exports = {
  get: async (req, res) => {
    if (req.params.id) {
      try {
        let customer = await Customer.getCustomer(req.params.id, req.query);
        res.json(customer);
      } catch (error) {
        res.status(404).json({ message: 'failed to retrieve customer' });
        console.log(error);
      }
    } else {
      try {

      
        let customer = await Customer.getCustomers(req.query);
        res.json(customer);
      } catch (error) {
        res.status(400).json({ message: 'failed to retrieve customer' });
        console.log(error);
      }
    }
  },
  post: async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(400).json({ message: 'operation not allowed' });
    }
    try {
      let customer = await Customer.createCustomer(req.body);
      res.json(customer);
    } catch (error) {
      res.status(400).json({ message: 'failed to create customer' });
      console.log(error);
    }
  },
  put: async (req, res) => {

    if (!req.user.isAdmin) {
      return res.status(400).json({ message: 'operation not allowed' });
    }
    var update = req.body;
    try {
      let customer = await Customer.getCustomer(req.params.id);
      if (customer) {
        let customer = await Customer.updateCustomer(req.params.id, update);
        res.json(customer);
      } else {
        res.status(400).json({ message: 'operation not allowed' });
      }
    } catch (error) {
      res.status(400).json({ message: 'failed to update customer' });
      console.log(error);
    }
  }
}