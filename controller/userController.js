const userservice = require("./userService");
module.exports.register = (req, res, next) => {
  userservice.register(req.body, (error, result) => {
    if (error) {
      return next(error);
    } else {
      return res.status(200).send({
        status: true,
        data: result,
      });
    }
  });
};

module.exports.login = (req, res, next) => {
  console.log(req);
  const { email, password } = req.body;
  userservice.login({ email, password }, (error, result) => {
    if (error) {
      return next(error);
    } else {
      return res.status(200).send({
        status: true,
        data: result,
      });
    }
  });
};
