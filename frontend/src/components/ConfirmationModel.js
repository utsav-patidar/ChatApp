import React from "react";
import {
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { theme } from "../style";
const ConfirmationModel = ({ isOpen, setVideoCallModel, user, vcStart }) => {
  const { darkmode } = ChatState();
  return (
    <Modal isOpen={isOpen} onClose={() => setVideoCallModel(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          textAlign="center"
          fontSize="2xl"
          bg={darkmode ? theme?.darkbackground : theme?.lightbackground}
          color={darkmode ? theme?.lightBorder : theme?.lightColor}
        >
          Are You sure starting video call with {user}?
        </ModalHeader>
        <ModalFooter
          justifyContent="center"
          bg={darkmode ? theme?.darkbackground : theme?.lightbackground}
        >
          <Button
            colorScheme="blue"
            mr={3}
            onClick={() => vcStart()}
            // isLoading={loading}
          >
            Submit
          </Button>
          <Button onClick={() => setVideoCallModel(false)}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModel;
