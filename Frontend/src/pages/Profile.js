import {
  Box,
  Container,
  Avatar,
  Stack,
  Text,
  Editable,
  EditableInput,
  EditablePreview,
  Input,
  InputRightElement,
  InputGroup,
  StackDivider,
  Button,
  FormControl,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Collapse,
  AlertDialog,
  AlertDialogOverlay,
  useDisclosure,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Progress,
  Flex,
  Heading,
  Grid,
} from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditableControls from "./EditableControls";
import {
  findUser,
  updateName,
  updateEmail,
  deleteUser,
  getFollowings,
  loadUserPosts,
} from "../data/repository";
import UserDisplay from "./UserDisplay";
import Comment from "./Comment";

function Profile(props) {
  const { id } = useParams();

  const navigate = useNavigate();
  // const user = getCurrentUser();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userJoinedOn, setUserJoinedOn] = useState("");
  const [alertName, setAlertName] = useState(false); //Visual cues on succesful name change
  const [alertEmail, setAlertEmail] = useState(false); //Visual cues on succesful email change
  const [isDeletingUser, setDeletingUser] = useState(false); //Whether a user is being deleted
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [follows, setFollows] = useState([]);
  const [posts, setPosts] = useState([]);
  const cancelRef = useRef();

  useEffect(
    () => {
      async function loadUser() {
        const currentUser = await findUser(id);
        const follows = await getFollowings(id);
        const posts = await loadUserPosts(id);
        setPosts(posts);
        setFollows(follows);
        setUserName(currentUser.name);
        setUserEmail(currentUser.email);
        setUserJoinedOn(currentUser.createdAt);
        setIsLoading(false);
      }
      loadUser();
    },
    [setFollows],
    [setPosts]
  );

  function deleteAccount() {
    setDeletingUser(true);
    setTimeout(async () => {
      await deleteUser(userEmail);
      props.logout();
      navigate("/");
    }, 3000);
  }

  return (
    <Box pl={20}>
      <Flex>
        <Box p={20} minW="500px">
          {isLoading ? (
            <div>Loading</div>
          ) : (
            <Container maxW="sm" rounded={"lg"} borderWidth={1}>
              <Box pt={10} align={"center"}>
                <Avatar bg="teal.500" size={"2xl"} />
              </Box>
              <Stack
                spacing={5}
                p={10}
                divider={<StackDivider borderColor="gray.200" />}
              >
                <Formik
                  initialValues={{ name: userName }}
                  validationSchema={Yup.object({
                    name: Yup.string().required("Name cannot be empty"),
                  })}
                  onSubmit={async (value) => {
                    if (userName !== value.name) {
                      await updateName(value.name, userEmail);

                      setAlertName(true);
                      setUserName(value.name);
                      setTimeout(() => {
                        setAlertName(false);
                      }, 3000);
                    }
                  }}
                >
                  {(formik) => (
                    <Box>
                      <Text color={"gray.500"} fontSize={"xs"}>
                        NAME
                      </Text>
                      <FormControl isInvalid={formik.errors.name}>
                        <InputGroup>
                          <Editable
                            fontSize={"lg"}
                            fontWeight={400}
                            isPreviewFocusable={false}
                            value={formik.values.name}
                            onSubmit={formik.handleSubmit}
                          >
                            <EditablePreview />
                            <Input
                              name="name"
                              as={EditableInput}
                              variant="flushed"
                              size={"xl"}
                              onChange={formik.handleChange}
                            />
                            {props.user.email === id && (
                              <InputRightElement
                                children={<EditableControls />}
                              />
                            )}
                          </Editable>
                          <FormErrorMessage>
                            {formik.errors.name}
                          </FormErrorMessage>
                        </InputGroup>
                      </FormControl>
                      <Collapse in={alertName} animateOpacity>
                        <Alert status="success" mt={2}>
                          <AlertIcon />
                          Changed Name!
                        </Alert>
                      </Collapse>
                    </Box>
                  )}
                </Formik>
                <Formik
                  initialValues={{ email: userEmail }}
                  validationSchema={Yup.object({
                    email: Yup.string()
                      .required("Email cannot be empty")
                      .email("Email must be a valid Email")
                      .test(
                        "validateEmail",
                        "This email is already in use",
                        async function () {
                          const user = await findUser(this.parent.email);
                          if (user === null) {
                            return true;
                          } else {
                            return false;
                          }
                        }
                      ),
                  })}
                  onSubmit={async (value) => {
                    if (userEmail !== value.email) {
                      await updateEmail(userEmail, value.email);
                      setAlertEmail(true);
                      setUserEmail(value.email);

                      setTimeout(() => {
                        setAlertEmail(false);
                      }, 3000);
                    }
                  }}
                >
                  {(formik) => (
                    <Box>
                      <Text color={"gray.500"} fontSize={"xs"}>
                        EMAIL
                      </Text>
                      <FormControl isInvalid={formik.errors.email}>
                        <InputGroup>
                          <Editable
                            fontSize={"lg"}
                            fontWeight={400}
                            isPreviewFocusable={false}
                            value={formik.values.email}
                            onSubmit={formik.handleSubmit}
                          >
                            <EditablePreview />
                            <Input
                              name="email"
                              as={EditableInput}
                              variant="flushed"
                              size={"xl"}
                              onChange={formik.handleChange}
                            />
                          </Editable>
                        </InputGroup>
                        <FormErrorMessage>
                          {formik.errors.email}
                        </FormErrorMessage>
                      </FormControl>

                      <Collapse in={alertEmail} animateOpacity>
                        <Alert status="success" mt={2}>
                          <AlertIcon />
                          Changed Email!
                        </Alert>
                      </Collapse>
                    </Box>
                  )}
                </Formik>
                <Box>
                  <Text color={"gray.500"} fontSize={"xs"}>
                    JOINED ON
                  </Text>
                  <Text fontSize={"lg"} fontWeight={400}>
                    {Intl.DateTimeFormat("en-GB", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(userJoinedOn))}
                  </Text>
                </Box>
              </Stack>
              <Box pl={10} pr={10} pb={10}>
                {props.user.email === id ? (
                  <Button colorScheme="red" onClick={onOpen} minW={"100%"}>
                    DELETE ACCOUNT
                  </Button>
                ) : (
                  <></>
                )}
                <AlertDialog
                  isOpen={isOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete Account
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        {isDeletingUser ? (
                          <Box>
                            <Text pb={3}>
                              Deleting all your account data including posts
                            </Text>
                            <Progress
                              size="sm"
                              colorScheme="teal"
                              isIndeterminate
                            />
                          </Box>
                        ) : (
                          <Text>Confirm to delete your account</Text>
                        )}
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                          Cancel
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={deleteAccount}
                          ml={3}
                          isLoading={isDeletingUser}
                        >
                          Confirm
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </Box>
            </Container>
          )}
        </Box>
        <Stack minW="40%" pt={70} pb={70}>
          <Box>
            <Heading>Comments</Heading>
          </Box>
          {posts.map((post) => (
            <Comment
              key={post.post_id}
              name={post.name}
              content={post.content}
              time={post.createdAt}
              link={post.link}
            />
          ))}
        </Stack>
        <Stack pt={70} pl={70}>
          <Heading size="md" ml={3}>
            Following
          </Heading>

          <Grid templateColumns="repeat(3, 1fr)" gap={3}>
            {follows.map((follow, index) => (
              <UserDisplay
                id={follow.follow_id}
                name={follow.name}
                email={follow.email}
                user={id}
                currentUser={props.user.email}
              />
            ))}
          </Grid>
        </Stack>
      </Flex>
    </Box>
  );
}

export default Profile;
