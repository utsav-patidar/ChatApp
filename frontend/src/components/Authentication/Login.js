import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  useToast,
  Container,
  HStack,
  Box,
  Image,
  Text,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import { messaging } from "../../config/firebase";
import { getToken } from "firebase/messaging";
import GoogleLoginButton from "./GoogleLoginButton";
const Login = () => {
  const [show, setShow] = useState(false);
  const [googleauthshow, setGoogleauthShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const history = useHistory();
  const { setUser } = ChatState();

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      console.log(token, "token");
      const { data } = await axios.post(
        "/api/user/login",
        { email, password, token },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const gotoSignUp = () => {
    history.push("signup");
  };
  const requestPermission = async () => {
    const Permission = await Notification.requestPermission();
    if (Permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BMV9e8dZt2ZuJA05Xiy2B5hIGzEGJOsG_BQry7yyNvh4C0Qx-VF1jIMxbP0vg37VYPuOshcPViz5sbzUiw0fLTo",
      });
      setToken(token);
    } else if (Permission === "denied") {
      alert("You denied for the permission");
    }
  };
  useEffect(() => {
    requestPermission();
  }, []);
  const handleGoogleLoginSuccess = (response) => {
    // Handle successful Google login response
    console.log("Google login success:", response);
    // You can send the response to your backend for further authentication
  };

  const handleGoogleLoginFailure = (error) => {
    // Handle failed Google login
    console.error("Google login failed:", error);
  };
  const call = () => {};
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <HStack spacing="2">
          <Image src="Favicon.png" alt="LiveChat Logo" boxSize="50px" />
          <Text
            fontSize="4xl"
            fontWeight={"extrabold"}
            pb={3}
            fontFamily="Work Sans"
            color="#32ccfe"
          >
            ChatApp
          </Text>
        </HStack>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <VStack spacing="10px">
          <FormControl id="email" isRequired>
            <FormLabel>Email Address</FormLabel>
            <Input
              value={email}
              type="email"
              placeholder="Enter Your Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup size="md">
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={show ? "text" : "password"}
                placeholder="Enter password"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={loading}
          >
            Login
          </Button>
        </VStack>
        <Text textAlign={"center"}>
          You have no registered yet?{" "}
          <span
            style={{
              color: "#32ccfe",
              cursor: "pointer",
              textDecorationLine: "underline",
            }}
            onClick={() => {
              gotoSignUp();
            }}
          >
            Register
          </span>
        </Text>
      </Box>
      <div onClick={() => setGoogleauthShow(true)}>Click to show</div>
      {googleauthshow && (
        <GoogleLoginButton
          onSuccess={handleGoogleLoginSuccess}
          onFailure={handleGoogleLoginFailure}
        />
      )}
    </Container>
  );
};

export default Login;
