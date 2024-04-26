import React from "react";
import { Box, Avatar, Heading, Text, HStack, FormControl, Editable, EditablePreview } from "@chakra-ui/react";

export default function Comment({ username, createdAt, content }) {
  return (
    <Box px={3} mt={1}>
      <HStack spacing={2} direction="row">
        <Box pt={2} pb={2}>
          <Avatar bg="teal.500" size={"md"} />
        </Box>
        <Box p={3} flex="1">
          <HStack spacing="24px">
            <Heading size="sm">{username}</Heading>
            <Text color={"gray.500"} fontSize={"xs"}>
              {" "}
              Posted On{" "}
              {Intl.DateTimeFormat("en-GB", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(new Date(createdAt))}
            </Text>
          </HStack>

          <FormControl marginTop={0}>
            <Editable defaultValue={content} isPreviewFocusable={false}>
              <HStack justifyContent={"space-between"}>
                <EditablePreview />
                {/* Here is the custom input */}
              </HStack>
            </Editable>
          </FormControl>
        </Box>
      </HStack>
    </Box>
  );
}
