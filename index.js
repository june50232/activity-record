const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname));

const port = process.env.PORT || 3000;
const server = app.listen(port, function () {
  console.log("server is listening on port " + port);
});

app.get("/", (req, res) => {
  res.sendFile("index.html");
});