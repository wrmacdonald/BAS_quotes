const https = require("https");

const options1 = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
  },
};

const options2 = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
  },
};

// Make a GET request to the Mail.tm API to fetch a list of available email domains
https
  .get("https://api.mail.tm/domains", options, (res) => {
    let data = "";

    // Concatenate the response data as it comes in
    res.on("data", (chunk) => {
      data += chunk;
    });

    // Once the response is complete, log the available domains
    res.on("end", () => {
      const domains = JSON.parse(data);
      console.log(domains);
    });
  })
  .on("error", (err) => {
    console.error(err);
  });
