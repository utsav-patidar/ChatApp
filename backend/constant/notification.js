const firebaseAdmin = require("./../config/firebase");

const sendNotification = async (message) => {
  try {
    const res = await firebaseAdmin.messaging().send(message);
    return res;
  } catch (error) {
    console.error(`Error sending notification: ${error}`);
    return `Something went wrong please contact to administration`;
  }
};

module.exports = sendNotification;
