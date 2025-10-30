const sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({
    status: statusCode,
    success,
    message,
    data,
  });
};

module.exports = { sendResponse };
