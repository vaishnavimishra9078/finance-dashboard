const express = require("express");
const router = express.Router();

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;


// =====================================================
// CURRENT STOCK PRICE
// GET /api/stocks/AAPL
// =====================================================

router.get("/:ticker", async (req, res) => {

  try {

    const ticker =
      req.params.ticker.toUpperCase();

    const url =
      `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(ticker)}` +
      `&apikey=${TWELVE_DATA_API_KEY}`;

    const response =
      await fetch(url);

    const data =
      await response.json();


    if (data.status === "error") {

      console.error(
        "Twelve Data error:",
        data
      );

      return res.status(400).json({
        error:
          data.message ||
          "Unable to fetch stock data"
      });

    }


    res.json({

      symbol: data.symbol,

      price: data.close,

      change: data.change,

      changePercent:
        data.percent_change

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


// =====================================================
// HISTORICAL STOCK PRICE
// GET /api/stocks/AAPL/history/2025-01-02
// =====================================================

router.get(
  "/:ticker/history/:date",
  async (req, res) => {

    try {

      const ticker =
        req.params.ticker.toUpperCase();

      const date =
        req.params.date;


      console.log(
        `Historical request: ${ticker} on ${date}`
      );


      // ---------------------------------------------
      // Get historical price
      // ---------------------------------------------

      const historicalUrl =
        `https://api.twelvedata.com/time_series` +
        `?symbol=${encodeURIComponent(ticker)}` +
        `&interval=1day` +
        `&start_date=${date}` +
        `&end_date=${date}` +
        `&apikey=${TWELVE_DATA_API_KEY}`;


      const historicalResponse =
        await fetch(historicalUrl);


      const historicalData =
        await historicalResponse.json();


      console.log(
        "Historical data:",
        historicalData
      );


      if (
        historicalData.status === "error"
      ) {

        return res.status(400).json({

          error:
            historicalData.message ||
            "Could not find historical price"

        });

      }


      if (
        !historicalData.values ||
        historicalData.values.length === 0
      ) {

        return res.status(404).json({

          error:
            "No historical data available for this date."

        });

      }


      // First historical result
      const historicalPrice =
        parseFloat(
          historicalData.values[0].close
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


      if (
        latestData.status === "error"
      ) {

        return res.status(400).json({

          error:
            latestData.message ||
            "Could not fetch latest price"

        });

      }


      const latestPrice =
        parseFloat(
          latestData.close
        );


      // ---------------------------------------------
      // Send simulator data
      // ---------------------------------------------

      res.json({

        ticker: ticker,

        dateRequested: date,

        priceOnDate: historicalPrice,

        latestDate:
          latestData.datetime ||
          new Date()
            .toISOString()
            .split("T")[0],

        latestPrice: latestPrice

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

  }
);


module.exports = router;