require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const dkimrouter = require("./router/dkimRouter");
const logger = require("npmlog");

logger.level = process.env.LOG_LEVEL || "info";

const app = express();
app.use(express.json());
app.use("/dkim", dkimrouter);

const PORT = 8513;
const DB_NAME = process.env.DB_NAME; // internal database name
const MONGODB_URL = "mongodb://mongo/";
mongoose.connect(MONGODB_URL + DB_NAME);

const banner = `
---------------------------------------------------------------

       █████╗ ██████╗ ██╗    ██╗  ██╗███████╗ ██╗██████╗ 
      ██╔══██╗██╔══██╗██║    ╚██╗██╔╝██╔════╝███║╚════██╗
      ███████║██████╔╝██║     ╚███╔╝ ███████╗╚██║ █████╔╝
      ██╔══██║██╔═══╝ ██║     ██╔██╗ ╚════██║ ██║ ╚═══██╗
      ██║  ██║██║     ██║    ██╔╝ ██╗███████║ ██║██████╔╝
      ╚═╝  ╚═╝╚═╝     ╚═╝    ╚═╝  ╚═╝╚══════╝ ╚═╝╚═════╝ 

      API Server is listening on port ${PORT}...
---------------------------------------------------------------`;

app.get("/", (req, res) => {
  res.json({
    message: "api server setup successfully",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  logger.info("App", banner);
});