const express = require("express");
const scraper = require("../lib/scraper");

const router = express.Router();

router.get("/", async (req, res, next) => {
  // 1. Get the parameter "pages"
  const { pages } = req.query;

  // Get the body & validate it
  // const { car_data } = req.body;

  // test Github
  // if (!car_data) {
  //   res.status(400).json({
  //     statusCode: 400,
  //     message: "No Car Data Received",
  //   });
  // }

  // 2. Call the scraper function
  let quote_data;
  try {
    quote_data = await scraper.scraperObjTruecar(pages, true); // set 2nd arg to false for Docker
  } catch (error) {
    console.error(error);
    quote_data = -1;
  }

  // 3. Return the array of questions to the client
  res.status(200).json({
    statusCode: 200,
    message: "Quotes correctly retrieved",
    data: { quote_data },
  });
});

module.exports = router;
