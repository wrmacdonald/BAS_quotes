const express = require("express");
const scraper = require("../lib/scraper");

const router = express.Router();

// GET route - used for test request with dummy data
router.get("/", async (req, res, next) => {
  // Dummy Data:
  car_data = {
    vin: "KNAFX4A61E5004372",
    mileage: "50000",
    zip: "97215",
    color: "White",
    manual: false,
  };

  // Call the scraper function
  let quote_data;
  try {
    quote_data = await scraper.scraperObjTruecar(car_data, true); // set 2nd arg to false for Docker
  } catch (error) {
    console.error(error);
    quote_data = -1;
  }

  // Return the array of questions to the client
  res.status(200).json({
    statusCode: 200,
    message: "Quotes correctly retrieved",
    data: { quote_data },
  });
});

// POST route - used for quotes from passed in user data
router.post("/", async (req, res, next) => {
  // Get the request body
  const car_data = req.body;

  if (!car_data) {
    // No car data sent in body
    res.status(400).json({
      statusCode: 400,
      message: "No Car Data Received",
    });
  } else {
    // TODO: Validate body
    console.log(car_data);

    // Call the scraper function
    let quote_data;
    try {
      quote_data = await scraper.scraperObjTruecar(car_data, true); // set 2nd arg to false for Docker

      res.status(200).json({
        statusCode: 200,
        message: "Quotes correctly retrieved",
        data: { quote_data },
      });
    } catch (error) {
      console.error(error);
      quote_data = -1;

      res.status(500).json({
        statusCode: 500,
        message: "Error receiving quotes",
        data: { quote_data },
      });
    }

    // Return the array of questions to the client
    // res.status(200).json({
    //   statusCode: 200,
    //   message: "Quotes correctly retrieved",
    //   data: { quote_data },
    // });
  }
});

module.exports = router;
