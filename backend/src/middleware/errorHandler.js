const sendResponse = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    console.error("Headers already sent, skipping error response:", err);
    return next(err); // Pass to default Express error handler
  }

  console.error("Error:", err);
  sendResponse(res, 500, false, "Internal server error");
};

module.exports = errorHandler;