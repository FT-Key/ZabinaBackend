export const paginationMiddleware = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && limit) {
    const skip = (page - 1) * limit;
    req.pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      skip: parseInt(skip)
    };
  } else {
    req.pagination = null;
  }

  next();
};