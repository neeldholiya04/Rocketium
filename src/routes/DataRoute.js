const express = require("express");
const DataController = require("../controllers/DataController");

const router = express.Router();

router.get("/", DataController.getData);
router.post("/", DataController.createData);
router.put("/:id", DataController.updateData);
router.delete("/:id", DataController.deleteData);

module.exports = router;
