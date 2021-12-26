//@ts-check
"use strict";

// DKIM PLUGIN MANAGER

const axios = require("axios").default;

module.exports.title = "DKIM Plugin Manager";

module.exports.init = (app, done) => {
  app.addHook("sender:connection", async (delivery, connection, next) => {
    // make sure that there is a key array present
    if (!delivery.dkim.keys) {
      delivery.dkim.keys = [];
    }

    // resolve the domain name of the sender
    const fromDomain = (delivery.from || "localhost")
      .split("@")
      .pop()
      .toLowerCase();

    try {
      const response = await axios.get(`http://api:8513/dkim/current/${fromDomain}`);
      // push all signature keys to the key array
      delivery.dkim.keys.push({
        domainName: response.data.domain,
        keySelector: response.data.selector,
        privateKey: response.data.privateKey,
      });

      app.logger.info(
        "DKIM",
        "%s.%s Added DKIM key for %s <%s>",
        delivery.id,
        delivery.seq,
        fromDomain,
        delivery.messageId
      );
    } catch (error) {
      app.logger.error(
        "DKIM",
        "%s.%s Not Added DKIM key for %s <%s>",
        delivery.id,
        delivery.seq,
        fromDomain,
        delivery.messageId
      );
    } finally {
      next();
    }
  });
  done();
};
