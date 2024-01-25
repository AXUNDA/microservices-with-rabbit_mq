const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.use("/", (req, res, next) => {
  res.status(200).json({
    status: "hello from shopping route",
  });
});

app.listen(8003, () => {
  console.log("shopping is listening on port 8003");
});
