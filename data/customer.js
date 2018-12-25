var { Customer } = require('../models');
var { generateSearchQuery, generateGetSingleQuery } = require('./utils');

var createCustomer = async (data) => {
  try {
    let customer = new Customer(data);
    return await customer.save();
  } catch (error) {
    throw error;
  }
}

var getCustomers = async (cond) => {
  try {
    return await generateSearchQuery(Customer, cond);
  } catch (error) {
    throw error;
  }
};

var getCustomer = async (cond, options) => {
  try {
    return await generateGetSingleQuery(Customer, cond, options);
  } catch (error) {
    throw error;
  }
}

var updateCustomer = async (cond, data) => {
  try {
    data = Object.assign({}, data, { updatedAt: new Date() });
    switch (typeof cond) {
      case 'string':
        return await Customer.findByIdAndUpdate(cond, data, { new: true });
      default:
        return await Customer.updateMany(cond, data);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer  
};var { Customer } = require('../models');
var { generateSearchQuery, generateGetSingleQuery } = require('./utils');

var createCustomer = async (data) => {
  try {
    let office = new Customer(data);
    return await office.save();
  } catch (error) {
    throw error;
  }
}

var getCustomers = async (cond) => {
  try {
    return await generateSearchQuery(Customer, cond);
  } catch (error) {
    throw error;
  }
};

var getCustomer = async (cond, options) => {
  try {
    return await generateGetSingleQuery(Customer, cond, options);
  } catch (error) {
    throw error;
  }
}

var updateCustomer = async (cond, data) => {
  try {
    data = Object.assign({}, data, { updatedAt: new Date() });
    switch (typeof cond) {
      case 'string':
        return await Customer.findByIdAndUpdate(cond, data, { new: true });
      default:
        return await Customer.updateMany(cond, data);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer  
};