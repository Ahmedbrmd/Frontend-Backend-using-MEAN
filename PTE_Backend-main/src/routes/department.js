const express = require("express");
const router = express.Router();
const departmentCtr = require("../controllers/departmentCtr");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  checkAdminMiddleware,
} = require("../middlewares/checkAdminMiddleware");


router.post("/add", authMiddleware, checkAdminMiddleware, departmentCtr.addDep);
router.get("/getall", departmentCtr.getAllDep);
router.patch(
  "/update/:id",
  
  authMiddleware,checkAdminMiddleware,
  departmentCtr.UpdateDep
);

router.delete(
  "/delete/:id",
  authMiddleware,
  checkAdminMiddleware,
  departmentCtr.deleteDep
);

router.get("/:id", departmentCtr.getDepById);

module.exports = router;