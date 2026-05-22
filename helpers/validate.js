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