const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const DeviceToken = require("../models/deviceToken");
const sendNotification = require("../constant/notification");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, isPic, pic } = req.body;
  console.log(req.body, "body");
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    isPic: isPic,
    pic: pic,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    const chat = await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    const receiverUser = chat?.users.filter(
      (user) => String(user) !== String(req.user._id)
    );
    var user = await User.findById(req.user._id);
    for (const i of receiverUser) {
      const deviceToken = await DeviceToken.findOne({ userId: i });
      const message = {
        notification: {
          title: `${user?.name} message you`,
          body: `Message: ${req.body.content}`,
          image: user?.pic,
        },
        token: deviceToken?.token,
      };
      await sendNotification(message); // Corrected function call
    }
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
