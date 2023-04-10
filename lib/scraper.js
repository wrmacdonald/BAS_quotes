const puppeteer = require("puppeteer");

const URL = "https://www.truecar.com/sell-your-car/";

// go to multiple pages
const scraperObjTruecar = async (car_data, local_run) => {
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

  // car_data = {
  //   vin: "KNAFX4A61E5004372",
  //   mileage: "50000",
  //   zip: "97215",
  //   color: "White",
  //   manual: false,
  // };

  // Page 1
  // enter VIN
  await page.type("#sycVinInput", car_data["vin"]);

  // enter ZIP
  await page.type("#sycPostalCode", car_data["zip"]);

  // click Search
  const search = await page.$("button[type=submit]");
  await search.click();

  // Page 2
  await page.waitForNavigation();
  // enter Mileage
  await page.type("input[name=mileage]", car_data["mileage"]);
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
  const next4 = await page.waitForXPath(
    '//*[@id="mainContent"]/div/div/div[2]/div/form/div/div[3]/div[2]/button'
  );
  await next4.click();
  // alternate way, less errors:
  //   await page
  //     .waitForXPath(
  //       '//*[@id="mainContent"]/div/div/div[2]/div/form/div/div[3]/div[2]/button'
  //     )
  //     .then((elem) => elem.click());

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

module.exports = {
  scraperObjTruecar,
};
