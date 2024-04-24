import { Box, Heading, Avatar, Flex, Text, Button, SimpleGrid, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { loadUsersWithFollowers, createFollow, deleteFollow } from "../data/repository";

function Users(props) {
  const [users, setUsers] = useState([]);
  const toast = useToast();

  useEffect(() => {
    async function loadUsers() {
      const userData = await loadUsersWithFollowers(props.user._id);
      setUsers(userData);
    }
    loadUsers();
  }, [props.user]);

  async function follow(follower_id, index) {
    let user = users;

    user[index].following = true;

    await createFollow({
      user_id: follower_id,
      follower_id: props.user._id,
      username: props.user.username,
    })
      .then((res) => {
        toast({
          title: "Success",
          description: res.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        console.log(res);
        user[index].follow_id = res.data._id;
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
    setUsers([...user]);
  }

  async function unfollow(followID, index) {
    let user = users;
    user[index].following = false;
    setUsers([...user]);
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
  }

  function FollowButton({ isFollowing, followID, follower_id, index }) {
    return (
      <Box>
        {isFollowing ? (
          <Button colorScheme="teal" variant="solid" textAlign={"center"} onClick={() => unfollow(followID, index)}>
            Following
          </Button>
        ) : (
          <Button variant="outline" textAlign={"center"} onClick={() => follow(follower_id, index)}>
            Follow
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box align={"center"} mt={15} minH={"75vh"}>
      <Heading color={"gray.500"}>Active Users</Heading>

      <Flex justifyContent={"center"} mt={20}>
        <SimpleGrid columns={3} spacing={10}>
          {users.map((user, index) => (
            <Box data-testid="follow" p={4} rounded={"lg"} borderWidth={1} minW={450} key={user.username}>
              <Flex justifyContent={"space-between"}>
                <Avatar bg="teal.500" size={"xl"} />
                <Box ml={4} mt={3}>
                  <Heading p={1} size={"md"} textAlign={"left"}>
                    {" "}
                    {user.username}
                  </Heading>
                  <Text pl={1} textAlign={"left"}>
                    {" "}
                    {user.email}
                  </Text>
                </Box>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <FollowButton isFollowing={user.following} followID={user.follow_id} follower_id={user._id} index={index} />
                </div>
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      </Flex>
    </Box>
  );
}

export default Users;
