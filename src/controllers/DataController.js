const DataService = require("../services/dataFetchStoreService");
const filter = require("../utils/FilterUtil");
const sort = require("../utils/SortUtil");

exports.getData = async (req, res) => {
  try {
    let data = await DataService.getData();

    const filters = [];
    const errors = [];

    // Parsing and applying filters
    if (req.query.filters) {
      try {
        const parsedFilters = JSON.parse(req.query.filters);
        if (Array.isArray(parsedFilters)) {
          filters.push(...parsedFilters);
        } else {
          throw new Error("Invalid filters format. Expected an array.");
        }
      } catch (error) {
        errors.push(`Invalid filters format: ${error.message}`);
      }
    }

    // Applying filters
    if (filters.length > 0) {
      console.log("Applying filters:", filters);
      try {
        data = filter.filterData(data, filters);
      } catch (error) {
        errors.push(error.message);
      }
    }

    // Sorting the data
    if (req.query.sortBy) {
      const sortOrder = req.query.sortOrder || "asc";
      console.log("Sorting by:", req.query.sortBy, "Order:", sortOrder);
      try {
        data = sort.sortData(data, req.query.sortBy, sortOrder);
      } catch (error) {
        errors.push(error.message);
      }
    }

    // Returning the response
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    res.json(data);
  } catch (error) {
    console.error("Error in getData:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createData = async (req, res) => {
  try {
    const newData = req.body;
    await DataService.createData(newData);
    res.status(201).json(newData);
  } catch (error) {
    if (error.message === 'User already exists') {
      res.status(400).json({ error: error.message });
    } else {
      console.error("Error in createData:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.updateData = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const data = await DataService.updateData(id, updatedData);
    res.json(data);
  } catch (error) {
    if (error.message === 'User does not exist') {
      res.status(400).json({ error: error.message });
    } else {
      console.error("Error in updateData:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.deleteData = async (req, res) => {
  try {
    const id = req.params.id;
    await DataService.deleteData(id);
    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    if (error.message === 'Invalid ID') {
      res.status(400).json({ error: error.message });
    } else {
      console.error("Error in deleteData:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
