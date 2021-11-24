import { Box, Code, Grid, Text } from "@chakra-ui/react";
import React from "react";
import { useParams } from "react-router-dom";

export default function Group(): JSX.Element {
  const { group } = useParams();
  return (
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <Text>
          Group: <Code>{group}</Code>.
        </Text>
      </Grid>
    </Box>
  );
}
