const puppeteer = require("puppeteer");

// Scrape multiple pages on Truecar
const scraperObjTruecar = async (car_data, local_run) => {
  const URL = "https://www.truecar.com/sell-your-car/";

  console.log("Opening the browser...");

  // For local testing run vs. running on Docker:
  let browser;
  if (local_run) {
    browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-gpu"],
    });
  } else {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: "/usr/bin/chromium-browser",
      args: ["--no-sandbox", "--disable-gpu"],
    });
  }

  const page = await browser.newPage();

  console.log(`Navigating to ${URL}...`);
  await page.goto(URL, { waitUntil: "load" });

  // Page 1
  // enter VIN
  await page.type("#sycVinInput", car_data["vin"]);

  // enter ZIP
  await page.type("#sycPostalCode", car_data["zip"].toString());

  // click Search
  const search = await page.$("button[type=submit]");
  await search.click();

  // Page 2
  await page.waitForNavigation();
  // enter Mileage
  await page.type("input[name=mileage]", car_data["mileage"].toString());
  // enter zip
  // await page.type("input[name=zipcode]", car_data["zip"]);
  // click Next
  const next = await page.waitForXPath(
    '//*[@id="mainContent"]/div/div/div[2]/div/div/form/div[2]/div[2]/button'
  );
  await next.click();

  // Page 3 - color
  await page.waitForNavigation();
  // enter Color
  const color_btn = await page.waitForXPath(
    `//button/div[text()='${car_data["color"]}']`
  );
  await color_btn.click();
  // click Next
  const next3 = await page.waitForXPath(
    '//*[@id="mainContent"]/div/div/div[2]/div/form/div/div[3]/div[2]/button'
  );
  await next3.click();

  // a timed delay function to not spam the server
  //   const delay = (milliseconds) =>
  //     new Promise((resolve) => setTimeout(resolve, milliseconds));
  //   await delay(100);

  await page.waitForNetworkIdle();

  // Page 4 - options
  // click Next
  // const next4 = await page.waitForXPath(
  //   '//*[@id="mainContent"]/div/div/div[2]/div/form/div/div[3]/div[2]/button'
  // );
  // await next4.click();
  // alternate way, less errors:
  await page
    .waitForXPath(
      '//*[@id="mainContent"]/div/div/div[2]/div/form/div/div[3]/div[2]/button'
    )
    .then((elem) => elem.click());

  await page.waitForNetworkIdle();

  // Page 5 - condition
  const hasAccident = await page.waitForXPath(
    '//button[contains(@data-test, "no") and contains(@data-test-item, "hasAccident")]'
  );
  await hasAccident.click();

  await page.waitForNetworkIdle();

  // TODO: Continue filling out

  // click Next
  // const next5 = await page.waitForXPath(
  //   '//*[@id="mainContent"]/div/div/div[2]/div/form/div/div[3]/div[2]/button'
  // );
  // await next5.click();

  // Get quote
  const element = await page.waitForXPath(
    '//*[@id="mainContent"]/div/div/div[1]/div/div/div[4]'
  );
  const price = await element.evaluate((el) => el.textContent);
  // console.log(price);

  // Save quote to DB

  //   await page.waitForTimeout(2000); // wait for 2 seconds

  console.log("Closing the browser...");
  await page.close();
  await browser.close();
  console.log("Job done!");
  quote_data = {
    price: price,
    provider: "Truecar",
    vin: car_data["vin"],
  };
  console.log(quote_data);
  return quote_data;

  //   const totalPages = pages;
  //   let questions = [];

  //   for (let initialPage = 1; initialPage <= totalPages; initialPage++) {
  //     console.log(`Collecting the questions of page ${initialPage}...`);
  //     let pageQuestions = await page.evaluate(() => {
  //       return [...document.querySelectorAll(".s-post-summary")].map(
  //         (question) => {
  //           return {
  //             question: question.querySelector(".s-link").innerText,
  //             excerpt: question.querySelector(".s-post-summary--content-excerpt")
  //               .innerText,
  //           };
  //         }
  //       );
  //     });

  //     questions = questions.concat(pageQuestions);
  //     console.log(questions);
  //     // Go to next page until the total number of pages to scrap is reached
  //     if (initialPage < totalPages) {
  //       await Promise.all([
  //         await page.click(".pager > a:last-child"),
  //         await page.waitForSelector(".s-post-summary"),
  //       ]);
  //     }
  //   }

  //   console.log("Closing the browser...");

  //   await page.close();
  //   await browser.close();

  //   console.log("Job done!");
  //   return questions;
};

// Scrape multiple pages on Truecar
const scraperObjCarmax = async (car_data, local_run) => {
  const URL = "https://www.carmax.com/sell-my-car";

  console.log("Opening the browser...");

  // For local testing run vs. running on Docker:
  let browser;
  if (local_run) {
    browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-gpu"],
    });
  } else {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: "/usr/bin/chromium-browser",
      args: ["--no-sandbox", "--disable-gpu"],
    });
  }

  const page = await browser.newPage();

  console.log(`Navigating to ${URL}...`);
  await page.goto(URL, { waitUntil: "load" });

  let price = "100$ - test price";

  // Page 1
  // VIN Button
  const VINBtn = await page.waitForXPath('//*[@id="button-VIN"]');
  await VINBtn.click();
  // enter VIN
  await page.type("#text-field-ico-vehicle-vin", car_data["vin"]);
  // enter zipCode
  await page.type(
    "#text-field-ico-vehicle-vin-zipCode",
    car_data["zip"].toString()
  );
  // Search Button
  const searchBtn = await page.waitForXPath('//*[@id="ico-getstarted-button"]');
  await searchBtn.click();

  // Page 2
  await page.waitForNetworkIdle();

  // enter Drive
  await page.select("#select-ico-features-drive", "2WD");
  // enter Transmission
  await page.select("#select-ico-features-transmission", "Automatic");

  // Mileage and condition Button
  const mcBtn = await page.waitForXPath(
    '//*[@id="ico-step-Mileage_and_Condition-btn"]'
  );
  await mcBtn.click();

  // enter Mileage
  await page.type("input[name=currentMileage]", car_data["mileage"].toString());

  // Additional Info
  // TODO: selecting the questions dynamically:
  // const children = await page.evaluate(() => {
  //   return Array.from(
  //     document.querySelector("#DynamicConditionQuestions").children
  //   ).length;
  // });
  // console.log("Result:", children);

  // Accident (question-100)
  //  for No: //*[@id="question-100"]/div[2]/div[2]
  //  for Yes: //*[@id="question-100"]/div[2]/div[4]
  await page
    .waitForXPath('//*[@id="question-100"]/div[2]/div[2]')
    .then((elem) => elem.click());

  // Frame Damage (question-910)
  //  for No: //*[@id="question-910"]/div[2]/div[2]
  await page
    .waitForXPath('//*[@id="question-910"]/div[2]/div[2]')
    .then((elem) => elem.click());

  // Flood Damage (question-920)
  //  for No: //*[@id="question-920"]/div[2]/div[2]
  await page
    .waitForXPath('//*[@id="question-920"]/div[2]/div[2]')
    .then((elem) => elem.click());

  // Smoked In (question-830)
  //  for No: //*[@id="question-830"]/div[2]/div[2]
  await page
    .waitForXPath('//*[@id="question-830"]/div[2]/div[2]')
    .then((elem) => elem.click());

  // Mechanical Issues (question-200)
  //  for No: //*[@id="question-200"]/div[2]/div[2]
  await page
    .waitForXPath('//*[@id="question-200"]/div[2]/div[2]')
    .then((elem) => elem.click());

  // Odometer (question-1000)
  //  for No: //*[@id="question-1000"]/div[2]/div[2]
  await page
    .waitForXPath('//*[@id="question-1000"]/div[2]/div[2]')
    .then((elem) => elem.click());

  // Bad Panels (question-300)
  //  for No: //*[@id="question-300"]/div[2]/div[2]
  await page
    .waitForXPath('//*[@id="question-300"]/div[2]/div[2]')
    .then((elem) => elem.click());

  // Rust or Hail Damage (question-320)
  //  for No: //*[@id="question-320"]/div[2]/div[2]
  await page
    .waitForXPath('//*[@id="question-320"]/div[2]/div[2]')
    .then((elem) => elem.click());

  // Interior Parts Broken (question-410)
  //  for No: //*[@id="question-410"]/div[2]/div[2]
  await page
    .waitForXPath('//*[@id="question-410"]/div[2]/div[2]')
    .then((elem) => elem.click());

  // Rips (question-420)
  //  for No: //*[@id="question-420"]/div[2]/div[2]
  await page
    .waitForXPath('//*[@id="question-420"]/div[2]/div[2]')
    .then((elem) => elem.click());

  // Tires replaced (question-500)
  //  for No: //*[@id="question-500"]/div[2]/div[2]
  await page
    .waitForXPath('//*[@id="question-500"]/div[2]/div[2]')
    .then((elem) => elem.click());

  // Number of Keys (question-600)
  //  for 1: //*[@id="question-600"]/div[2]/div[4]
  await page
    .waitForXPath('//*[@id="question-600"]/div[2]/div[4]')
    .then((elem) => elem.click());

  // Aftermarket Mods (question-700)
  //  for No: //*[@id="question-700"]/div[2]/div[2]
  await page
    .waitForXPath('//*[@id="question-700"]/div[2]/div[2]')
    .then((elem) => elem.click());

  // Other Issues (question-800)
  //  for No: //*[@id="question-800"]/div[2]/div[2]
  await page
    .waitForXPath('//*[@id="question-800"]/div[2]/div[2]')
    .then((elem) => elem.click());

  // Offer delivery
  // TODO: Use temp email to get Quote
  await page.type(
    "input[name=preferredEmail]",
    "wes123@extracurricularsociety.com"
  );
  //  user@extracurricularsociety.com

  // Continue Button
  await page
    .waitForXPath('//*[@id="ico-continue-button"]')
    .then((elem) => elem.click());

  await page.waitForNetworkIdle();

  // Get quote
  const element = await page.waitForXPath(
    '//*[@id="Offer Page"]/div/div[1]/h1'
  );
  price = await element.evaluate((el) => el.textContent);

  // Test
  // await page.waitForTimeout(2000); // wait for 2 seconds

  console.log("Closing the browser...");
  await page.close();
  await browser.close();
  console.log("Job done!");
  quote_data = {
    price: price,
    provider: "Carmax",
    vin: car_data["vin"],
  };
  console.log(quote_data);
  return quote_data;
};

module.exports = {
  scraperObjTruecar,
  scraperObjCarmax,
};
