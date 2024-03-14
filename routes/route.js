const { appController, getBill } = require("../controller/appController");

const express = require("express");

const router = express.Router();

router.post("/user/signup", appController);

router.post("/product/getBill", getBill);

module.exports = router;
