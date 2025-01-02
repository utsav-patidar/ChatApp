const db = require("../config/firebaseDB");

const userModel = db.collection("Users");

module.exports = userModel;
