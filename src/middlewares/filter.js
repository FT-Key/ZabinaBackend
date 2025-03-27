const dynamicFilterMiddleware = (Model) => {
  return async (req, res, next) => {
    const queryFilters = req.query;
    const schemaFields = Object.keys(Model.schema.paths);

    const filters = {};

    for (const key in queryFilters) {
      if (schemaFields.includes(key)) {
        filters[key] = queryFilters[key];
      }
    }

    req.filters = filters;
    next();
  };
};

export default dynamicFilterMiddleware;