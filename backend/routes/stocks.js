const express = require("express");
const router = express.Router();

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;


// =====================================================
// HISTORICAL STOCK PRICE
// GET /api/stocks/AAPL/history/2020-01-02
// =====================================================

router.get("/:ticker/history/:date", async (req, res) => {

  try {

    const ticker = req.params.ticker.toUpperCase();
    const date = req.params.date;

    console.log("Historical request:", ticker, date);


    // ---------------------------------------------
    // Validate date
    // ---------------------------------------------

    const selectedDate = new Date(date + "T00:00:00");

    if (isNaN(selectedDate.getTime())) {

      return res.status(400).json({
        error: "Invalid date."
      });

    }


    // ---------------------------------------------
    // Create date range around selected date
    // ---------------------------------------------

    const startDate = new Date(selectedDate);
    startDate.setDate(startDate.getDate() - 7);

    const endDate = new Date(selectedDate);
    endDate.setDate(endDate.getDate() + 7);


    const formatDate = (d) => {
      return d.toISOString().split("T")[0];
    };


    // ---------------------------------------------
    // Request historical data
    // ---------------------------------------------

    const historicalUrl =
      `https://api.twelvedata.com/time_series` +
      `?symbol=${encodeURIComponent(ticker)}` +
      `&interval=1day` +
      `&start_date=${formatDate(startDate)}` +
      `&end_date=${formatDate(endDate)}` +
      `&apikey=${TWELVE_DATA_API_KEY}`;


    console.log("Historical URL:", historicalUrl);


    const historicalResponse =
      await fetch(historicalUrl);


    const historicalData =
      await historicalResponse.json();


    console.log(
      "Historical API response:",
      historicalData
    );


    // ---------------------------------------------
    // Check Twelve Data response
    // ---------------------------------------------

    if (historicalData.status === "error") {

      console.error(
        "Twelve Data historical error:",
        historicalData
      );

      return res.status(400).json({
        error:
          historicalData.message ||
          "Historical data unavailable."
      });

    }


    if (
      !historicalData.values ||
      historicalData.values.length === 0
    ) {

      return res.status(404).json({
        error:
          "No historical data available near this date."
      });

    }


    // ---------------------------------------------
    // Find closest trading day
    // ---------------------------------------------

    let closestValue =
      historicalData.values[0];

    let smallestDifference =
      Math.abs(
        new Date(
          closestValue.datetime
        ).getTime() -
        selectedDate.getTime()
      );


    for (
      let i = 1;
      i < historicalData.values.length;
      i++
    ) {

      const current =
        historicalData.values[i];

      const difference =
        Math.abs(
          new Date(
            current.datetime
          ).getTime() -
          selectedDate.getTime()
        );


      if (difference < smallestDifference) {

        smallestDifference =
          difference;

        closestValue =
          current;

      }

    }


    const priceOnDate =
      parseFloat(
        closestValue.close
      );


    // ---------------------------------------------
    // Get latest price
    // ---------------------------------------------

    const latestUrl =
      `https://api.twelvedata.com/quote` +
      `?symbol=${encodeURIComponent(ticker)}` +
      `&apikey=${TWELVE_DATA_API_KEY}`;


    const latestResponse =
      await fetch(latestUrl);


    const latestData =
      await latestResponse.json();


    console.log(
      "Latest price response:",
      latestData
    );


    if (latestData.status === "error") {

      return res.status(400).json({
        error:
          latestData.message ||
          "Could not fetch latest price."
      });

    }


    const latestPrice =
      parseFloat(
        latestData.close
      );


    // ---------------------------------------------
    // Send result
    // ---------------------------------------------

    res.json({

      ticker: ticker,

      dateRequested:
        closestValue.datetime,

      priceOnDate:
        priceOnDate,

      latestDate:
        latestData.datetime ||
        new Date().toISOString().split("T")[0],

      latestPrice:
        latestPrice

    });


  } catch (error) {

    console.error(
      "Historical stock route error:",
      error
    );

    res.status(500).json({
      error:
        "Failed to fetch historical stock data"
    });

  }

});


// =====================================================
// CURRENT STOCK PRICE
// GET /api/stocks/AAPL
// GET /api/stocks/RELIANCE
// =====================================================

router.get("/:ticker", async (req, res) => {

  try {

    const originalTicker =
      req.params.ticker.trim().toUpperCase();


    // -------------------------------------------------
    // Possible symbols to try
    // -------------------------------------------------

    const symbolsToTry = [
      originalTicker,

      // Indian NSE
      `${originalTicker}:NSE`,

      // Indian BSE
      `${originalTicker}:BSE`
    ];


    let data = null;
    let workingSymbol = null;


    // -------------------------------------------------
    // Try each symbol
    // -------------------------------------------------

    for (const symbol of symbolsToTry) {

      console.log(
        "Trying stock symbol:",
        symbol
      );


      const url =
        `https://api.twelvedata.com/quote` +
        `?symbol=${encodeURIComponent(symbol)}` +
        `&apikey=${TWELVE_DATA_API_KEY}`;


      const response =
        await fetch(url);


      const result =
        await response.json();


      console.log(
        "Twelve Data response:",
        result
      );


      // Twelve Data returned valid data
      if (
        result &&
        result.status !== "error" &&
        result.close !== undefined &&
        result.close !== null &&
        result.close !== ""
      ) {

        data = result;

        workingSymbol = symbol;

        break;

      }

    }


    // -------------------------------------------------
    // No stock found
    // -------------------------------------------------

    if (!data) {

      return res.status(404).json({

        error:
          `Stock "${originalTicker}" was not found.`

      });

    }


    // -------------------------------------------------
    // Convert price
    // -------------------------------------------------

    const price =
      parseFloat(data.close);


    if (isNaN(price)) {

      return res.status(400).json({

        error:
          "Stock price is unavailable."

      });

    }


    // -------------------------------------------------
    // Send result
    // -------------------------------------------------

    res.json({

      symbol:
        data.symbol || workingSymbol,

      requestedSymbol:
        originalTicker,

      price:
        data.close,

      change:
        data.change || "0",

      changePercent:
        data.percent_change || "0",

      currency:
        data.currency || null,

      exchange:
        data.exchange || null

    });


  } catch (error) {

    console.error(
      "Stock route error:",
      error
    );


    res.status(500).json({

      error:
        "Failed to fetch stock data"

    });

  }

});