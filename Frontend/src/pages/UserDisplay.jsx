import { Box, Avatar } from "@chakra-ui/react";
import { generatePath, useNavigate, Link } from "react-router-dom";

function UserDisplay({ id }) {
  return (
    <Box align={"center"} key={id}>
      <Box pt={3} align={"center"}>
        <Link to={`/profile/${id}`}>
          <Avatar bg="teal.500" size={"md"} />
        </Link>
      </Box>
    </Box>
  );
}

export default UserDisplay;
