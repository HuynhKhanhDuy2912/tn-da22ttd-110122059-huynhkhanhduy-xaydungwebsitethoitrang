export const attachOwner = (ownerField = "userId") => (req, _res, next) => {
  if (req.user && req.user.role !== "admin") {
    req.body[ownerField] = req.user._id;
  }

  next();
};

export const scopeToOwner = (ownerField = "userId") => (req, _res, next) => {
  if (req.user && req.user.role !== "admin") {
    req.query[ownerField] = req.user._id.toString();
  }

  next();
};

export const checkOwnership = (Model, ownerField = "userId") => async (req, res, next) => {
  try {
    if (req.user?.role === "admin") {
      return next();
    }

    const document = await Model.findById(req.params.id).select(ownerField);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: `${Model.modelName} not found`
      });
    }

    const ownerId = document[ownerField]?.toString();

    if (!ownerId || ownerId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
