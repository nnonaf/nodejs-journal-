var Journal = require('../data/journal');
var { omit, hasIn, get } = require('lodash');

module.exports = {
  get: async (req, res) => {
    if (req.params.id) {
      try {
        let journal = await Journal.getJournal(req.params.id, req.query);
        res.json(journal);
      } catch (error) {
        res.status(404).json({ message: 'failed to retrieve journal' });
        console.log(error);
      }
    } else {
      try {

      
        let journal = await Journal.getJournals(req.query);
        res.json(journal);
      } catch (error) {
        res.status(400).json({ message: 'failed to retrieve journal' });
        console.log(error);
      }
    }
  },
  post: async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(400).json({ message: 'operation not allowed' });
    }
    try {
      let journal = await Journal.createJournal(req.body);
      res.json(journal);
    } catch (error) {
      res.status(400).json({ message: 'failed to create journal' });
      console.log(error);
    }
  },
  put: async (req, res) => {

    if (!req.user.isAdmin) {
      return res.status(400).json({ message: 'operation not allowed' });
    }
    var update = req.body;
    try {
      let journal = await Journal.getJournal(req.params.id);
      if (journal) {
        let journal = await Journal.updateJournal(req.params.id, update);
        res.json(journal);
      } else {
        res.status(400).json({ message: 'operation not allowed' });
      }
    } catch (error) {
      res.status(400).json({ message: 'failed to update journal' });
      console.log(error);
    }
  }
}