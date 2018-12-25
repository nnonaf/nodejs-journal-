var { Trasaction } = require('../models');
var { generateSearchQuery, generateGetSingleQuery } = require('./utils');

var createTrasaction = async (data) => {
  try {
    let transaction = new Trasaction(data);
    return await transaction.save();
  } catch (error) {
    throw error;
  }
}

var getTrasactions = async (cond) => {
  try {
    return await generateSearchQuery(Trasaction, cond);
  } catch (error) {
    throw error;
  }
};

var getTrasaction = async (cond, options) => {
  try {
    return await generateGetSingleQuery(Trasaction, cond, options);
  } catch (error) {
    throw error;
  }
}

var updateTrasaction = async (cond, data) => {
  try {
    data = Object.assign({}, data, { updatedAt: new Date() });
    switch (typeof cond) {
      case 'string':
        return await Trasaction.findByIdAndUpdate(cond, data, { new: true });
      default:
        return await Trasaction.updateMany(cond, data);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createTrasaction,
  getTrasactions,
  getTrasaction,
  updateTrasaction  
};