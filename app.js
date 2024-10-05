const express = require("express");
const { dbConnection } = require("./database/config");
require("dotenv").config();
const cors = require("cors");

const app = express();

dbConnection();

app.use(cors());

app.use(express.static("public"));

app.use(express.json());

app.use("/login", require("./routes/Login"));
app.use("/user", require("./routes/User"));
app.use("/class", require("./routes/Classes"));
app.use("/userClass", require("./routes/UserClass"));
app.use("/users", require("./routes/Users"));

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
