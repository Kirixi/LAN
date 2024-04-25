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
  useToast,
  Grid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
  isFollowingUser,
  createFollow,
  deleteFollow,
} from "../data/repository";
import UserDisplay from "./UserDisplay";
import Comment from "./Comment";

function Profile(props) {
  const { id } = useParams();

  const navigate = useNavigate();
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
  const [isFollowing, setIsFollowing] = useState(null);
  const [followID, setFollowID] = useState();
  const cancelRef = useRef();
  const toast = useToast();

  useEffect(
    () => {
      async function loadUser() {
        let following;
        if (props.user._id !== id) {
          following = await isFollowingUser(id, props.user._id);
          setIsFollowing(following.found);
          setFollowID(following.followID);
        }
        const currentUser = await findUser(id);
        const follows = await getFollowings(id);
        const postObj = await loadUserPosts(id);
        setPosts(postObj.data);
        setFollows(follows);
        setUserName(currentUser.username);
        setUserEmail(currentUser.email);
        setUserJoinedOn(currentUser.joined);
        setIsLoading(false);
      }
      loadUser();
    },
    [id, setFollows, props.user],
    [setPosts]
  );

  useEffect(() => {
    console.log(followID);
  }, [followID]);

  function deleteAccount() {
    setDeletingUser(true);
    setTimeout(async () => {
      await deleteUser(userEmail);
      props.logout();
      navigate("/");
    }, 3000);
  }

  async function follow() {
    await createFollow({
      user_id: id,
      follower_id: props.user._id,
      username: props.user.username,
    })
      .then((res) => {
        setFollowID(res.data._id);
        toast({
          title: "Success",
          description: res.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.response.data.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    setIsFollowing(!isFollowing);
  }

  async function unfollow() {
    await deleteFollow(followID)
      .then((res) => {
        toast({
          title: "Success",
          description: res.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: error.response.data.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    setIsFollowing(!isFollowing);
    setFollowID("");
  }

  return (
    <Box>
      <Flex mt={30} mx={10} justifyContent={"space-around"}>
        <Box minW="350px">
          {isLoading ? (
            <div>Loading</div>
          ) : (
            <Container maxW="sm" rounded={"lg"} borderWidth={1}>
              <Box pt={10} align={"center"}>
                <Avatar bg="teal.500" size={"2xl"} />
              </Box>
              <Stack spacing={5} p={10} divider={<StackDivider borderColor="gray.200" />}>
                <Formik
                  enableReinitialize
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
                            <Input name="name" as={EditableInput} variant="flushed" size={"xl"} onChange={formik.handleChange} />
                            {props.user._id === id && <InputRightElement children={<EditableControls />} />}
                          </Editable>
                          <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
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
                  enableReinitialize
                  initialValues={{ email: userEmail }}
                  validationSchema={Yup.object({
                    email: Yup.string()
                      .required("Email cannot be empty")
                      .email("Email must be a valid Email")
                      .test("validateEmail", "This email is already in use", async function () {
                        const user = await findUser(this.parent.email);
                        if (user === null) {
                          return true;
                        } else {
                          return false;
                        }
                      }),
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
                            <Input name="email" as={EditableInput} variant="flushed" size={"xl"} onChange={formik.handleChange} />
                            {props.user._id === id && <InputRightElement children={<EditableControls />} />}
                          </Editable>
                        </InputGroup>
                        <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
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
                {props.user._id === id ? (
                  <Button colorScheme="red" onClick={onOpen} minW={"100%"}>
                    DELETE ACCOUNT
                  </Button>
                ) : isFollowing ? (
                  <Button variant="outline" minW={"100%"} textAlign={"center"} onClick={() => unfollow()}>
                    Following
                  </Button>
                ) : (
                  <Button colorScheme="teal" minW={"100%"} variant="solid" textAlign={"center"} onClick={() => follow()}>
                    Follow
                  </Button>
                )}
                <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete Account
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        {isDeletingUser ? (
                          <Box>
                            <Text pb={3}>Deleting all your account data including posts</Text>
                            <Progress size="sm" colorScheme="teal" isIndeterminate />
                          </Box>
                        ) : (
                          <Text>Confirm to delete your account</Text>
                        )}
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                          Cancel
                        </Button>
                        <Button colorScheme="red" onClick={deleteAccount} ml={3} isLoading={isDeletingUser}>
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
        <Stack minW="40%">
          <Tabs isFitted size="md" colorScheme="teal">
            <TabList mb="1em">
              <Tab>Posts</Tab>
              <Tab>Comments</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <p>Posts</p>
              </TabPanel>
              <TabPanel>
                <p>comments</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
          {posts.map((post) => (
            <Comment key={post.post_id} name={post.username} content={post.content} time={post.createdAt} link={post.link} />
          ))}
        </Stack>
        <Stack minW={"220px"} spacing={"100px"}>
          <Stack>
            <Heading size="md">Following</Heading>
            <Grid templateColumns="repeat(4, 1fr)" gap={3}>
              {follows.map((follow, index) => (
                <UserDisplay id={follow.user_id} />
              ))}
            </Grid>
          </Stack>

          <Stack>
            <Heading size="md">Followers</Heading>
            <Grid templateColumns="repeat(4, 1fr)" gap={3}>
              {follows.map((follow, index) => (
                <UserDisplay id={follow.user_id} />
              ))}
            </Grid>
          </Stack>
        </Stack>
      </Flex>
    </Box>
  );
}

export default Profile;
