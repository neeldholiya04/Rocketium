require("dotenv").config();

const express = require("express");
const DataService = require("./src/services/dataFetchStoreService");
const DataRoute = require("./src/routes/DataRoute");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

DataService.fetchDataAndStore()
  .then(() => {
    console.log("Data initialized successfully");

    app.use("/api/data", DataRoute);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize data:", error);
    process.exit(1);
  });
