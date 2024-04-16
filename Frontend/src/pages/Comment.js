import { Box, Flex, Avatar, Heading, Text } from "@chakra-ui/react";

function Comment({ name, time, content, link }) {
  // const post = { user: "Me", time: "Time here", value: "soome random post" };
  return (
    <Box>
      <Box p={4} rounded={"lg"} borderWidth={1} mt={3}>
        <Flex>
          <Box pt={2} pb={2}>
            <Avatar bg="teal.500" size={"md"} />
          </Box>
          <Box p={3}>
            <Heading size="sm">{name}</Heading>
            <Text color={"gray.500"} fontSize={"xs"}>
              {" "}
              Posted On{" "}
              {Intl.DateTimeFormat("en-GB", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(new Date(time))}
            </Text>
          </Box>
        </Flex>

        <Box p={4}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          {link && (
            <Box p={5}>
              <div className="image-preview">
                <img src={link} alt="preview" height={200} width={400} />
              </div>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Comment;
