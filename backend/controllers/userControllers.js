const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const DeviceToken = require("../models/deviceToken");
const generateToken = require("../config/generateToken");
const { Types } = require("mongoose");
const userModel = require("../firebasemodel/user.model");
const ObjectId = Types.ObjectId;

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password, token } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const UserData = await User.findByIdAndUpdate(
      { _id: new ObjectId(user._id) },
      { isLogin: user.isLogin + 1 },
      { new: true } // Pass options as an object
    );
    const Device = await DeviceToken.findOne({
      userId: new ObjectId(UserData._id),
    });
    if (Device) {
      await DeviceToken.findOneAndUpdate(
        { userId: new ObjectId(UserData._id) },
        { token: token }
      );
    } else {
      await DeviceToken.create({
        userId: new ObjectId(UserData._id),
        token: token,
      });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      isLogin: UserData.isLogin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const updateUser = asyncHandler(async (req, resp) => {
  const { _id, ...updateData } = req.body; // Destructure _id and get other fields as updateData

  // Use findByIdAndUpdate with correct syntax
  const data = await User.findByIdAndUpdate(
    _id,
    updateData,
    { new: true } // Pass options as an object
  );

  resp.json({
    _id: data._id,
    name: data.name,
    email: data.email,
    isAdmin: data.isAdmin,
    pic: data.pic,
    token: generateToken(data._id),
  }); // Assuming you want to send the updated data as a JSON response
});

const lastSeen = async (id, isActive) => {
  try {
    if (id === "123") return;
    if (isActive) {
      await User.findByIdAndUpdate(id, { isActive: true });
    } else {
      await User.findByIdAndUpdate(id, {
        isActive: false,
        lastSeen: new Date(),
      });
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  const user = await userModel.add({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      user,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

const getUser = asyncHandler(async (req, res) => {
  try {
    const snapshot = await userModel.get();
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Error getting users:", error);
    throw new Error("Error getting users");
  }
});

const getOneUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id; // Assuming the user ID is passed as a parameter in the request

    const userDoc = await userModel.doc(userId).get();
    if (!userDoc.exists) {
      res.status(404);
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    res.status(200).json({
      user: {
        id: userDoc.id,
        ...userData,
      },
    });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Error getting user" });
  }
});

const updateUserFB = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id; // Assuming the user ID is passed as a parameter in the request
    const userDataToUpdate = req.body; // New user data to update

    // Check if the user exists
    const userDoc = await userModel.doc(userId).get();
    if (!userDoc.exists) {
      res.status(404);
      throw new Error("User not found");
    }

    // Update the user document
    await userModel.doc(userId).update(userDataToUpdate);

    // Fetch the updated user data
    const updatedUserDoc = await userModel.doc(userId).get();
    const updatedUserData = updatedUserDoc.data();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUserDoc.id,
        ...updatedUserData,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user" });
  }
});

module.exports = {
  allUsers,
  registerUser,
  authUser,
  updateUser,
  lastSeen,
  createUser,
  getUser,
  getOneUser,
  updateUserFB,
};
