import { Box, Avatar, Heading, Text, Link, Button } from "@chakra-ui/react";
import { generatePath, useNavigate } from "react-router-dom";

import { deleteFollow } from "../data/repository";

function UserDisplay({ name, email, id, user, currentUser }) {
  //   const [profileLink, setProfileLine] = useState("");
  const navigate = useNavigate();

  function generateLink() {
    navigate(generatePath("/profile/:id", { id: email }));
    window.location.reload(true);
  }
  async function unfollow() {
    window.location.reload(true);
    await deleteFollow(id);
  }
  return (
    <Box align={"center"} key={id}>
      <Box pt={3} align={"center"}>
        <Avatar bg="teal.500" size={"md"} />
      </Box>
      <Box p={3}>
        <Link onClick={generateLink}>
          <Heading size="sm">{name}</Heading>
          <Text color={"gray.500"} fontSize={"xs"}>
            {" "}
            {email}
          </Text>
        </Link>
      </Box>
      {user === currentUser ? (
        <Button
          colorScheme="teal"
          variant="solid"
          textAlign={"center"}
          size={"sm"}
          onClick={() => unfollow.apply()}
        >
          Unfollow
        </Button>
      ) : (
        <></>
      )}
    </Box>
  );
}

export default UserDisplay;
