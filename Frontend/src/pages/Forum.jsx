import {
  Box,
  Container,
  Flex,
  IconButton,
  ButtonGroup,
  Avatar,
  Heading,
  Button,
  Spacer,
  useDisclosure,
  Collapse,
  Text,
  Editable,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  FormControl,
  ModalFooter,
  Input,
  ModalBody,
  HStack,
  ModalCloseButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import axios from "axios";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { DeleteIcon, EditIcon, CheckIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useEffect, useRef } from "react";
import {
  getPosts,
  createPost,
  deletePost,
  editPost,
  createComment,
  createReaction,
  getPostReactions,
  getCommentReactions,
} from "../data/repository";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { FacebookCounter, FacebookSelector } from "@charkour/react-reactions";

function Forum(props) {
  const toast = useToast();
  const hiddenFileInput = useRef(null);
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();
  const [content, setContent] = useState(""); // Used to set react quill input
  const editContent = useRef("");
  const [posts, setPosts] = useState([]); // Used to set the list of post from API
  const [comments, setComments] = useState([]);
  const [image, setImage] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const API = "https://api.cloudinary.com/v1_1/aglie-loop/image/upload";

  useEffect(() => {
    async function loadPosts() {
      const postData = await getPosts();
      setPosts(postData);
    }
    loadPosts();
  }, []);

  async function newReaction(post_id, emoji) {
    const reaction = {
      user_email: props.user.email,
      post_id: post_id,
      reaction: emoji,
    };
    let updatePost = posts;
    for (const p of updatePost) {
      if (p.post_id === post_id) {
        p.counter.push({ emoji: emoji, by: props.user.name });
      }
    }
    setPosts([...updatePost]);
    await createReaction(reaction);
  }

  async function newReactionComment(post_id, emoji) {
    const reaction = {
      user_email: props.user.email,
      post_id: post_id,
      reaction: emoji,
    };
    let updateComment = comments;
    for (const p of updateComment) {
      if (p.post_id === post_id) {
        p.counter.push({ emoji: emoji, by: props.user.name });
      }
    }
    setComments([...updateComment]);
    await createReaction(reaction);
  }

  function ModalComponent() {
    return (
      <>
        <Modal closeOnOverlayClick={false} isOpen={isOpenModal} onClose={onCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <ReactQuill
                theme="snow"
                name="txt"
                defaultValue={selectedPost.content}
                onChange={(value) => {
                  editContent.current = value;
                }}
              />
            </ModalBody>

            <ModalFooter>
              <IconButton size={"sm"} colorScheme="orange" icon={<FontAwesomeIcon size="2xl" icon={faImage} />} onClick={onPressed}>
                <input
                  id="clicker"
                  type="file"
                  style={{ display: "none" }}
                  ref={hiddenFileInput}
                  accept="image/*"
                  onChange={(e) => uploadFile(e.target.files)}
                />
              </IconButton>
              <Spacer />
              <ButtonGroup justifyContent="center" size="sm">
                <IconButton
                  icon={<CheckIcon />}
                  onClick={() => {
                    onEdit(selectedPost._id);
                  }}
                />
                <IconButton icon={<CloseIcon />} onClick={onCloseModal} />
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  //Fetch all the posts made by all the users

  const onComment = async (e, post) => {
    const created = new Date();
    const comment = {
      content: e.target.value,
      username: post.username,
      parent_id: post._id,
      createdAt: created,
    };


    const newComment = await createComment(comment);
    const newPost = await getPosts();
    setPosts(newPost);
    e.target.value = "";
  };

  const onEdit = async (id) => {
    let post = {};
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "my-uploads");

    if (editContent.current.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      toast({
        title: "Error",
        description: "Field must not be blank.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (editContent.current.length > 800) {
      toast({
        title: "Error",
        description: "800 word limit exceeded",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (image !== null) {
      const link = await axios.post(API, formData);
      post = {
        content: editContent.current,
        link: link.data.secure_url,
      };
    } else {
      post = {
        content: editContent.current,
        link: "",
      };
    }

    await editPost(id, post);
    const newPost = await getPosts();
    setPosts(newPost);
    onCloseModal();
  };

  //This function calls an API from Cloundinary and stores the images uploaded from the user in the cloud
  //Cloundinary returns a link to the image
  const onSubmit = async () => {
    let post = {};
    const formData = new FormData();
    const created = new Date();

    formData.append("file", image);
    formData.append("upload_preset", "my-uploads");

    if (content.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      toast({
        title: "Error",
        description: "Field must not be blank.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (content.length > 800) {
      toast({
        title: "Error",
        description: "800 Word limit exceeded.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (image !== null) {
      const link = await axios.post(API, formData);
      console.log(link.data.secure_url);

      post = {
        parent_id: props.user._id,
        content: content,
        username: props.user.username,
        link: link.data.secure_url,
        createdAt: created,
        updatedAt: null,

      };
    } else {
      post = {
        parent_id: props.user._id,
        content: content,
        username: props.user.username,
        link: "",
        createdAt: created,
        updatedAt: null,
      };
    }
    onToggle();
    const newPost = await createPost(post);
    newPost.name = props.user.username;
    setPosts([...posts, newPost]);
    reset();
  };

  const reset = () => {
    setImage(null);
    setContent(null);
  };

  //Helper function for detecting image upload changes
  const onPressed = () => {
    hiddenFileInput.current.click();
  };

  //Simple function that deletes the specified post
  const onDelete = async (id) => {
    await deletePost(id);
    const getNewPosts = await getPosts();
    setPosts(getNewPosts);
  };

  //This fucntion lets users upload their image to the staging area before being sent to Cloundinary
  const uploadFile = (files) => {
    const image = files[0];
    console.log(image);
    console.log("uploadfile");
    setImage(image);
  };

  return (
    <Box>
      <Container maxW="50%">
        <Box mb={2}>
          <Button colorScheme="teal" onClick={onToggle}>
            {isOpen ? "Cancel" : "Create Post"}
          </Button>
        </Box>

        <Collapse in={isOpen} animateOpacity>
          <Box p={4} rounded={"lg"} borderWidth={1}>
            <Flex>
              <Box pt={2} pb={2}>
                <Avatar bg="teal.500" size={"md"} />
              </Box>
              <Box>
                <Heading size="md" mt={2} p={3}>
                  {props.user.username}
                </Heading>
              </Box>
            </Flex>
            {image !== null && (
              <>
                <div className="image-preview">
                  <img src={URL.createObjectURL(image)} alt="preview" height={200} width={400} />
                </div>
              </>
            )}

            <ReactQuill
              data-testid="quill"
              placeholder="What's on your mind"
              theme="snow"
              name="txt"
              value={content}
              onChange={setContent}
            />

            <Flex mt={3}>
              <IconButton
                type={"file"}
                size={"sm"}
                colorScheme="orange"
                icon={<FontAwesomeIcon size="2xl" icon={faImage} type="file" />}
                onClick={onPressed}
              />
              <input
                id="selector"
                type="file"
                style={{ display: "none" }}
                ref={hiddenFileInput}
                accept="image/*"
                onChange={(e) => uploadFile(e.target.files)}
              />
              <Spacer />
              <ButtonGroup>
                <Button colorScheme="teal" onClick={onSubmit} data-testid="subPost">
                  Post
                </Button>
                <Button
                  onClick={(e) => {
                    reset();
                  }}
                >
                  Reset
                </Button>
              </ButtonGroup>
            </Flex>
          </Box>
        </Collapse>

        {/*map goes here*/}
        {posts !== null &&
          posts.map((post) => (
            <>
              <Box key={post.post_id} p={4} rounded={"lg"} borderWidth={1} mt={3}>
                <Box paddingLeft={3} paddingY={4}>
                  <Flex justifyContent={"space-between"}>
                    <Flex>
                      <Box pt={2} pb={2}>
                        <Avatar bg="teal.500" size={"md"} />
                      </Box>
                      <Box p={3}>
                        <Heading size="sm">{post.username}</Heading>
                        <Text color={"gray.500"} fontSize={"xs"}>
                          {" "}
                          Posted On{" "}
                          {Intl.DateTimeFormat("en-GB", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }).format(new Date(post.createdAt))}
                        </Text>
                      </Box>
                    </Flex>

                    {props.user._id === post.parent_id && (
                      <Menu>
                        <MenuButton as={IconButton} aria-label="Options" icon={<ChevronDownIcon />} variant="outline" />
                        <MenuList>
                          <MenuItem
                            onClick={() => {
                              setSelectedPost(post);
                              onOpenModal();
                            }}
                            icon={<EditIcon />}
                          >
                            Edit
                          </MenuItem>
                          <MenuItem onClick={() => onDelete(post._id)} icon={<DeleteIcon />}>
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    )}

                    {/* <Popover placement="top-start" matchWidth>
                      <PopoverTrigger>
                        <FacebookCounter counters={post.counter} user={props.user.email} />
                      </PopoverTrigger>
                      <PopoverContent borderWidth={0}>
                        <FacebookSelector onSelect={(label) => newReaction(post.post_id, label)} />
                      </PopoverContent>
                    </Popover> */}
                  </Flex>

                  <div style={{ paddingTop: "5px" }} dangerouslySetInnerHTML={{ __html: post.content }} />
                  <Spacer />
                </Box>
                <Editable
                  isPreviewFocusable={false}
                  onSubmit={() => {
                    onEdit(post.post_id);
                  }}
                >
                  {post.link !== "" ? (
                    <>
                      <div className="image-preview">
                        <img src={post.link} alt="preview" height={200} width={400} />
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </Editable>
                {post.comments !== null &&
                  post.comments.map(
                    (comment) =>
                      <Box rounded={"lg"} mt={3} ml={3}>
                        <Flex>
                          <Box pt={2} pb={2}>
                            <Avatar bg="teal.500" size={"md"} />
                          </Box>
                          <Box p={3}>
                            <HStack spacing="24px">
                              <Heading size="sm">{comment.username}</Heading>
                              <Text color={"gray.500"} fontSize={"xs"}>
                                {" "}
                                Posted On{" "}
                                {Intl.DateTimeFormat("en-GB", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }).format(new Date(comment.createdAt))}
                              </Text>
                            </HStack>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: comment.content,
                              }}
                            />
                          </Box>
                          <Spacer />

                          {/* <Box mt={7}>
                            <Popover placement="top-start" matchWidth>
                              <PopoverTrigger>
                                <FacebookCounter counters={comment.counter} user={props.user.email} />
                              </PopoverTrigger>
                              <PopoverContent borderWidth={0}>
                                <FacebookSelector onSelect={(label) => newReactionComment(comment.post_id, label)} />
                              </PopoverContent>
                            </Popover>
                          </Box> */}
                        </Flex>
                      </Box>
                  )
                }
                <Box p={3} rounded={"lg"} mt={3}>
                  <HStack spacing={2} direction="row">
                    <Box pt={2} pb={2}>
                      <Avatar bg="teal.500" size={"md"} />
                    </Box>
                    <Box p={3} flex="1">
                      <FormControl>
                        <Input
                          data-testid={`input-${post.post_id}`}
                          placeholder="Write a reply..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              onComment(e, post);
                            }
                          }}
                        />
                      </FormControl>
                    </Box>
                  </HStack>
                </Box>
              </Box>
              <br />
            </>
          ))}

        {selectedPost !== null && <ModalComponent />}
      </Container>
    </Box>
  );
}

export default Forum;
