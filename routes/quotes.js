const express = require("express");
const scraper = require("../lib/scraper");

const router = express.Router();

router.get("/", async (req, res, next) => {
  // 1. Get the parameter "pages"
  const { pages } = req.query;
  // 2. Call the scraper function
  let price;
  try {
    price = await scraper.scraperObjTruecar(pages, false);
  } catch (error) {
    console.error();
    price = -1;
  }

  // 3. Return the array of questions to the client
  res.status(200).json({
    statusCode: 200,
    message: "Quotes correctly retrieved",
    data: { price },
  });
});

module.exports = router;
