import * as React from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ChatState } from "./../../Context/ChatProvider";
import { useHistory } from "react-router-dom";
import { Center, Button } from "@chakra-ui/react";
function randomID(len) {
  let result = "";
  if (result) return result;
  var chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}
export function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  console.log(urlStr);
  return new URLSearchParams(urlStr);
}
export default function Room() {
  const {  setVideoCallOn, user } = ChatState();
  const history = useHistory();
  const roomID = getUrlParams().get("roomID") || user?._id;
  let myMeeting = async (element) => {
    const appID = 1273852464;
    const serverSecret = "e24cf63b92d0e6a9a665ce51a06063b8";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID, //roomID
      randomID(5),
      user?.name //name
    );

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    // start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            roomID, //roomID
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });
  };
  const handleButtonClick = () => {
    history.push("/chats");
    setVideoCallOn(false);
    window.location.reload();
  };
  return (
    <div>
      <Center h="10vh">
        <Button onClick={handleButtonClick} colorScheme="teal">
          Back to Chats
        </Button>
      </Center>
      <div
        className="myCallContainer"
        ref={myMeeting}
        style={{ width: "100vw", height: "90vh" }}
      ></div>
    </div>
  );
}
