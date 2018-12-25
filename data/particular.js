var { Particular } = require('../models');
var { generateSearchQuery, generateGetSingleQuery } = require('./utils');

var createParticular = async (data) => {
  try {
    let particular = new Particular(data);
    return await particular.save();
  } catch (error) {
    throw error;
  }
}

var getParticulars = async (cond) => {
  try {
    return await generateSearchQuery(Particular, cond);
  } catch (error) {
    throw error;
  }
};

var getParticular = async (cond, options) => {
  try {
    return await generateGetSingleQuery(Particular, cond, options);
  } catch (error) {
    throw error;
  }
}

var updateParticular = async (cond, data) => {
  try {
    data = Object.assign({}, data, { updatedAt: new Date() });
    switch (typeof cond) {
      case 'string':
        return await Particular.findByIdAndUpdate(cond, data, { new: true });
      default:
        return await Particular.updateMany(cond, data);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createParticular,
  getParticulars,
  getParticular,
  updateParticular  
};