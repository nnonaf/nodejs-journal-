const jwt = require('jsonwebtoken');
const User = require('../data/user');
const { get } = require('lodash');

const TOKEN_SECRET = process.env.TOKEN_SECRET;
const STRICT_VERIFICATION = process.env.STRICT_VERIFICATION || false;

module.exports = {

  verify: async (req, res, next) => {
    let error = false;
    let auth = req.headers.authorization;
    console.log('authenticating path: ', req.method, req.url, auth);
    try {
      // check if user used basic auth
      let parts = auth.split(' ');
      //  console.log(parts); return false;

      if (parts.length === 2) {
        bAuth = Buffer.from(parts[1], 'base64').toString();
        bAuth = bAuth.split(':');

        if (bAuth.length == 2) {
          auth = bAuth;
        } else {
          auth = parts[1];
        }
      } else {
        return res.status(401).json({ message: 'authentication error' });
      }
    } catch (error) {
      // user might have used jwt
    }
    try {
      let user = undefined;
      if (typeof auth === 'object') {
        user = await User.authenticate(auth[0], auth[1]);
      } else {
        var decoded = jwt.verify(auth, TOKEN_SECRET);
        console.log('decoded jwt =>', decoded);
        user = await User.getUser(decoded.data);
      }
      if (!user) throw 'authentication error';
      if (!user.verified && STRICT_VERIFICATION) {
        return res.status(401).json({ message: 'account not verified. Please check inbox for verification details' });
      }
      if (user.disabled) {
        return res.status(401).json({ message: 'account disabled. contact admin' });
      }
      req.user = user;
      // console.log(req.user.isAdmin); return false;
      next();
    } catch (error) {
      res.status(401).json({ message: 'not authenticated' });
      return;
    }
  },



  login: async (req, res, next) => {
    try {


      let { email, password } = req.body;
      let user = await User.authenticate(email, password);
      await res.cookie("name", user.name, { maxAge: 604800000, httpOnly: true });
      await res.cookie('id', user._id, { maxAge: 900000, httpOnly: true }, { signed: true });

      // let token = jwt.sign({
      //   data: user.id,
      // }, TOKEN_SECRET);


      res.json(true);


    } catch (error) {
      console.log(error);
      res.json(false);
      return;
    }
  }
}