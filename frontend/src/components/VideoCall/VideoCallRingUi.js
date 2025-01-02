// VideoCallRing.js
import { Box, IconButton, Text } from "@chakra-ui/react";
import { FaVideo } from "react-icons/fa";
import { useHistory } from "react-router-dom";

const VideoCallRing = (senderInfo) => {
  const history = useHistory();
  const prop = senderInfo?.senderInfo;
  return (
    <Box
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      textAlign="center"
      bg="white"
      padding="4"
      borderRadius="md"
      boxShadow="lg"
    >
      <audio src="skype_call.mp3" controls autoPlay={true} />
      <IconButton
        icon={<FaVideo size={24} />}
        isRound
        bg="red.500"
        color="white"
        size="lg"
        mb="2"
        onClick={() => history.push(`room?roomID=${prop?._id}`)}
      />
      <Text fontWeight="bold">Incoming Video Call</Text>
      <Text fontSize="sm" color="gray.500">
        {prop?.name} calling...
      </Text>
    </Box>
  );
};

export default VideoCallRing;
