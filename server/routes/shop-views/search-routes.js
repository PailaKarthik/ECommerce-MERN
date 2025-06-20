
const express = require("express");
const {
  searchParams
} = require("../../controllers/shop/search-controller");

const router = express.Router();

router.get('/:keyword',searchParams)

module.exports = router;
