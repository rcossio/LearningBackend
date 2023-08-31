function asyncHandler(callback) {
  return (req, res, next) => {
    Promise.resolve(callback(req, res, next))
      .catch(next);
  };
}

export default asyncHandler;