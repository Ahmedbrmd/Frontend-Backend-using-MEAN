const mongoose = require("mongoose");

const departmentSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  
});

module.exports = mongoose.model("department", departmentSchema);