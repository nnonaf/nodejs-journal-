var { Journal } = require('../models');
var { generateSearchQuery, generateGetSingleQuery } = require('./utils');

var createJournal = async (data) => {
  try {
    let journal = new Journal(data);
    return await journal.save();
  } catch (error) {
    throw error;
  }
}

var getJournals = async (cond) => {
  try {
    return await generateSearchQuery(Journal, cond);
  } catch (error) {
    throw error;
  }
};

var getJournal = async (cond, options) => {
  try {
    return await generateGetSingleQuery(Journal, cond, options);
  } catch (error) {
    throw error;
  }
}

var updateJournal = async (cond, data) => {
  try {
    data = Object.assign({}, data, { updatedAt: new Date() });
    switch (typeof cond) {
      case 'string':
        return await Journal.findByIdAndUpdate(cond, data, { new: true });
      default:
        return await Journal.updateMany(cond, data);
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createJournal,
  getJournals,
  getJournal,
  updateJournal  
};