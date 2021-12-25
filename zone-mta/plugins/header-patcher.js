//@ts-check
require("dotenv").config();

module.exports.title = "Header Patch Plugin";

module.exports.init = (app, done) => {
  app.addHook("sender:headers", async (delivery) => {
    delivery.headers = delivery.headers || {};
    delivery.headers.lines = delivery.headers.lines || {};

    const lines = delivery.headers.lines;
    delivery.headers.lines = lines.filter((obj) => obj["key"] !== "received");
  });

  app.addHook("sender:connect", async (delivery, options) => {
    options["localHostname"] = process.env.SENDER_DOMAIN;
  });

  done();
};
