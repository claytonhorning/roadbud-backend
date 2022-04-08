const access = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      throw new Error();
    }
    next();
  } catch (e) {
    res.status(401).send({ errorMessage: 'Not Authorized.' });
  }
};

module.exports = access;
