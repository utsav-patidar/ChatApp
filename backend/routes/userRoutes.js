const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  updateUser,
  createUser,
  getUser,
  getOneUser,
  updateUserFB,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/updateUser").put(updateUser);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.post("/create", createUser);
router.get("/get", getUser);
router.get("/getOne/:id", getOneUser);
router.put("/updateOne/:id", updateUserFB);

module.exports = router;
