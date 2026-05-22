const validator = require('../helpers/validate');

// I use this middleware to validate the incoming data before it reaches my controller.
// Here I define the rules that every contact must follow. If the request doesn't match
// these rules, I stop the process and return a validation error. If everything is correct,
// I call next() so the controller can continue normally.
const saveContact = (req, res, next) => {
  const validationRule = {
    firstName: 'required|string',
    lastName: 'required|string',
    email: 'required|email',
    favoriteColor: 'required|string',
    birthday: 'string'
  };

  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      return res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    }

    next();
  });
};

module.exports = {
  saveContact
};