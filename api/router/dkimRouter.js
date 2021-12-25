const express = require("express");
const router = express.Router();
const dkim = require("../model/dkimModel");
const dkimkeygen = require("../service/dkimkeygen");

const logger = require("npmlog");

// TODO: add logging
router.get("/", async (req, res) => {
  const result = await dkim
    .find({}, ["_id", "domain", "selector"])
    .catch((error) => {
      logger.error("API/DKIM", error);
      res.status(500).json({
        message: error.message,
        error: error,
      });
    });
  logger.info("API/DKIM:GET", "get all dkim records");
  res.json(result);
});

router.get("/all", async (req, res) => {
  const result = await dkim.find({}).catch((error) => {
    logger.error("API/DKIM", error);
    res.status(500).json({
      message: error.message,
      error: error,
    });
  });
  logger.info("API/DKIM:GET", "get all dkim records - extended");
  res.json(result);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const data = await dkim.findById(id).catch((error) => {
    logger.error("API/DKIM", error);
    res.status(500).json({
      message: error.message,
      error: error,
    });
  });
  logger.info("API/DKIM:GET", "get dkim record by id");
  res.json(data);
});

router.get("/current/:domain", async (req, res) => {
  const domain = req.params.domain;
  const result = await dkim
    .findOne({ domain: domain }, ["_id", "domain", "selector", "privateKey"])
    .catch((error) => {
      logger.error("API/DKIM", error);
      res.status(500).json({
        message: error.message,
        error: error,
      });
    });
  logger.info("API/DKIM:GET", "Found current DKIM key for %s", domain);
  res.json(result);
});

router.delete("/", async (req, res) => {
  // TODO: block temporary
  const result = await dkim.deleteMany({}).catch((error) => {
    logger.error("API/DKIM", error);
    res.status(500).json({
      message: error.message,
      error: error,
    });
  });
  logger.info("API/DKIM:DELETE", "Deleted all DKIM keys");
  res.json(result);
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await dkim.deleteOne({ _id: id }).catch((error) => {
    logger.error("API/DKIM", error);
    res.status(500).json({
      message: error.message,
      error: error,
    });
  });
  logger.info("API/DKIM:DELETE", "Deleted DKIM key with id %s", id);
  res.json(result);
});

router.post("/", (req, res) => {
  const data = req.body;
  if (!data.domain) {
    res.status(400).json({
      error: "domain is required",
    });
  } else if (!data.selector) {
    res.status(400).json({
      error: "selector is required",
    });
  } else if (data.privateKey && (!data.publicKey || !data.dkimRecord)) {
    res.status(400).json({
      error: "uncompleted parameters",
    });
  } else {
    let dbDKIMRecord;
    if (!data.privateKey) {
      dbDKIMRecord = {
        domain: data.domain,
        selector: data.selector,
        ...dkimkeygen(),
      };
    } else {
      dbDKIMRecord = data;
    }
    dkim.create(dbDKIMRecord, (error, result) => {
      if (error) {
        logger.error("API/DKIM", error);
        res.status(500).json({
          message: error.message,
          error: error,
        });
      } else {
        logger.info("API/DKIM:POST",`Added DKIM key for ${data.domain} with <${data.selector}> selector`);
        res.json(result);
      }
    });
  }
});

module.exports = router;
