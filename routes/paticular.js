var Particular = require('../data/particular');
var { omit, hasIn, get } = require('lodash');

module.exports = {
  get: async (req, res) => {
    if (req.params.id) {
      try {
        let particular = await Particular.getParticular(req.params.id, req.query);
        res.json(particular);
      } catch (error) {
        res.status(404).json({ message: 'failed to retrieve particular' });
        console.log(error);
      }
    } else {
      try {

      
        let particular = await Particular.getParticulars(req.query);
        res.json(particular);
      } catch (error) {
        res.status(400).json({ message: 'failed to retrieve particular' });
        console.log(error);
      }
    }
  },
  post: async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(400).json({ message: 'operation not allowed' });
    }
    try {
      let particular = await Particular.createParticular(req.body);
      res.json(particular);
    } catch (error) {
      res.status(400).json({ message: 'failed to create particular' });
      console.log(error);
    }
  },
  put: async (req, res) => {

    if (!req.user.isAdmin) {
      return res.status(400).json({ message: 'operation not allowed' });
    }
    var update = req.body;
    try {
      let particular = await Particular.getParticular(req.params.id);
      if (particular) {
        let particular = await Particular.updateParticular(req.params.id, update);
        res.json(particular);
      } else {
        res.status(400).json({ message: 'operation not allowed' });
      }
    } catch (error) {
      res.status(400).json({ message: 'failed to update particular' });
      console.log(error);
    }
  }
}