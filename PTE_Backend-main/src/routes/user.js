const express = require("express");
const router = express.Router();
const userCtr = require("../controllers/userController");
const userEventCtr = require("../controllers/technical_team/userEventCtr");
const userPlanCtr = require("../controllers/technical_team/userPlanCtr");

const { authMiddleware } = require("../middlewares/authMiddleware");
const { checkAdminMiddleware } = require("../middlewares/checkAdminMiddleware");
const { fileStorageEngine } = require("../tools/FileStorageEngine");
const multer = require("multer");
const upload = multer({ storage: fileStorageEngine });
router.post("/signup", upload.single("image"), userCtr.signUp);
router.post("/adduser",userCtr.AddUser);
router.get(
  "/signup/requests",
  authMiddleware,
  checkAdminMiddleware,
  userCtr.getSignUpRequests
);
router.post("/confirm-signup/:id", authMiddleware, userCtr.confirmSignUp);
router.patch(
  "/update/:id",
  upload.single("image"),
  authMiddleware,
  userCtr.UpdateUser
);
router.patch(
  "/update-roles/:id",
  authMiddleware,
  checkAdminMiddleware,
  userCtr.updateUserRoles
);
router.post("/forgotPassword", userCtr.forgotPassword);
router.post("/checkpass", authMiddleware, userCtr.checkPassword);
router.post("/addUser",authMiddleware,userCtr.AddUser)
router.post("/validateCode", userCtr.validateCode);
router.post("/changePswdAutorisation/:id", userCtr.changePswdAutorisation);
router.patch("/change-psw/:id", userCtr.changePswd);


router.get("/getall", userCtr.getAllUsers);
router.get("/sousTraitant", authMiddleware, userCtr.getAllUsers);


router.post("/filter", authMiddleware, userCtr.filterUsers);
router.post("/search", authMiddleware, userCtr.searchUsers);


router.delete("/delete/:id", authMiddleware, userCtr.deleteUser);
/******************************************* */
/************ Event Managment ************** */
/******************************************* */
router.get("/events", authMiddleware, userEventCtr.getUserEvents);
router.get("/getAllevents", authMiddleware, userEventCtr.getAllEvents);
router.post("/setevent", authMiddleware, userEventCtr.createEvent );
router.patch("/acceptEvent/:id", authMiddleware, userEventCtr.updateEvent);
router.delete("/deleteEvent/:id", authMiddleware, userEventCtr.deleteEvent);
router.patch("/updateUserEvent/:id" , authMiddleware , userEventCtr.updateUserEvent)
router.get("/:id", userCtr.getUserById);




module.exports = router;