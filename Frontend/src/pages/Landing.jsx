import {
  Box,
  SimpleGrid,
  Heading,
  Text,
  Button,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  function redirect() {
    navigate("/signup");
  }
  return (
    <Box>
      <SimpleGrid columns={2} minH={"80vh"} p={180} spacing="60px">
        <Box>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
          >
            <Text
              as={"span"}
              position={"relative"}
              _after={{
                content: "''",
                width: "full",
                height: "30%",
                position: "absolute",
                bottom: 1,
                left: 0,
                bg: "teal.400",
                zIndex: -1,
              }}
            >
              Welcome to Loop-Agile-Now,
            </Text>
            <br />
            <Text as={"span"} color={"teal.400"}>
              Connecting people one click at a time
            </Text>
          </Heading>
          <Text color={"gray.500"} fontSize={20} pt={30}>
            Loop Agile aims to make communication between colleagues a smoother
            experience. It is a platform designed to connect users all around
            the world by enabling community of practice.
          </Text>
          <Box pt={30}>
            <Button
              rounded={"full"}
              size={"lg"}
              fontWeight={"normal"}
              px={6}
              colorScheme={"red"}
              bg={"red.400"}
              _hover={{ bg: "red.500" }}
              onClick={redirect}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
        <Box>
          <Box
            position={"relative"}
            height={"450px"}
            rounded={"2xl"}
            boxShadow={"2xl"}
            width={"full"}
            overflow={"hidden"}
          >
            <Image
              alt={"Hero Image"}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h={"100%"}
              src={
                "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
              }
            />
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
    
  );
}
export default Landing;
