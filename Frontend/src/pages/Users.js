import { Box, Heading, Avatar, Flex, Text, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  loadUsersWithFollowers,
  createFollow,
  deleteFollow,
} from "../data/repository";

function Users(props) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function loadUsers() {
      const userData = await loadUsersWithFollowers(props.user.email);

      setUsers(userData);
    }
    loadUsers();
  }, [setUsers]);

  async function followUnfollow(isFollowing, followID, follower_email, index) {
    if (isFollowing) {
      let user = users;
      user[index].following = false;
      setUsers([...user]);
      await deleteFollow(followID);
    } else {
      let user = users;
      user[index].following = true;
      setUsers([...user]);
      await createFollow({
        user_email: props.user.email,
        follower_email: follower_email,
      });
    }
  }

  function FollowButton({ isFollowing, followID, follower_email, index }) {
    return (
      <Box ml={140} pr={5}>
        {isFollowing ? (
          <Button
            colorScheme="teal"
            variant="solid"
            textAlign={"center"}
            onClick={() =>
              followUnfollow(isFollowing, followID, follower_email, index)
            }
          >
            Following
          </Button>
        ) : (
          <Button
            variant="outline"
            textAlign={"center"}
            onClick={() =>
              followUnfollow(isFollowing, followID, follower_email, index)
            }
          >
            Follow
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box align={"center"} mt={15} minH={"75vh"}>
      <Heading color={"gray.500"}>Active Users</Heading>

      {users.map((user, index) => (
        <Box
          data-testid="follow"
          p={4}
          rounded={"lg"}
          borderWidth={1}
          maxW={"sm"}
          mt={5}
          mb={5}
          key={user.email}
        >
          <Flex>
            <Avatar bg="teal.500" size={"xl"} />
            <Box ml={4} mt={3}>
              <Heading p={1} size={"md"} textAlign={"left"}>
                {" "}
                {user.name}
              </Heading>
              <Text pl={1} textAlign={"left"}>
                {" "}
                {user.email}
              </Text>

              <FollowButton
                isFollowing={user.following}
                followID={user.follow_id}
                follower_email={user.email}
                index={index}
              />
            </Box>
          </Flex>
        </Box>
      ))}
    </Box>
  );
}

export default Users;
