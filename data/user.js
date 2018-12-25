var { User } = require('../models');
var bcrypt = require('bcrypt-nodejs');
var { keys, omit, get } = require('lodash');
var { generateSearchQuery } = require('./utils');

var createUser = async (data) => {
  try {
    let existingEmail = await User.findOne({ email: new RegExp(data.email, 'i') });
    if (existingEmail) {
      throw { _message: 'email already exiting' };
    }

    Object.assign(data, { password: bcrypt.hashSync(data.password) });

    let user = new User(Object.assign(data));
    return await user.save();
  } catch (error) {
    // throw error;
      console.log(error)
    return {
       error: error,
       status: false
    };
  }
}

var getUsers = async (cond) => {
  try {
    return await generateSearchQuery(User, cond);
  } catch (error) {
    throw error;
  }
};

var getUser = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    throw error;
  }
}

var getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email: new RegExp(email, 'i') });
  } catch (error) {
    throw error;
  }
}


var getUserByServiceNumber = async (serviceNumber) => {
  try {
    return await User.findOne({ serviceNumber: new RegExp(serviceNumber, 'i') });
  } catch (error) {
    throw error;
  }
}

var getUserByUserName = async (userName) => {
  try {
    return await User.findOne({ userName: new RegExp(userName, 'i') });
  } catch (error) {
    throw error;
  }
}

var authenticate = async (email, password) => {
  try {
    //  console.log(password); return false

    let user = await User.findOne({ email: new RegExp(email, 'i') });
    // console.log(user.password); return false
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    throw { _message: 'email or password incorrect' };
  } catch (error) {
    throw error;
  }
}

var updateUser = async (id, data) => {
  try {
    let user = await User.findById(id);


    keys(data).forEach((k) => {
      switch (k) {
        case 'password':
          user.password = bcrypt.hashSync(data[k]);
          break;
        default:
          user[k] = data[k];
      }
    });

    // console.log(user);
    await user.save();
    return await User.findById(id);
  } catch (error) {
    throw error;
  }
}

var deleteUser = (id) => updateUser(id, { disabled: true });

module.exports = {
  createUser,
  getUsers,
  getUser,
  getUserByEmail,
  authenticate,
  updateUser,
  deleteUser,
  getUserByServiceNumber
};
