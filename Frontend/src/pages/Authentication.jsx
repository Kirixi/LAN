import {
    Box,
    Container,
    Center,
    Stack,
    Heading,
    Button,
    Text,
    Link,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import FormField from "./FormField";
import { useNavigate, generatePath } from "react-router-dom";
import { useState } from "react";
import { generateCode, sendCode } from "../services/VerifyUser";
import {getAuthentication, setAuthentication } from "../data/User";

function Authentication(props){

    const navigate = useNavigate();
    //Initialise the verification code
    const [verificationCode, setVerificationCode] = useState(getAuthentication().code);
    const [user] = useState(getAuthentication().user);

    //Funtion to get a new verification code
    function resendCode(){
      const newCode = generateCode();
      setAuthentication(user, verificationCode);
      setVerificationCode(newCode); //Update to new verification code
      alert("New code sent! Check your email");
      sendCode(user.name, newCode); //Send the code to user email
    }
    
    return (
        <Box minH={"87vh"}>
          <Center minH={"70vh"}>
            <Formik
              initialValues={{
                code: ""
              }}
              validationSchema={Yup.object({
                code: Yup.string()
                  .required("Please check your email for verification code")
                  .test('match', 
                    'Invalid code, please check your email', 
                    //Check code matches with user input
                    function() {
                      const emailCode = String(verificationCode);
                      return this.parent.code.trim() === emailCode.trim(); 
                  }),          
              })}
              //Login user on submit
              onSubmit={() => {
                setTimeout(() => {
                  props.loginUser(user);
                  navigate(generatePath("/profile/:id", { id:user.email }));
                }, 1500);
              }}
              validateOnChange={false}
              validateOnBlur={false}
            >
              {(formik) => (
                <Container
                  maxW="md"
                  boxShadow={"2xl"}
                  rounded={"lg"}
                  borderWidth={1}
                  onSubmit={formik.handleSubmit}
                  as="form"
                >
                  <Box align={"center"} pt={8}>
                    <Heading fontSize={"3xl"}>Confirm Sign In</Heading>
                  </Box>

                  
                  <Stack spacing={6} py={10} px={6}>
                    <FormField
                      name="code"
                      type="text"
                      placeholder="Enter your code"
                      label={"Cofirmation Code"}
                    />
                    <Text color={"gray.600"}>We sent a verification code to {user.email}</Text>
                    <Box>
                      <Stack spacing={4}>
                        <Alert
                          status="success"
                          display={formik.isSubmitting ? "inherit" : "none"}
                        >
                          <AlertIcon />
                          Logging You In!
                        </Alert>
                        <Button
                          type="submit"
                          isLoading={formik.isSubmitting}
                          bg={"tomato"}
                          color={"white"}
                          _hover={{ bg: "red.500" }}
                          minW={"100%"}
                        >
                          Confirm
                        </Button>
    
                        <Text
                          fontSize={"sm"}
                          color={"gray.600"}
                          align={"center"}
                          pt={5}
                        >
                          Didn't receive a code?{" "}
                          <Link color={"blue.400"} onClick={resendCode}>
                            Resend
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
export default Authentication;