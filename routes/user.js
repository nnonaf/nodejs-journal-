var User = require('../data/user');
var { omit, hasIn, get } = require('lodash');

module.exports = {
  get: async (req, res) => {
    console.log(req.cookies)

    res.render('pages/signup');
  },


  post: async (req, res) => {
    try {
      let user = await User.createUser(req.body);
      await res.cookie("name", user.name, { maxAge: 604800000, httpOnly: true });
      await res.cookie('id', user._id, { maxAge: 900000, httpOnly: true }, { signed: true });
      res.json(user);
    } catch (error) {
      res.json({ message: 'failed to update user',
      status: 400
    });
      console.log(error);

    }




  },
  put: async (req, res) => {
    // checking if user is an admin


    try {
      if (req.user.isAdmin) {
        var update = req.body;

        let user = await User.updateUser(req.params.id, update);

        res.json(user);
      } else if (req.user.isSubAdmin) {
        if (hasIn(update, 'isAdmin') || hasIn(update, 'isSubAdmin') || hasIn(update, 'gender')
          || hasIn(update, 'rank') ||
          hasIn(update, 'registeredBy')
          || hasIn(update, 'role')) {

          return res.status(400).json({ message: 'operation not allowed' });
        }

        let user = await User.updateUser(req.params.id, update);

        res.json(user);


      } else {
        res.status(400).json({ message: 'failed to update user' });
      }

    } catch (error) {
      res.status(400).json({ message: 'failed to update user' });
      console.log(error);

    }





  }
}