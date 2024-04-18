import { Box, Container, Center, Stack, Heading, Button, Text, Link, Alert, AlertIcon } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Link as RouteLink, useNavigate, generatePath } from "react-router-dom";
import FormField from "./FormField";
import { verifyEmail, createUser } from "../data/repository";

function SignUp(props) {
  const navigate = useNavigate();

  return (
    <Box>
      <Center minH={"80vh"}>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPass: "",
          }}
          validationSchema={Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string()
              .email("Email must be a valid Email")
              .required("Email is required")
              .test("validateEmail", "An account with this email already exists", async function () {
                const user = await verifyEmail(this.parent.email); // Checks if email has already been registered
                return user.data.verified;
              }),
            password: Yup.string()
              .required("Password is required")
              .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/,
                "Must contain atleast 8 Characters, One uppercase, One lowercase, One digit and One special character"
              ),
            confirmPass: Yup.string()
              .required("Please confirm your password")
              .oneOf([Yup.ref("password"), null], "Passwords must match"),
          })}
          onSubmit={(values) => {
            setTimeout(async () => {
              const joined = new Date();

              const user = {
                username: values.name,
                email: values.email,
                password: values.password,
                joined: joined,
              };

              const createdUser = await createUser(user);

              props.loginUser(createdUser); //Set logged in user
              navigate(generatePath("/profile/:id", { id: createdUser._id }));
            }, 1500);
          }}
        >
          {(formik) => (
            <Container maxW="md" boxShadow={"2xl"} rounded={"lg"} borderWidth={1} as="form" onSubmit={formik.handleSubmit}>
              <Box align={"center"} pt={8}>
                <Heading fontSize={"3xl"}>Sign Up</Heading>
              </Box>

              <Stack spacing={6} py={10} px={6}>
                <FormField name="name" type="text" placeholder="Enter your name" label={"Name"} />

                <FormField name="email" type="email" placeholder="Enter your email address" label={"Email Address"} />

                <FormField name="password" type="password" placeholder="Create a password" label={"Password"} />

                <FormField name="confirmPass" type="password" placeholder="Confirm your password" label={"Confirm Password"} />

                <Box>
                  <Stack spacing={4}>
                    <Alert status="success" display={formik.isSubmitting ? "inherit" : "none"}>
                      <AlertIcon />
                      Account successfully created!
                    </Alert>
                    <Button
                      type="submit"
                      isLoading={formik.isSubmitting}
                      bg={"teal"}
                      color={"white"}
                      _hover={{ bg: "teal.400" }}
                      minW={"100%"}
                    >
                      Sign Up
                    </Button>

                    <Text fontSize={"sm"} color={"gray.600"} align={"center"}>
                      Already have an account?{" "}
                      <Link as={RouteLink} to="/login" color={"blue.400"}>
                        Sign In
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
export default SignUp;
