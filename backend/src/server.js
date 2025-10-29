const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `${process.env.DEV_MODE} server side is currently running on port no ${PORT}`
  );
});
