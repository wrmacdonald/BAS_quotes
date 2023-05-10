const express = require("express");
const scraper = require("../lib/scraper");

const router = express.Router();

// GET route - used for test request with dummy data
router.get("/", async (req, res, next) => {
  // Dummy Data:
  car_data = {
    vin: "KNAFX4A61E5004372",
    mileage: 50000,
    zip: 97215,
    color: "White",
    manual: false,
  };

  // Call the scraper function
  try {
    const truecar_quote = await scraper.scraperObjTruecar(car_data, true); // set 2nd arg to false for Docker

    quotes = [truecar_quote];

    res.status(200).json({
      statusCode: 200,
      message: "Test quotes correctly retrieved",
      data: { quotes },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      statusCode: 500,
      message: "Error receiving test quotes",
    });
  }
});

// POST route - used for quotes from passed in user data
router.post("/", async (req, res, next) => {
  // Get the request body
  const car_data = req.body;

  if (!car_data) {
    // No car data received in body
    res.status(400).json({
      statusCode: 400,
      message: "No Car Data Received",
    });
  } else {
    // TODO: Validate body
    console.log(car_data);

    // Call the scraper function
    try {
      quotes = [];

      try {
        const truecar_quote = await scraper.scraperObjTruecar(car_data, true); // set 2nd arg to false for Docker
        quotes.push(truecar_quote);
      } catch (error) {
        quotes.push({
          price: "-1",
          error: true,
          provider: "Truecar",
          vin: car_data["vin"],
        });
      }
      // const truecar_quote = await scraper.scraperObjTruecar(car_data, true); // set 2nd arg to false for Docker
      // quotes.push(truecar_quote);

      try {
        const carmax_quote = await scraper.scraperObjCarmax(car_data, true); // set 2nd arg to false for Docker
        quotes.push(carmax_quote);
      } catch (error) {
        quotes.push({
          price: "-1",
          error: true,
          provider: "Carmax",
          vin: car_data["vin"],
        });
      }
      // const carmax_quote = await scraper.scraperObjCarmax(car_data, true); // set 2nd arg to false for Docker
      // quotes.push(carmax_quote);

      console.log(quotes);

      res.status(200).json({
        statusCode: 200,
        message: "Quotes correctly retrieved",
        data: { quotes },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        statusCode: 500,
        message: "Error receiving quotes",
      });
    }
  }
});

module.exports = router;
