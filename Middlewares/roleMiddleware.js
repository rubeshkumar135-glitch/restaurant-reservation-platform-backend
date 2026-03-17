export const isAdmin = (req, res, next) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Only Admin can access this route"
    });
  }

  next();
};




export const isOwner = (req, res, next) => {

  if (!req.user || req.user.role !== "owner") {
    return res.status(403).json({
      message: "Only Owner can access this route"
    });
  }
// console.log("Logged user:", req.user);
  next();
};


export const isUser = (req, res, next) => {

  if (req.user.role !== "user") {
    return res.status(403).json({
      message: "Only User can access this route"
    });
  }

  next();
};