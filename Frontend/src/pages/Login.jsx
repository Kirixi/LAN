import { Box, Container, Center, Stack, Heading, Button, Text, Link, Alert, AlertIcon } from "@chakra-ui/react";

import { Formik } from "formik";
import * as Yup from "yup";
import FormField from "./FormField";
import { Link as RouteLink, useNavigate, generatePath } from "react-router-dom";
import { verifyUser } from "../data/repository";

// import { generateCode, sendCode } from "../services/VerifyUser";
// import { setAuthentication } from "../data/User";
import { useState } from "react";

function Login(props) {
  const [alertOn, setAlertOn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (user) => {
    const userObj = {
      email: user.email,
      password: user.password,
    };

    try {
      const data = await verifyUser(userObj);
      props.loginUser(data);
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <Box minH={"87vh"}>
      <Center minH={"70vh"}>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string().email("Email must be a valid Email").required("Email is required"),
            password: Yup.string()
              .required("Password is required")
              .test(
                "validateUser",
                "Invalid Email or Password. Try Again",
                //Check password and email of user
                async function () {
                  try {
                    const userObj = {
                      email: this.parent.email,
                      password: this.parent.password,
                    };

                    const res = await verifyUser(userObj);
                    if (res !== null) {
                      setAlertOn(false);
                      return true; // Password and email are valid
                    } else {
                      throw new Error("Invalid Email or Password. Try Again");
                    }
                  } catch (error) {
                    setErrorMsg(error.response.data.message);
                    setAlertOn(true);
                  }
                }
              ),
          })}
          onSubmit={(values) => {
            setTimeout(() => {
              onSubmit(values).then((res) => {
                navigate(generatePath("/profile/:id", { id: res.data._id }));
              });
            }, 1500);
          }}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {(formik) => (
            <Container maxW="md" boxShadow={"2xl"} rounded={"lg"} borderWidth={1} onSubmit={formik.handleSubmit} as="form">
              <Box align={"center"} pt={8}>
                <Heading fontSize={"3xl"}>Log In</Heading>
              </Box>

              <Stack spacing={6} py={10} px={6}>
                <FormField name="email" type="email" placeholder="Enter your email address" label={"Email Address"} />

                <FormField name="password" type="password" placeholder="Enter your password" label={"Password"} />

                <Box>
                  <Stack spacing={4}>
                    <Alert status="error" display={alertOn ? "inherit" : "none"}>
                      <AlertIcon />
                      {errorMsg}
                    </Alert>
                    <Button
                      type="submit"
                      isLoading={formik.isSubmitting}
                      bg={"red.400"}
                      color={"white"}
                      _hover={{ bg: "red.500" }}
                      minW={"100%"}
                    >
                      Sign In
                    </Button>

                    <Text fontSize={"sm"} color={"gray.600"} align={"center"} pt={5}>
                      Don't have an account?{" "}
                      <Link as={RouteLink} to="/signup" color={"blue.400"}>
                        Sign Up
                      </Link>
                    </Text>
                  </Stack>
                </Box>
              </Stack>
            </Container>
          )}
        </Formik>
      </Center>
    </Box>
  );
}
export default Login;
