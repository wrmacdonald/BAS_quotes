const { scraperObjTruecar } = require("./lib/scraper");

car_data = {
  vin: "KNAFX4A61E5004372",
  mileage: "50000",
  zip: "97215",
  color: "White",
  manual: false,
};

scraperObjTruecar(car_data, true);
