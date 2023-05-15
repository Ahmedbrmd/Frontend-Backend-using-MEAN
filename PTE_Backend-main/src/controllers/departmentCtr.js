const { ObjectId } = require("mongodb");
const Department = require("../models/department");

/* add department*/
module.exports.addDep = async function (req, res, next) {
  try {
    const { name, description } = req.body;

    const existingDepartment = await Department.findOne({ name });

    if (existingDepartment) {
      return res.status(400).json('Department name already exists');
    }

    const department = await Department.create({ name, description });

    if (department) {
      return res.status(200).json(department);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};


  module.exports.getAllDep = async function (req, res) {
    try {
      const departments = await Department.find();
      res.status(200).json(departments);
    } catch (error) {
      res.status(500).json(departments);
    }
  };

  module.exports.UpdateDep = async function(req, res, next) {
    const ID = req.params.id;
  
    if (!ObjectId.isValid(ID)) {
      return res.status(404).json('ID is not valid');
    }
  
    const exists = await Department.findOne({
      name: req.body.name,
      '_id': { $ne: ID }
    });
  
    if (exists) {
      return res.status(400).send('Department name already exists');
    }
  
    try {
      const updatedDep = await Department.findByIdAndUpdate(
        ID,
        {
          name: req.body.name,
          description: req.body.description
        },
        { new: true } // return the updated document
      );
  
      if (!updatedDep) {
        return res.status(404).json('Department not found');
      }
  
      return res.json(updatedDep);
    } catch (err) {
      console.error(err);
      return res.status(500).json('Server error');
    }
  };
  

  module.exports.deleteDep = async function (req, res, next) {
    try {
      const department = await Department.findByIdAndDelete({ _id: req.params.id });
      res.status(200).json(department);
    } catch (error) {
      res.status(404).json(department);
    }
  };

  module.exports.getDepById = async function (req, res) {
    const ID = req.params.id;
  
    if (!ObjectId.isValid(ID)) {
      return res.status(404).json("ID is not valid");
    }
    try {
      const department = await Department.findById(ID);
      res.status(200).json(department);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  };